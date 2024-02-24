<template>
    <div id="battlefield-container">
        <PlayerHand></PlayerHand>
        <PlayerField></PlayerField>

        <figure class="player-hero">
            <img src="../../assets/img/commanders/black.png" alt="" id="player-hero" class="hero-avatar">
            <ManaBar :propMana="playerMana"></ManaBar>
        </figure>
        <figure class="enemy-hero">
            <img src="../../assets/img/commanders/green.png" alt="" id="enemy-hero" class="hero-avatar">
            <ManaBar :propMana="enemyMana"></ManaBar>
        </figure>

    </div>
</template>

<script>

import PlayerHand from '../t2/PlayerHand.vue';
import PlayerField from '../t2/PlayerField.vue';
import ManaBar from '../t2/ManaBar.vue';
import { useGeneralStore } from '../../stores/generalStore'

export default {
    data() {
        return {
            playerMana: undefined,
            enemyMana: undefined
        }
    },
    components: { PlayerHand, PlayerField, ManaBar },
    created() {
        const generalStore = useGeneralStore()
        this.playerMana = generalStore.playerMana
        this.enemyMana = generalStore.enemyMana
    }
}
</script>

<style lang="scss" scoped>
#battlefield-container {
    background-image: url('../../assets/img/gameboard.png');
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vw;
}


.hero-avatar {
    clip-path: circle();
    position: absolute;
    right: 12.8%;
    width: 205px;
}

#player-hero {
    bottom: 1.7%;
}

#enemy-hero {
    top: 1.7%;
}
</style>