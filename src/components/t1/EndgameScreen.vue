<template>
    <div class="end-game-screen" :class="{ 'win-background': propWinner, 'lose-background': !propWinner }">
        <h2>
            {{ propWinner ? 'YOU WON' : 'YOU LOST' }}
        </h2>
        <button @click="backToMenu">
            BACK TO HOME
        </button>
    </div>

</template>

<script>

import { RouterLink } from 'vue-router';
import { useGeneralStore } from '../../stores/generalStore';
export default {
    props: ['propWinner'],
    methods: {
        backToMenu() {
            useGeneralStore().player.winner = false
            // this.$router.push('/');
            location.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
.end-game-screen {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 3em;

    h2 {
        padding: 150px;
        background: rgba($color: #4444, $alpha: 0.5);
        font-size: 3em;
    }

    button {
        color: white;
        background-color: rgba(55, 55, 55, 0.7);
        border-radius: 30px;
        cursor: pointer;
        padding-inline: 55px;
        padding-block: 5px;
        font-size: 2em;
    }
}

.win-background {
    background-image: url('../../assets/img/victory_screen.png');
}

.lose-background {
    background-image: url('../../assets/img/defeat_screen.png');
}
</style>