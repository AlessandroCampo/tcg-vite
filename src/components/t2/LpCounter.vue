<template>
    <div class="lp-container" :class="playerLp ? 'player' : 'opponent'" :style="{ color: getFontColor(propLp) }">
        {{ propLp }}
    </div>
</template>

<script>
export default {
    props: ['propLp', 'playerLp'],
    methods: {
        getFontColor(lp) {
            if (lp > 30) {
                return 'green';
            } else if (lp <= 30 && lp > 20) {
                return 'white';
            } else if (lp <= 20 && lp > 10) {
                return 'orange';
            } else {
                return 'red';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.lp-container {
    position: absolute;

    z-index: 12;
    font-size: 35px;
    font-weight: bold;
    border-radius: 50%;
    width: 87px;
    height: 87px;
    color: white;
    background-color: #282625;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lp-container.player {
    bottom: 36%;
    right: 16.3%;
}

.lp-container.opponent {
    top: 36%;
    right: 16.3%;
}
</style>