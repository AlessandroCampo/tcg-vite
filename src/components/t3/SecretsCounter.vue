<template>
    <div class="counter-container">
        <img src="../../assets/img/animations/trap.gif" alt="">
        <div class="counter">
            {{ propCommander == 'player' ? generalStore.player.traps.length : generalStore.opponent.traps.length }}
        </div>

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
    props: ['propCommander']
}
</script>

<style lang="scss" scoped>
.counter-container {
    position: relative;
    width: fit-content;

    .counter {
        height: 50px;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        z-index: 30;
        border-radius: 50%;
        top: -15%;
        right: -15%;
        font-weight: bold;
        background-color: tomato;
        color: white;
        font-size: 1.4em;
        border: 2px solid black;
    }
}

img {
    width: 100px;
    height: 100px;
}
</style>