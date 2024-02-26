<template>
    <div class="card-base in-hand" :style="{ 'background-image': 'url(' + propCard.imgPath + ')' }" :draggable="!disable()"
        @dragstart="startDrag($event)" @drop="attacked($event); targetted($event)" ref="card"
        :class="[propCard.hp <= 0 ? 'fading' : '', disable() ? 'disabled' : '']" :id="generateCardId()">
        <span class="cost stat" :class="statClass(propCard.cost, originalStats.original_cost)"> {{ propCard.cost }}
        </span>
        <span class="op stat" :class="statClass(propCard.op, originalStats.original_op)"> {{ propCard.op }} </span>
        <span class="hp stat" :class="statClass(propCard.hp, originalStats.original_hp)"> {{ propCard.hp }} </span>
        <img src="../../assets/img/animations/sleep.gif" alt="" class="animation"
            v-if="propCard.status === 'onField' && !propCard.canAttack">
    </div>
</template>
  

<script>
import { useGeneralStore } from '../../stores/generalStore'
import gsap from 'gsap'
export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            originalStats: {
                original_cost: undefined,
                original_op: undefined,
                original_hp: undefined
            }
        }
    },
    props: ['propCard', 'isPlayerOwned', 'propIndex'],
    mounted() {
        gsap.to(this.$refs.card, {
            width: 170 + 'px',
            height: 250 + 'px',
            duration: 1,
        })

        this.originalStats.original_op = this.propCard.op
        this.originalStats.original_hp = this.propCard.hp
        this.originalStats.original_cost = this.propCard.cost
    },
    methods: {
        attacked(e) {
            const attacker = this.generalStore.draggedCardObj
            const attackerProxy = this.generalStore.draggedCard
            const target = this.propCard
            const targetProxy = e.target


            if (this.isPlayerOwned) return
            if (attacker.status !== 'onField') return

            this.generalStore.player.lastAction = {
                card: attackerProxy.id,
                target: targetProxy.id,
                cardObj: attacker,
                targetObj: target,
                action: 'attack'
            }
            this.generalStore.updateBothDb()
            this.generalStore.resetActionObj()
            this.generalStore.animateAttack(attackerProxy, targetProxy, attacker.op, target.op)
            // setTimeout(() => {
            //     this.generalStore.battle(attacker, target, attackerProxy, targetProxy)
            // }, 700)

        },
        targetted(e) {
            const targettingProxy = this.generalStore.draggedCard
            console.log(targettingProxy)
            const targettingCard = this.generalStore.draggedCardObj
            const target = this.propCard
            const targetProxy = e.target
            const spliceIndex = this.generalStore.player.hand.indexOf(targettingCard)
            if (this.isPlayerOwned) return
            if (targettingCard.type !== 'spell') return
            this.generalStore.player.mana.current -= targettingCard.cost
            this.generalStore.checkAbility(targettingCard.ability.name, target)
            setTimeout(() => {
                this.generalStore.player.hand.splice(spliceIndex, 1)
                this.generalStore.updateBothDb()
            }, 500)



        },
        statClass(currentValue, originalValue) {
            if (currentValue > originalValue) {
                return "higher";
            } else if (currentValue < originalValue) {

                return "lower";
            } else {
                return "";
            }
        },
        disable() {
            let disable = false
            if (this.generalStore.player.activeTurn === false && this.isPlayerOwned) {
                disable = true
            }
            if (!this.propCard.canAttack && this.propCard.status === 'onField') {
                disable = true
            }

            return disable
        },
        startDrag(e) {
            this.generalStore.draggedCard = e.target
            console.log(this.generalStore.draggedCard)
            this.generalStore.draggedCardObj = this.propCard
        },
        generateCardId() {
            const myID = this.generalStore.player.uid
            const oppoID = this.generalStore.opponentUid
            const cardIndex = this.propIndex
            const cardName = this.propCard.name
            let ID
            if (this.isPlayerOwned) {
                ID = myID
            } else {
                ID = oppoID
            }
            return ID + '-' + cardName + '-' + cardIndex
        }
    },
    watch: {
        'propCard.hp': async function (newHP, oldHP) {
            if (newHP <= 0 && !this.isPlayerOwned) {
                setTimeout(async (
                ) => {
                    const index = this.generalStore.opponent.field.indexOf(this.propCard);
                    this.generalStore.opponent.field.splice(index, 1);
                    await this.generalStore.updateOpponentDB()
                }, 600)

            }
        },
        'generalStore.opponent.lastAction': function (newValue, oldValue) {
            if (newValue !== oldValue) {
                let action = this.generalStore.opponent.lastAction
                console.log('generalStore.opponent.lastAction changed:', newValue);
                this.generalStore.performLastAction(action.action, action.card, action.target, action.cardObj, action.targetObj)

            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card-base {
    height: 0;
    width: 0px;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;

    &:hover {
        scale: 1.8;
        transform: translateY(-30%);
        border: 2px solid aqua inset;
        box-shadow: 5px 10px 20px aqua inset;
        border-radius: 20px;
        z-index: 2;
        cursor: grab;
    }

    &:active {
        scale: 1;
        transform: 0;

    }

    .stat {
        position: absolute;
        font-size: 1.2em;
        font-weight: bold;
        color: white;
    }

    .op,
    .hp {
        bottom: 4.5%;
    }

    .op {
        left: 10%;
    }

    .hp {
        right: 10%;
    }

    .cost {
        left: 10%;
        top: 5%;
    }
}

.card-base.disabled {
    cursor: not-allowed;
    filter: grayscale(70%);
}

.stat.lower {
    color: red;
}

.stat.higher {
    color: green;
}

.fading.fading {
    animation: fadeOut 0.6s ease forwards;
}

.animation {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    pointer-events: none;
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>