import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    async draw(card, abilityIndex) {
        let ability = card.ability[abilityIndex];
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        useGeneralStore().$state.freeze = false
        for (let i = 0;i < ability.amount;i++) {
            useGeneralStore().drawOne()
        }
        useGeneralStore().$state.freeze = false
        if (card.type == 'spell') {
            setTimeout(() => {
                useGeneralStore().$state.player.activatedCard = null
                useGeneralStore().updateDB()
            }, 1200)
        }
    },
    modifyStat(card, abilityIndex) {
        let ability = card.ability[abilityIndex];
        let player = useGeneralStore().$state.player;
        let opponent = useGeneralStore().$state.opponent;
        let target;
        const condition = ability.condition
            ? new Function('player', 'target', `return ${ability.condition}`)
            : () => true;

        if (ability.cost) this.checkCost(ability.cost);

        if (ability.selfTarget) {
            target = card;
        } else if (!ability.selfTarget && !ability.randomTarget) {
            const condition = ability.condition
                ? new Function('unit', `return ${ability.condition}`)
                : new Function('unit', 'return true');

            const oppoField = useGeneralStore().$state.opponent.field;
            const allyField = useGeneralStore().$state.player.field;
            const targetArray = ability.buff ? allyField : oppoField
            const selectionCallback = (selectedCard, array) => {

                const index = array.indexOf(selectedCard);
                if (isNaN(ability.amount)) {

                    ability.amount = this.convertAmount(ability.amount, ability.targetStat, selectedCard)

                }
                if (card.type == 'spell') {
                    useGeneralStore().$state.player.activatedCard = null
                }
                if (index !== -1) {
                    if (selectedCard && selectedCard?.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) {
                        ability.amount = 0
                    }
                    if (ability.buff) {
                        selectedCard[ability.targetStat].current += ability.amount;
                    } else {
                        selectedCard[ability.targetStat].current -= ability.amount;
                    }
                    if (selectedCard[ability.targetStat].current < 0) {
                        selectedCard[ability.targetStat].current = 0
                    }
                    if (ability.newOriginal) {
                        selectedCard[ability.targetStat].original = selectedCard[ability.targetStat].current
                    }
                    useGeneralStore().updateBothDb()
                }
            }

            useGeneralStore().generateChoice(targetArray, condition, (selectedCard) => selectionCallback(selectedCard, targetArray));

        } else if (!ability.selfTarget && ability.randomTarget) {
            let validTargetsIndexes = [];
            if (ability.buff) {

                player.field.forEach((unit, index) => {
                    if (condition(player, unit)) {
                        validTargetsIndexes.push(index);
                    }
                });
            } else {
                opponent.field.forEach((unit, index) => {
                    if (condition(player, unit)) {
                        validTargetsIndexes.push(index);
                    }
                });
            }
            if (validTargetsIndexes.length > 0) {
                const randomIndex = Math.floor(Math.random() * validTargetsIndexes.length);
                const selectedIndex = validTargetsIndexes[randomIndex];
                target = ability.buff ? player.field[selectedIndex] : opponent.field[selectedIndex];
            } else {
                // u sure?
                useGeneralStore().$state.freeze = false;
                return
            }
        }

        if (isNaN(ability.amount)) {
            ability.amount = this.convertAmount(ability.amount, ability.targetStat, target)
        }
        if (target && target?.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) {
            ability.amount = 0
        }
        if (ability.buff && target && condition(player, target)) {
            target[ability.targetStat].current += ability.amount;
        } else if (!ability.buff && target && condition(player, target)) {
            target[ability.targetStat].current -= ability.amount;
        }
        if (ability.newOriginal) {
            target[ability.targetStat].original = target[ability.targetStat].current
        }
        useGeneralStore().$state.freeze = false;
    },
    discard(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        if (ability.cost) this.checkCost(ability.cost);
        let oppoHand = useGeneralStore().$state.opponent.hand;
        for (let i = 0;i < ability.amount;i++) {
            let randomOppoHandCardIndex = Math.floor(Math.random() * oppoHand.length);
            oppoHand.splice(randomOppoHandCardIndex, 1);
        }
        useGeneralStore().$state.freeze = false;
        useGeneralStore().updateBothDb()
    },
    targetKill(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        if (ability.cost) {
            this.checkCost(ability.cost);
        }

        const oppoField = useGeneralStore().$state.opponent.field;
        const condition = ability.condition
            ? new Function('unit', `return ${ability.condition}`)
            : new Function('unit', 'return true');


        const selectionCallback = (selectedCard, array) => {
            const index = array.indexOf(selectedCard);
            if (index !== -1) {
                if (selectedCard.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) return
                card.canAttack = false
                selectedCard.killed = true
                useGeneralStore().updateOpponentDB()
            }
        };

        useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));
    },
    kill(card, target, abilityIndex) {
        let ability = card.ability[abilityIndex]
        let delay = card.type !== 'trap' ? 1000 : 2000
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        const condition = ability.condition
            ? new Function('player', 'target', `return ${ability.condition}`)
            : () => true;
        const cardField = useGeneralStore().$state.player.field;
        const index = cardField.indexOf(target);
        if (index !== -1) {
            target.killed = true;
            if (target.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) {
                target.killed = false
            }
            useGeneralStore().updateBothDb()
            setTimeout(() => {
                useGeneralStore().$state.opponent.activatedCard = null;
                useGeneralStore().$state.freeze = false;
                useGeneralStore().updateBothDb()
            }, delay)
        }
    },
    steal(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        if (ability.cost) {
            this.checkCost(ability.cost);
        }

        const oppoField = useGeneralStore().$state.opponent.field;
        const playerField = useGeneralStore().$state.player.field;
        const condition = ability.condition
            ? new Function('unit', `return ${ability.condition}`)
            : new Function('unit', 'return true');

        const selectionCallback = (selectedCard, array) => {
            const index = array.indexOf(selectedCard);
            if (card.type == 'spell') {
                useGeneralStore().$state.player.activatedCard = null
            }
            if (index !== -1) {
                const modifiedCard = JSON.parse(JSON.stringify(selectedCard));
                modifiedCard.id = modifiedCard.id += 'copy'
                selectedCard.killed = true

                modifiedCard.canAttack = false
                playerField.push(modifiedCard);
                useGeneralStore().updateBothDb()

            }
        };

        useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));
    },
    async modifyLp(card, abilityIndex, abilityIndexBackup) {
        // "creative" solution in case I need to pass abilityIndex as 3rd param
        let trapTarget
        if (card.type == 'trap') {
            if (isNaN(abilityIndex)) {
                trapTarget = abilityIndex
                abilityIndex = abilityIndexBackup
                setTimeout(() => { useGeneralStore().$state.opponent.activatedCard = null; useGeneralStore().updateBothDb() }, 1000)
            }
        }

        let ability = card.ability[abilityIndex]
        useGeneralStore().$state.freeze = false;


        if (ability.cost) {
            this.checkCost(ability.cost);
        }

        if (isNaN(ability.amount)) {
            ability.amount = this.convertAmount(ability.amount, ability.targetStat, trapTarget)
        }

        const increment = 1;
        const delay = 300;

        if (ability.gain) {
            const isPlayerOwned = useGeneralStore().isPlayerOwned(card.id);
            const initialLP = isPlayerOwned ? useGeneralStore().$state.player.lp : useGeneralStore().$state.opponent.lp;
            const finalLP = initialLP + ability.amount;


            for (let lp = initialLP;lp <= finalLP;lp += increment) {
                if (isPlayerOwned) {
                    useGeneralStore().$state.player.lp = lp
                } else {
                    useGeneralStore().$state.opponent.lp = lp
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }

        }
        else {
            const initialLP = useGeneralStore().isPlayerOwned(card.id) ? useGeneralStore().$state.player.lp : useGeneralStore().$state.opponent.lp;
            const finalLP = initialLP - ability.amount;


            for (let lp = initialLP;lp >= finalLP;lp -= increment) {
                useGeneralStore().$state.opponent.lp = lp;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        useGeneralStore().updateBothDb();
    },
    checkCost(cost) {
        if (cost.from === 'hp') {
            useGeneralStore().$state.player.lp -= cost.amount;
        } else if (cost.from === 'mana') {
            useGeneralStore().$state.player.mana.current -= cost.amount;
        }
    },
    healAll(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        useGeneralStore().$state.freeze = false
        useGeneralStore().$state.player.field.forEach((unit) => {
            unit.hp.current = unit.hp.original
        })
        setTimeout(() => {
            useGeneralStore().$state.player.activatedCard = null
            useGeneralStore().updateDB()
        }, 1200)

    },
    reborn(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        const graveyard = ability.ownGraveyard ? useGeneralStore().$state.player.graveyard : useGeneralStore().$state.opponent.graveyard;
        if (graveyard.length == 0) return;
        const condition = ability.condition
            ? new Function('unit', 'index', 'graveyard', `return ${ability.condition}`)
            : new Function('unit', 'index', 'graveyard', 'return true');
        let rebornTarget = null;
        for (let i = 0;i < graveyard.length;i++) {
            const unit = graveyard[i];
            if (condition(unit, i, graveyard)) {
                unit.killed = false;
                unit.hp.current = unit.hp.original;
                unit.canAttack = false
                unit.cardKilledHandled = false
                rebornTarget = unit;
                break;
            }
        }
        if (rebornTarget) {
            const index = graveyard.indexOf(rebornTarget)
            graveyard.splice(index, 1)
            useGeneralStore().$state.player.field.push(rebornTarget);
            useGeneralStore().$state.freeze = false;
            useGeneralStore().updateBothDb();
            setTimeout(() => {
                useGeneralStore().$state.player.activatedCard = null;
                useGeneralStore().updateBothDb();
            }, 1200);
        }
    },
    async drawAndGain(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        useGeneralStore().$state.freeze = false;
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        const drawnCard = useGeneralStore().drawOne();

        if (ability.gain) {
            const initialLP = useGeneralStore().$state.player.lp;
            const finalLP = initialLP + drawnCard.cost.current;
            const increment = 1;
            const delay = 300;

            // Increment LPs gradually
            for (let lp = initialLP;lp <= finalLP;lp += increment) {
                useGeneralStore().$state.player.lp = lp;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        await useGeneralStore().updateDB();
    },
    async gainAttribute(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        let player = useGeneralStore().$state.player;
        let opponent = useGeneralStore().$state.opponent;
        let target;
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        if (ability.selfTarget) {
            target = card
        }
        const condition = ability.condition
            ? new Function('player', 'target', `return ${ability.condition}`)
            : () => true;
        if (condition(player, target)) {
            card.attributes.push(ability.targetAttribute)
            if (card.attributes.includes('rush') || card.attributes.includes('fly')) {

                card.canAttack = true

            }
        }
        useGeneralStore().$state.freeze = false
        useGeneralStore().updateBothDb()
    },
    convertAmount(amount, stat, target) {

        if (amount == 'double') {
            return target[stat].current
        }
        if (amount == '= hp') {
            return target.hp.current - target[stat].current
        }
        if (amount == '= stat') {
            return target[stat].current
        }
    },
    negate(card, target, abilityIndex) {
        let ability = card.ability[abilityIndex]
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        useGeneralStore().$state.freeze = false
        if (card.type == 'trap') {
            setTimeout(() => { useGeneralStore().$state.opponent.activatedCard = null; useGeneralStore().updateBothDb() }, 1000)
        }
    },
    removeTrap(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        const oppoTraps = useGeneralStore().$state.opponent.traps
        const condition = ability.condition
            ? new Function('player', 'target', `return ${ability.condition}`)
            : () => true;
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        if (oppoTraps.length > 0) {
            for (let i = 0;i < ability.amount;i++) {

                let randomTrapIndex = Math.floor(Math.random() * oppoTraps.length)
                oppoTraps.splice(randomTrapIndex, 1)
            }
        }
        setTimeout(() => {

            useGeneralStore().$state.player.activatedCard = null
            useGeneralStore().$state.freeze = false
            useGeneralStore().updateBothDb()
        }, 1000)




    },
    dealDamage(card, abilityIndex) {
        console.log('damaging ability activated')
        console.log(card)
        let ability = card.ability[abilityIndex]
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        let oppoField = useGeneralStore().$state.opponent.field
        let playerField = useGeneralStore().$state.player.field
        let player = useGeneralStore().$state.player
        let target
        const condition = ability.condition
            ? new Function('player', 'target', `return ${ability.condition}`)
            : () => true;
        if (!condition(player, target)) {
            useGeneralStore().$state.freeze = false
            return
        }
        if (ability.targetSelection == 'random') {
            let randomOppoTarget = oppoField[Math.floor(Math.random() * oppoField.length)];
            let damageTarget;
            if (ability.canTargetAlly) {
                let randomAllyTarget = playerField[Math.floor(Math.random() * playerField.length)];
                let coinFlip = Math.floor(Math.random() * 2);
                if (coinFlip == 0 && !randomOppoTarget) {
                    coinFlip = 1
                }
                if (coinFlip == 0) {
                    damageTarget = randomOppoTarget;
                } else {
                    damageTarget = randomAllyTarget;
                }
            } else {
                damageTarget = randomOppoTarget;
            }
            if (damageTarget.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) {
                ability.amount = 0
            }
            damageTarget.hp.current -= ability.amount;
            if (damageTarget.hp.current <= 0) {
                damageTarget.killed = true
            }
        } else if (ability.targetSelection == 'all') {
            console.log('dealing damage to all')
            if (ability.canTargetAlly) {
                oppoField.forEach((unit) => { unit.hp.current -= ability.amount })
                playerField.forEach((unit) => {
                    if (unit.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) {
                        ability.amount = 0
                    }
                    unit.hp.current -= ability.amount
                    if (unit.hp.current <= 0) {
                        unit.killed = true
                    }
                })
            } else {

                oppoField.forEach((unit) => {
                    if (unit.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) {
                        ability.amount = 0
                    }
                    unit.hp.current -= ability.amount
                    console.log(ability.amount)
                    if (unit.hp.current <= 0) {
                        unit.killed = true
                    }

                })
            }
        } else if (ability.targetSelection == 'choose') {
            const selectionCallback = (selectedCard, array) => {
                const index = array.indexOf(selectedCard);
                if (index !== -1) {
                    // if (selectedCard.attributes.includes('immune') && (card.type == 'spell' || card.type == 'trap')) return
                    selectedCard.hp.current -= ability.amount
                    if (selectedCard.hp.current <= 0) {
                        selectedCard.killed = true
                    }
                    useGeneralStore().updateOpponentDB()
                }
            };

            useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));
        }

        useGeneralStore().$state.freeze = false
        useGeneralStore().updateBothDb()


    },
    playFromDeck(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        let player = useGeneralStore().$state.player
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        const condition = ability.condition
            ? new Function('player', `return ${ability.condition}`)
            : () => true;
        if (!condition(player)) {
            useGeneralStore().$state.freeze = false
            return
        }
        for (let i = 0;i < ability.amount;i++) {
            let matchedCardIndex = undefined
            player.deck.forEach((unit, index) => {
                if (unit.type == 'unit' && ability.targetCard && unit.name == ability.targetCard) {
                    matchedCardIndex = index
                }
            })
            if (matchedCardIndex !== undefined) {
                player.deck[matchedCardIndex].status = 'onField'
                player.deck[matchedCardIndex].canAttack = false
                player.field.push(player.deck[matchedCardIndex])
                player.deck.splice(matchedCardIndex, 1)
            }


        }
        useGeneralStore().updateBothDb()
        useGeneralStore().$state.freeze = false
    },
    returnToDeck(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        let player = useGeneralStore().$state.player
        let opponent = useGeneralStore().$state.opponent
        let target
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        const condition = ability.condition
            ? new Function('player', `return ${ability.condition}`)
            : () => true;
        if (!condition(player, target)) {
            useGeneralStore().$state.freeze = false
            return
        }
        for (let i = 0;i < ability.amount;i++) {
            let targetIndex = this.converTarget(ability.targetSelection, opponent.field)
            opponent.deck.push(opponent.field[targetIndex])
            opponent.field.splice(targetIndex, 1)
        }
        useGeneralStore().$state.freeze = false
        useGeneralStore().updateBothDb()
    },
    killAll(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        let player = useGeneralStore().$state.player
        let opponent = useGeneralStore().$state.opponent
        if (ability.cost) {
            this.checkCost(ability.cost);
        }
        const condition = ability.condition
            ? new Function('player', 'opponent', `return ${ability.condition}`)
            : () => true;
        if (!condition(player, opponent)) {
            useGeneralStore().$state.freeze = false
            return
        }
        opponent.field.forEach((unit, index) => {
            unit.killed = true
        })
        if (ability.canTargetAlly) {
            player.field.forEach((unit, index) => {
                unit.killed = true
            })
        }
        useGeneralStore().updateBothDb()
        useGeneralStore().$state.freeze = false
        setTimeout(() => {
            useGeneralStore().player.activatedCard = null
            useGeneralStore().updateBothDb()
        }, 1200)

    },
    converTarget(target, array) {
        if (target == 'lowest_cost') {
            let lowest_cost_unit;
            let lowest_cost_unit_index;
            array.forEach((card, index) => {
                if (typeof lowest_cost_unit === 'undefined' || card.cost < lowest_cost_unit.cost) {
                    lowest_cost_unit = card;
                    lowest_cost_unit_index = index;
                }
            });
            return lowest_cost_unit_index;
        }

    }


};



