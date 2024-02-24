<template>
    <div class="card-base" :style="{ 'background-image': 'url(' + propCard.imgPath + ')' }" draggable="true" @dragstart="(e) => {
        generalStore.draggedCard = e.target
        generalStore.draggedCardObj = propCard
    }" :data-card="propCard">
        <span class="cost stat"> {{ propCard.cost }} </span>
        <span class="op stat"> {{ propCard.op }} </span>
        <span class="hp stat"> {{ propCard.hp }} </span>
    </div>
</template>
  

<script>
import { useGeneralStore } from '../../stores/generalStore'
export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    props: ['propCard'],
    created() {

    },
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
</style>