<template>
    <transition-group name="fade" class="hand-container" tag="div">
        <gameCard v-for="(card, index) in generalStore.player.hand" :key="'card_' + card.id" :propCard="card"
            :isPlayerOwned="true" :propIndex="index">
        </gameCard>
    </transition-group>
</template>

<script>
import GameCard from '../t3/GameCard.vue';
import { useGeneralStore } from '../../stores/generalStore'
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc } from 'firebase/firestore'
const db = useFirestore()
// const docRef = doc(db, 'Users');


export default {
    data() {
        return {
            generalStore: useGeneralStore()
        };
    },
    components: { GameCard },
    computed: {

    },

    async created() {

        // this.generalStore.generateDeck()
        this.generalStore.generateFirstHand(this.generalStore.player.deck)
        await this.generalStore.updateDB()
    },


    watch: {
        'generalStore.player.activeTurn': async function (newTurn, oldTurn) {
            if (newTurn && this.generalStore.player.mana.total !== 1) {
                this.generalStore.drawOne()
            }
        }
    }
}
</script>



<style lang="scss" scoped>
.hand-container {
    position: absolute;
    width: 52%;
    display: flex;
    flex-direction: row-reverse;
    padding-block: 0.5em;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    z-index: 4;

}



.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>