<template>
    <transition-group name="fade" tag="div" class="hand-container">
        <FacedownCard v-for="card in generalStore.opponent.hand" :key="card.id"></FacedownCard>
    </transition-group>
</template>

<script>
import FacedownCard from '../t3/FacedownCard.vue';
import { useGeneralStore } from '../../stores/generalStore'
export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    components: { FacedownCard }
}
</script>

<style lang="scss" scoped>
.hand-container {
    position: absolute;
    width: 42%;
    display: flex;
    flex-direction: row-reverse;
    padding-block: 0.5em;
    top: -8%;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}</style>