import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    draw(card) {
        for (let i = 0;i < card.ability.amount;i++) {
            useGeneralStore().drawOne()
        }
        useGeneralStore().$state.freeze = false
        if (card.type == 'spell') {
            setTimeout(() => {
                useGeneralStore().$state.player.activatedCard = null
                useGeneralStore().updateBothDb()
            }, 500)


        }
    },
    modifyStat(card) {
        let ability = card.ability;
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
                selectedCard.killed = true
                useGeneralStore().updateBothDb()
                setTimeout(() => { array.splice(index, 1); }, 1000)

            }
        };

        useGeneralStore().generateChoice(oppoField, condition, (selectedCard) => selectionCallback(selectedCard, oppoField));
    },
    checkCost(cost) {
        if (cost.from === 'hp') {
            useGeneralStore().$state.player.lp -= cost.amount;
        } else if (cost.from === 'mana') {
            useGeneralStore().$state.player.mana.current -= cost.amount;
        }
    }
};



