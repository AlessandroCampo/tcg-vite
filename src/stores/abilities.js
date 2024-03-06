import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    async draw(card, abilityIndex) {
        let ability = card.ability[abilityIndex];
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
        const condition = ability.condition
            ? new Function('player', `return ${card.ability.condition}`)
            : () => true;

        if (!condition(player)) {
            useGeneralStore().$state.freeze = false
            return;
        }

        if (ability.cost) this.checkCost(ability.cost);
        let target;
        if (ability.selfTarget) {
            target = card;
        } else {

            const condition = ability.condition
                ? new Function('unit', `return ${ability.condition}`)
                : new Function('unit', 'return true');

            const oppoField = useGeneralStore().$state.opponent.field;
            const selectionCallback = (selectedCard, array) => {
                const index = array.indexOf(selectedCard);
                if (card.type == 'spell') {
                    useGeneralStore().$state.player.activatedCard = null
                }
                if (index !== -1) {
                    if (ability.buff) {
                        selectedCard[ability.targetStat].current += ability.amount;
                    } else {
                        selectedCard[ability.targetStat].current -= ability.amount;
                    }
                    if (selectedCard[ability.targetStat].current < 0) {
                        selectedCard[ability.targetStat].current = 0
                    }
                    useGeneralStore().updateBothDb()
                }
            }

            useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));

        }
        if (ability.buff) {
            target[ability.targetStat].current += ability.amount;
        } else {
            target[ability.targetStat].current -= ability.amount;
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
        const cardField = useGeneralStore().$state.player.field;
        const index = cardField.indexOf(target);
        if (index !== -1) {
            target.killed = true;

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
    async modifyLp(card, abilityIndex) {
        let ability = card.ability[abilityIndex]
        useGeneralStore().$state.freeze = false;
        if (ability.cost) {
            this.checkCost(ability.cost);
        }

        const increment = 1;
        const delay = 300;

        if (ability.gain) {
            const initialLP = useGeneralStore().$state.player.lp;
            const finalLP = initialLP + ability.amount;


            for (let lp = initialLP;lp <= finalLP;lp += increment) {
                useGeneralStore().$state.player.lp = lp;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } else {
            const initialLP = useGeneralStore().$state.opponent.lp;
            const finalLP = initialLP - ability.amount;


            for (let lp = initialLP;lp >= finalLP;lp -= increment) {
                useGeneralStore().$state.opponent.lp = lp;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        useGeneralStore().updateDB();
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
        console.log(drawnCard);
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
    }

};



