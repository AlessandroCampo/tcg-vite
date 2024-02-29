import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    modifyStat(card) {
        let ability = card.ability;
        if (card.ability.cost) this.checkCost(card.ability.cost);
        let target;
        if (ability.selfTarget) {
            target = card;
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
        if (card.ability.cost) this.checkCost(card.ability.cost);
        let oppoField = useGeneralStore().$state.opponent.field;
        const condition = eval(card.condition);
        const selectionCallback = (selectedCard, array) => {
            const index = array.indexOf(selectedCard);
            if (index !== -1) {
                array.splice(index, 1);
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



