<template>
    <div class="playerfield-container" @dragover="allowDrop($event)" @dragenter="allowDrop($event)"
        @drop="playCard($event)">
        <GameCard v-for="(card, index) in generalStore.player.field" :key="index" :propCard="card" :isPlayerOwned="true">
        </GameCard>
    </div>
</template>

<script>
import GameCard from '../t3/GameCard.vue'
import { useGeneralStore } from '../../stores/generalStore'
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc } from 'firebase/firestore'
const db = useFirestore()
const playerRef = doc(db, 'Users', 'Player1');
const player_db = useDocument(doc(collection(db, 'Users'), 'Player1'));
export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    components: { GameCard },
    methods: {
        allowDrop(event) {
            event.preventDefault();
        },
        async playCard(event) {

            const propProxy = this.generalStore.draggedCard
            const propCard = this.generalStore.draggedCardObj
            if (propCard.ability && propCard.type === 'spell' && propCard.ability.type === 'target_enemy' && this.generalStore.opponent.field.length === 0) {
                return
            }
            if (propCard.status !== 'inHand') {
                return
            }
            if (propCard.cost > this.generalStore.player.mana.current) {
                return
            }

            this.generalStore.player.mana.current = this.generalStore.player.mana.current - propCard.cost

            this.generalStore.draggedCard = undefined
            this.generalStore.draggedCardObj = undefined

            if (propCard.type === 'unit') {
                this.generalStore.summonUnit(propCard)
            }

            if (propCard && propCard.triggerTiming == 'onPlay' && propCard.ability && propCard.type == 'unit') {
                this.generalStore.checkAbility(propCard.ability.name, propCard)
            }
            this.generalStore.updateDB()
        }
    }
}
</script>

<style lang="scss" scoped>
.playerfield-container {
    height: 25%;
    width: 80%;
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);




}
</style>