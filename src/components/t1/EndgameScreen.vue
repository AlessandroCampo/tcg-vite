<template>
    <div class="end-game-screen" :class="{ 'win-background': propWinner, 'lose-background': !propWinner }">

        <div class="rewards">
            <h2 :style="{ color: propWinner ? 'darkgreen' : 'red' }">
                {{ propWinner ? 'YOU WON' : 'YOU LOST' }}
            </h2>
            <h3>
                REWARDS
            </h3>
            <ul>
                <li> <strong> Coins:</strong> {{ propWinner ? '25' : '0' }}</li>
                <li> <strong>Experience:</strong> {{ Math.floor(generalStore.game.currentTurn * 1.25) }}</li>
                <li> <strong>RP:</strong> 0</li>
            </ul>
        </div>
        <button @click="backToMenu">
            BACK TO HOME
        </button>
    </div>

</template>

<script>

import { RouterLink } from 'vue-router';
import { useGeneralStore } from '../../stores/generalStore';
export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            ranked: false,
        }
    },
    props: ['propWinner'],
    mounted() {
        this.calcRewards()
    },
    methods: {
        backToMenu() {
            useGeneralStore().player.winner = false
            // this.$router.push('/');
            location.reload()
        },
        calcRewards() {
            if (this.propWinner) {
                this.generalStore.playerInfo.coins += 25
            }
            if (this.rank) {
                this.generalStore.playerInfo.rankedPoints += 10
            }

            this.generalStore.playerInfo.experience += (Math.floor(this.generalStore.game.currentTurn * 1.25))
            this.generalStore.updatePlayerInfoDB()
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

.rewards {
    display: flex;
    flex-direction: column;
    background-color: rgba(55, 55, 55, 0.7);
    padding-block: 120px;
    padding-inline: 20%;
    border-radius: 20px;
    gap: 1em;
    text-align: center;

    h2 {
        font-size: 3.5rem;
        margin-bottom: 1em;
    }

    h3 {
        font-size: 2.5em;
    }

    ul {
        list-style-type: none;
        font-size: 1.5em;
    }
}

.win-background {
    background-image: url('../../assets/img/victory_screen.png');
}

.lose-background {
    background-image: url('../../assets/img/defeat_screen.png');
}
</style>