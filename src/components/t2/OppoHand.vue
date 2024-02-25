<template>
    <div class="hand-container">
        <FacedownCard v-for=" cards in generalStore.opponent.hand"></FacedownCard>
    </div>
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
    width: 75%;
    display: flex;
    flex-direction: row-reverse;
    padding-block: 0.5em;
    top: -8%;
    left: 52%;
    transform: translateX(-50%);
    justify-content: center;
}
</style>