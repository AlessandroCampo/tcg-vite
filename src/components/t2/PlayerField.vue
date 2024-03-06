<template>
    <div class="playerfield-container" @dragover="allowDrop($event)" @dragenter="allowDrop($event)"
        @drop="playCard($event)" id="player-field">
        <GameCard v-for="(card, index) in generalStore.player.field" :key="card.id" :propCard="card"
            :isPlayerOwned="true" :propIndex="index"></GameCard>
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
// const player_db = useDocument(doc(collection(db, 'Users'), 'Player1'));
export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    created() {

    },
    components: { GameCard },
    methods: {
        hasOnPlayEffect(card) {
            let result = false
            card.ability.forEach((singleAbility) => {
                if (singleAbility.triggerTiming == 'onPlay') {
                    result = true
                }
            })
            return result
        },
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
            if (this.generalStore.player.field.length > 7) {
                return
            }

            this.generalStore.player.mana.current = this.generalStore.player.mana.current - propCard.cost.current
            this.generalStore.draggedCard = undefined
            this.generalStore.draggedCardObj = undefined



            if (propCard.type === 'unit') {
                this.generalStore.summonUnit(propCard)
                this.generalStore.checkTraps(propCard, undefined, 'onSummon')
            } else if (propCard.type === 'spell') {
                this.generalStore.playSpell(propCard)
            } else if (propCard.type === 'trap') {
                this.generalStore.playTrap(propCard)
            }

            const propProxy = document.getElementById(propCard.id)

            if (propCard && propCard.ability && this.hasOnPlayEffect(propCard) && propCard.type == 'unit') {
                this.generalStore.checkAbility(propCard)
                propCard.canAttack = true
                if (propCard.ability.target && this.generalStore.opponent.field.length == 0) {
                    propCard.canAttack = false
                }

            } else if (propCard && propCard.ability && propCard.type == 'spell') {
                this.generalStore.checkAbility(propCard)
            }
            this.generalStore.updateDB()
        }
    },
    watch: {
        'generalStore.opponent.lastAction': function (newValue, oldValue) {
            if (newValue !== oldValue && newValue.action) {
                let action = this.generalStore.opponent.lastAction
                this.generalStore.performLastAction(action.action, action.card, action.target, action.cardObj, action.targetObj)
            }
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