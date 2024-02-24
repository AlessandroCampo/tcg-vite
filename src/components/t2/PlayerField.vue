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

            const propCard = this.generalStore.draggedCardObj
            if (propCard.cost > this.generalStore.player.mana.current) {
                return
            }
            this.generalStore.player.mana.current = this.generalStore.player.mana.current - propCard.cost
            const playerHandArray = this.generalStore.player.hand
            const playerFieldArray = this.generalStore.player.field
            const propCardIndex = playerHandArray.indexOf(propCard)
            playerHandArray.splice(propCardIndex, 1)
            playerFieldArray.push(propCard)
            // event.target.append(this.generalStore.draggedCard)
            this.generalStore.draggedCard.classList.remove('in-hand')
            this.generalStore.draggedCard = undefined
            this.generalStore.draggedCardObj = undefined



            if (propCard && propCard.triggerTiming == 'onPlay' && propCard.ability) {
                this.generalStore.checkAbility(propCard.ability, propCard)
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
    border: 2px solid palevioletred;



}
</style>