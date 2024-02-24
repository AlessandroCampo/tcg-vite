<template>
    <div class="playerfield-container" @dragover="allowDrop($event)" @dragenter="allowDrop($event)" @drop="drop($event)">

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
    methods: {
        allowDrop(event) {
            event.preventDefault();
        },
        drop(event) {
            const propCard = this.generalStore.draggedCardObj
            event.target.append(this.generalStore.draggedCard)
            this.generalStore.draggedCard = undefined
            this.generalStore.draggedCardObj = undefined
            console.log(propCard.triggerTiming)
            this.generalStore.playerMana.current = this.generalStore.playerMana.current - propCard.cost
            if (propCard && propCard.triggerTiming == 'onPlay') {
                console.log('yo')
                propCard.ability();
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
    bottom: 28%;
    left: 50%;
    transform: translateX(-50%);



}
</style>