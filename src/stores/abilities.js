import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    async draw(card) {
        useGeneralStore().$state.freeze = false
        for (let i = 0;i < card.ability.amount;i++) {
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
    modifyStat(card) {
        let ability = card.ability;
        let player = useGeneralStore().$state.player;
        let opponent = useGeneralStore().$state.opponent;
        const condition = card.ability.condition
            ? new Function('player', `return ${card.ability.condition}`)
            : () => true;

        if (!condition(player)) {
            useGeneralStore().$state.freeze = false
            return;
        }

        if (card.ability.cost) this.checkCost(card.ability.cost);
        let target;
        if (ability.selfTarget) {
            target = card;
        } else {

            const condition = card.ability.condition
                ? new Function('unit', `return ${card.ability.condition}`)
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
    discard(card) {
        if (card.ability.cost) this.checkCost(card.ability.cost);
        let oppoHand = useGeneralStore().$state.opponent.hand;
        for (let i = 0;i < card.ability.amount;i++) {
            let randomOppoHandCardIndex = Math.floor(Math.random() * oppoHand.length);
            oppoHand.splice(randomOppoHandCardIndex, 1);
        }
        useGeneralStore().$state.freeze = false;
        useGeneralStore().updateBothDb()
    },
    targetKill(card) {
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }

        const oppoField = useGeneralStore().$state.opponent.field;
        const condition = card.ability.condition
            ? new Function('unit', `return ${card.ability.condition}`)
            : new Function('unit', 'return true');


        const selectionCallback = (selectedCard, array) => {
            const index = array.indexOf(selectedCard);
            if (index !== -1) {

                card.canAttack = false
                selectedCard.killed = true

                useGeneralStore().updateOpponentDB()
                // array.splice(index, 1)
                // setTimeout(() => { useGeneralStore().$state.opponent.field.splice(index, 1); useGeneralStore().updateBothDb(); }, 1000)
            }
        };

        useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));
    },
    kill(card, target) {
        let delay = card.type !== 'trap' ? 1000 : 2000
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
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
    steal(card) {
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }

        const oppoField = useGeneralStore().$state.opponent.field;
        const playerField = useGeneralStore().$state.player.field;
        const condition = card.ability.condition
            ? new Function('unit', `return ${card.ability.condition}`)
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
    async modifyLp(card) {
        useGeneralStore().$state.freeze = false;
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }

        const increment = 1;
        const delay = 300;

        if (card.ability.gain) {
            const initialLP = useGeneralStore().$state.player.lp;
            const finalLP = initialLP + card.ability.amount;


            for (let lp = initialLP;lp <= finalLP;lp += increment) {
                useGeneralStore().$state.player.lp = lp;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } else {
            const initialLP = useGeneralStore().$state.opponent.lp;
            const finalLP = initialLP - card.ability.amount;


            for (let lp = initialLP;lp >= finalLP;lp -= increment) {
                useGeneralStore().$state.opponent.lp = lp;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        useGeneralStore().updateDB();
    }
    ,
    checkCost(cost) {
        if (cost.from === 'hp') {
            useGeneralStore().$state.player.lp -= cost.amount;
        } else if (cost.from === 'mana') {
            useGeneralStore().$state.player.mana.current -= cost.amount;
        }
    },
    healAll(card) {
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
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
    reborn(card) {

        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }
        const graveyard = card.ability.ownGraveyard ? useGeneralStore().$state.player.graveyard : useGeneralStore().$state.opponent.graveyard;
        if (graveyard.length == 0) return;
        const condition = card.ability.condition
            ? new Function('unit', 'index', 'graveyard', `return ${card.ability.condition}`)
            : new Function('unit', 'index', 'graveyard', 'return true');
        let rebornTarget = null;
        for (let i = 0;i < graveyard.length;i++) {
            const unit = graveyard[i];
            if (condition(unit, i, graveyard)) {
                unit.killed = false;
                unit.hp.current = unit.hp.original;
                unit.canAttack = false
                rebornTarget = unit;
                break; // Exit the loop after reborn the first unit that meets the condition
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
    async drawAndGain(card) {
        useGeneralStore().$state.freeze = false;
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }
        const drawnCard = useGeneralStore().drawOne();
        console.log(drawnCard);
        if (card.ability.gain) {
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



