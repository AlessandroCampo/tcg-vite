<template>
    <div class="playerfield-container" @dragover="allowDrop($event)" @dragenter="allowDrop($event)" id="oppoField">
        <GameCardVue v-for="(card, index) in generalStore.opponent.field" :key="index" :propCard="card"
            :isPlayerOwned="false"></GameCardVue>
    </div>
</template>

<script>

import { useGeneralStore } from '../../stores/generalStore'
import GameCardVue from '../t3/GameCard.vue'





export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    methods: {
        allowDrop(event) {
            event.preventDefault();
        }
    },
    components: { GameCardVue },


}
</script>

<style lang="scss" scoped>
.playerfield-container {
    height: 25%;
    width: 80%;
    position: absolute;
    display: flex;
    justify-content: center;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);



}
</style>