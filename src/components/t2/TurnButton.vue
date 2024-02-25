<template>
    <button @click="changeTurn()" :class="generalStore.player.activeTurn ? 'active' : ''">
        {{ generalStore.player.activeTurn ? 'Your Turn' : 'Enemy Turn' }}
    </button>
</template>

<script>

import { useGeneralStore } from '../../stores/generalStore'


export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    methods: {
        changeTurn() {
            if (!this.generalStore.player.activeTurn) {
                return
            }
            this.generalStore.player.activeTurn = !this.generalStore.player.activeTurn
            this.generalStore.opponent.activeTurn = !this.generalStore.opponent.activeTurn
            this.generalStore.opponent.mana.total++
            this.generalStore.opponent.mana.current = this.generalStore.opponent.mana.total
            this.generalStore.updateDB()
            this.generalStore.updateOpponentDB()
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    position: absolute;
    width: 130px;
    padding-block: 22px;
    border: 2px solid black;
    border-radius: 20px;
    right: 12.5%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #e74c3c;
    color: #f0f0f0;

}

button.active {
    background-color: #2ecc71;
    color: #f0f0f0;
}
</style>