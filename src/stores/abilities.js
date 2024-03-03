import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    draw(card) {
        useGeneralStore().$state.freeze = false
        for (let i = 0;i < card.ability.amount;i++) {
            useGeneralStore().drawOne()
        }
        useGeneralStore().$state.freeze = false
        if (card.type == 'spell') {
            setTimeout(() => {
                useGeneralStore().$state.player.activatedCard = null
                useGeneralStore().updateDB()
            }, 1000)
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
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }
        const cardField = useGeneralStore().$state.player.field;
        const index = cardField.indexOf(target);
        if (index !== -1) {
            target.killed = true;
            useGeneralStore().updateDB()
            setTimeout(() => {
                useGeneralStore().$state.opponent.activatedCard = null;
                useGeneralStore().$state.freeze = false;
                useGeneralStore().updateBothDb()
            }, 1300)
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
                console.log(modifiedCard)
                // modifiedCard.killed = false
                modifiedCard.canAttack = false
                playerField.push(modifiedCard);
                useGeneralStore().updateOpponentDB()

            }
        };

        useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));
    },
    modifyLp(card) {
        useGeneralStore().$state.freeze = false
        if (card.ability.cost) {
            this.checkCost(card.ability.cost);
        }
        if (card.ability.gain) {
            useGeneralStore().$state.player.lp += card.ability.amount
        } else if (!card.ability.gain) {
            useGeneralStore().$state.opponent.lp -= card.ability.amount
        }
        useGeneralStore().updateDB()
    },
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

    }


};



