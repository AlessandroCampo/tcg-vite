<template>
    <figure class="player-hero">
        <img :src="generalStore.player.leader?.artwork" alt="" id="player-hero" class="hero-avatar"
            :class="generalStore.player.activeTurn ? '' : 'disabled'">
        <ManaBar :propMana="generalStore.player.mana"></ManaBar>
    </figure>
</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
import ManaBar from './ManaBar.vue'

export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    components: { ManaBar },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
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

img.disabled {
    filter: grayscale(70%);
}
</style>