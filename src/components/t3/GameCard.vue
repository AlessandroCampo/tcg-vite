<template>
    <div class="card-base in-hand" :style="{ 'background-image': `url(./img${propCard.imgPath})` }"
        :draggable="isDraggable()" @dragstart="startDrag($event)" @drop="attacked($event);" ref="card"
        :class="[propCard.killed == true ? 'fading' : '', disable() ? 'disabled' : '', playble() ? '' : 'not-playble']"
        :id="propCard.id">
        <div class="foil">

        </div>
        <span class="cost stat" :class="statClass(propCard.cost.current, propCard.cost.original)">
            {{ propCard.cost.current }}
        </span>
        <span class="op stat" :class="statClass(propCard?.op.current, propCard?.op.original)"
            v-if="propCard.type == 'unit' || propCard.type == 'commander'">
            {{ propCard?.op.current }}
        </span>
        <span class="hp stat" :class="statClass(propCard?.hp.current, propCard?.hp.original)"
            v-if="propCard.type == 'unit' || propCard.type == 'commander'">
            {{ propCard?.hp.current }}
        </span>
        <img src="../../assets/img/animations/sleep.gif" alt="" class="animation"
            v-if="propCard.status === 'onField' && !propCard.canAttack">
    </div>


</template>


<script>
import { useGeneralStore } from '../../stores/generalStore'
import { debounce } from 'lodash';
import gsap from 'gsap'
import { connectStorageEmulator } from 'firebase/storage';
export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            originalStats: {
                original_cost: undefined,
                original_op: undefined,
                original_hp: undefined
            },
            cardKilledHandled: false,

        }
    },
    props: {
        propCard: {
            type: Object,
            required: true
        },
        isPlayerOwned: {
            type: Boolean,
        },
        propIndex: {
            type: Number,
            default: 0
        }
    },
    mounted() {

        this.$nextTick(() => {
            gsap.to(this.$el, {
                width: '170px',
                height: '250px',
                duration: 1,
            });
        });

    },
    methods: {
        hasOnKillEff(card) {
            let result = false
            card.ability.forEach((singleAbility) => {
                if (singleAbility.triggerTiming == 'onKilled') {
                    result = true
                }
            })

            return result
        },
        attacked(e) {
            const attacker = this.generalStore.draggedCardObj
            const attackerProxy = this.generalStore.draggedCard
            const target = this.propCard
            const targetProxy = e.target

            if (!this.isValidAttackTarget(target, attacker, this.generalStore.opponent.field)) {
                return
            }



            this.generalStore.battle(attacker, target)
            this.generalStore.sendActionObj(attacker, target, 'attack')

            this.generalStore.resetActionObj()

            this.generalStore.animateAttack(attackerProxy, targetProxy, attacker.op.current, target.op.current)


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
            if (this.generalStore.freeze && this.isPlayerOwned) {
                disable = true
            }
            if (this.generalStore.player.activeTurn === false && this.isPlayerOwned) {
                disable = true
            }
            if (!this.propCard.canAttack && this.propCard.status === 'onField') {
                disable = true
            }

            return disable
        },
        isDraggable() {
            let draggable = true

            if (this.generalStore.freeze) {
                draggable = false
            }

            if (!this.isPlayerOwned) {
                draggable = false
            }
            if (this.generalStore.player.activeTurn === false && this.isPlayerOwned) {
                draggable = false
            }
            if (!this.propCard.canAttack && this.propCard.status === 'onField') {
                draggable = false
            }
            return draggable
        },
        startDrag(e) {
            this.generalStore.draggedCard = this.$el;
            this.generalStore.draggedCardObj = this.propCard;
        },
        isValidAttackTarget(target, attacker, opponentField,) {
            // Check if the attacker is owned by the player or if its status isn't 'onField'
            if (this.isPlayerOwned || attacker.status !== 'onField') {
                return false;
            }

            let foundGuardians = false;

            // Check if there are any guardians on the opponent's field
            opponentField.forEach(unit => {
                if (unit.attributes.includes('guardian')) {
                    foundGuardians = true;
                }
            });

            // If guardians are found and the target is not a guardian, return false
            if (foundGuardians && !target.attributes.includes('guardian') && !attacker.attributes.includes('fly')) {
                return false;
            } else {
                // Otherwise, the attack target is valid
                return true;
            }
        },
        playble() {
            if (this.generalStore.player.mana.current >= this.propCard.cost.current) {
                return true
            } else {
                return false
            }
        }

    },
    watch: {
        'propCard.killed': {
            handler(newVal, oldVal) {
                if (newVal) {

                    if (!this.propCard.cardKilledHandled && this.isPlayerOwned) {
                        this.propCard.cardKilledHandled = true;

                        if (this.propCard.type === 'unit' && this.propCard.ability && this.hasOnKillEff(this.propCard) && this.isPlayerOwned) {

                            this.generalStore.resolveAbility(this.propCard)
                        }

                        setTimeout(async () => {
                            const player = this.generalStore.player;
                            const opponent = this.generalStore.opponent;
                            const removedFromPlayerField = player.field.some(card => card.id === this.propCard.id);
                            const removedFromOpponentField = opponent.field.some(card => card.id === this.propCard.id);

                            if (removedFromPlayerField) {
                                player.graveyard.push(this.propCard)
                                player.field = player.field.filter(card => card.id !== this.propCard.id);
                                (this.generalStore.player.graveyard)
                                await this.generalStore.updateDB();
                            } else if (removedFromOpponentField) {
                                opponent.field = opponent.field.filter(card => card.id !== this.propCard.id);
                                await this.generalStore.updateOpponentDB();
                            }


                        }, 1000);
                    }
                }
            },
            immediate: true
        },
        'propCard.counter': function (newVal, oldVal) {
            console.log(newVal)
            if (this.propCard.transformation && newVal == this.propCard.transformation.time && this.isPlayerOwned && !this.propCard.transformationHandled) {
                this.propCard.transformationHandled = true;
                setTimeout(() => {
                    this.generalStore.transformUnit(this.propCard)
                }, 500)


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
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
    z-index: 10;
    transform-style: preserve-3d;
    transition: transform 0.5s ease, opacity 1.2s ease;


    &:hover {
        scale: 1.4;
        transform: translateY(-30%);
        border: 2px solid aqua inset;
        box-shadow: 5px 10px 20px aqua inset;
        border-radius: 20px;
        z-index: 20;
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
    filter: grayscale(70%)
}


.stat.lower {
    color: red;
}

.stat.higher {
    color: green;
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

.fading {
    animation: fadeOut 1.8s ease-out forwards;
}

.hand-container .card-base.not-playble:hover {
    box-shadow: 0px 0px 10px 5px crimson;
    border: 2px solid crimson;
}

@keyframes shimmer {
    0% {
        opacity: 0.5;
    }

    50% {
        opacity: 0.8;
    }

    100% {
        opacity: 0.5;
    }
}


@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    35% {
        opacity: 0.8;
    }

    100% {
        opacity: 0.1;
    }
}
</style>