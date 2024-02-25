<template>
    <div class="deck-proxy" :class="playerDeck ? 'player' : 'opponent'">
        <div class="deck-container">
            <div class="card"></div>
            <div v-for="(card, index) in propDeck" :key="index" class="card"
                :style="{ zIndex: propDeck.length - index, marginTop: `${index * 8.2}px`, transform: `translateY(-${index * 10}px)` }">
                <div class="deck-counter">
                    {{ propDeck?.length }}
                </div>
            </div>

        </div>

    </div>
</template>

<script>

export default {
    data() {
        return {
        }
    },
    props: ['propDeck', 'playerDeck']
}
</script>

<style lang="scss" scoped>
.deck-proxy.player {
    position: absolute;
    bottom: 10.5%;
    left: 16.5%;
    transform: rotate(44deg);
}

.deck-counter {
    z-index: 300000;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid black;
    background-color: rgba($color: #000000, $alpha: 0.8);
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    font-weight: bold;
    transform: translate(-50%, -50%);
}

.deck-proxy.opponent {
    position: absolute;
    top: 4.5%;
    left: 19.6%;
    transform: rotate(133deg);
}

.deck-container {
    position: relative;
    width: 100px;
    height: 150px;
}


.card {
    position: absolute;
    left: 0;
    width: 185px;
    height: 155px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
    background-image: url('../../assets/img/cardback.png');
    background-size: cover;
}
</style>

