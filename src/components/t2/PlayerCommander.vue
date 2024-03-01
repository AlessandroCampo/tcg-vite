<template>
    <figure class="player-hero" id="player-hero-cont">
        <img :src="generalStore.player.leader?.artwork" alt="" id="player-hero" class="hero-avatar"
            :class="generalStore.player.activeTurn ? '' : 'disabled'">
        <ManaBar :propMana="generalStore.player.mana"></ManaBar>
        <SecretsCounter class="secrets" v-if="generalStore.player.traps.length > 0"></SecretsCounter>
    </figure>
</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
import ManaBar from './ManaBar.vue'
import SecretsCounter from '../t3/SecretsCounter.vue';

export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    components: { ManaBar, SecretsCounter },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.hero-avatar {
    clip-path: circle();
    right: 12.8%;
    width: 205px;
}

.secrets {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.player-hero {

    position: absolute;
    right: 12.8%;
    bottom: 1.6%;
    width: fit-content;
    z-index: 4200;
}




img.disabled {
    filter: grayscale(70%);
}
</style>