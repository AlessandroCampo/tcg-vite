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
            if (!this.generalStore.player.activeTurn || this.generalStore.freeze) {
                return
            }
            this.generalStore.game.currentTurn++
            let enemyUnits = this.generalStore.opponent.field
            enemyUnits.forEach(unit => {
                if (!unit.canAttack) {
                    unit.canAttack = true
                }
            });
            this.generalStore.player.activeTurn = false
            this.generalStore.opponent.activeTurn = true
            if (this.generalStore.opponent.mana.total < 10) {
                this.generalStore.opponent.mana.total++
            }

            this.generalStore.opponent.mana.current = this.generalStore.opponent.mana.total
            this.generalStore.opponent.commander.used = false
            this.generalStore.updateBothDb()
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    position: absolute;
    width: 150px;
    padding-block: 22px;
    border: 2px solid black;
    border-radius: 20px;
    right: 11.9%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #e74c3c;
    color: #f0f0f0;
    font-size: 20px;

}

button.active {
    background-color: green;
    color: #f0f0f0;
}
</style>