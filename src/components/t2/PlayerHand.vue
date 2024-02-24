<template>
    <div class="hand-container">
        <gameCard v-for="(card, index) in playerHand" :key="index" :propCard=card></gameCard>
    </div>
</template>

<script>
import GameCard from '../t3/GameCard.vue';
import { useGeneralStore } from '../../stores/generalStore'

export default {
    data() {
        return {
            cards: [],
            playerHand: []
        };
    },
    components: { GameCard },
    created() {
        const generalStore = useGeneralStore()
        this.cards = generalStore.cards;
        console.log(this.cards)
        // generalStore.initializeCards()
        generalStore.generateDeck()
        generalStore.generateFirstHand(generalStore.player.deck)
        this.playerHand = generalStore.player.hand


    },
}
</script>



<style lang="scss" scoped>
.hand-container {
    position: absolute;
    width: 75%;
    display: flex;
    padding-block: 0.5em;
    bottom: 1%;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
}
</style>