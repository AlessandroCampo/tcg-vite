<template>
    <div class="playerfield-container" @dragover="allowDrop($event)" @dragenter="allowDrop($event)" @drop="playCard($event)"
        id="player-field">
        <GameCard v-for="(card, index) in generalStore.player.field" :key="card.id" :propCard="card" :isPlayerOwned="true"
            :propIndex="index"></GameCard>
    </div>
</template>

<script>
import GameCard from '../t3/GameCard.vue'
import { useGeneralStore } from '../../stores/generalStore'
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc } from 'firebase/firestore'
import gsap from 'gsap'
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
        playCard(event) {
            const propCard = this.generalStore.draggedCardObj
            if (propCard.ability && propCard.type === 'spell' && propCard.ability.type === 'target_enemy' && this.generalStore.opponent.field.length === 0) {
                return
            }
            if (propCard.status !== 'inHand' || this.generalStore.selecting) {
                return
            }
            if (propCard.cost.current > this.generalStore.player.mana.current) {
                return
            }

            this.generalStore.player.mana.current = this.generalStore.player.mana.current - propCard.cost.current
            this.generalStore.draggedCard = undefined
            this.generalStore.draggedCardObj = undefined



            if (propCard.type === 'unit') {

                this.generalStore.summonUnit(propCard)
            }

            const propProxy = document.getElementById(propCard.id)

            if (propCard && propCard.ability.triggerTiming == 'onPlay' && propCard.ability && propCard.type == 'unit') {
                this.generalStore.checkAbility(propCard.ability.effect, propCard)
                propCard.canAttack = true
                if (propCard.ability.type === 'target' && this.generalStore.opponent.field.length == 0) {
                    propCard.canAttack = false
                }

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
    perspective: 1000px;

    .card-base {
        z-index: 1;
    }

}
</style>