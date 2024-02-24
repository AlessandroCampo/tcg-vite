<template>
    <div class="card-base in-hand" :style="{ 'background-image': 'url(' + propCard.imgPath + ')' }" draggable="true"
        @dragstart="(e) => {
            generalStore.draggedCard = e.target
            generalStore.draggedCardObj = propCard
            console.log(propCard)
        }" @drop="attacked($event)" ref="card" :class="propCard.hp <= 0 ? 'fading' : ''">
        <span class="cost stat" :class="statClass(propCard.cost, originalStats.original_cost)"> {{ propCard.cost }}
        </span>
        <span class="op stat" :class="statClass(propCard.op, originalStats.original_op)"> {{ propCard.op }} </span>
        <span class="hp stat" :class="statClass(propCard.hp, originalStats.original_hp)"> {{ propCard.hp }} </span>

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
    props: ['propCard', 'isPlayerOwned'],
    created() {
        this.originalStats.original_op = this.propCard.op
        this.originalStats.original_hp = this.propCard.hp
        this.originalStats.original_cost = this.propCard.cost
    },
    methods: {
        attacked(e) {
            const attacker = this.generalStore.draggedCardObj
            const target = this.propCard
            const attackerProxy = this.generalStore.draggedCard
            const targetProxy = e.target
            this.generalStore.battle(attacker, target, attackerProxy, targetProxy)
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
    },
    watch: {
        'propCard.hp': async function (newHP, oldHP) {
            console.log(newHP)
            if (newHP <= 0 && !this.isPlayerOwned) {


                setTimeout(async (
                ) => {
                    const index = this.generalStore.opponent.field.indexOf(this.propCard);
                    this.generalStore.opponent.field.splice(index, 1);
                    await this.generalStore.updateOpponentDB()
                }, 600)

            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card-base {
    height: 250px;
    width: 170px;
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

.stat.lower {
    color: red;
}

.stat.higher {
    color: green;
}

.fading.fading {
    animation: fadeOut 0.6s ease forwards;
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