<template>
    <figure class="player-hero" id="player-hero-cont">
        <img :src="'/img' + generalStore.player.commander?.artwork" alt="" id="player-hero" class="hero-avatar"
            :class="generalStore.player.activeTurn && !generalStore.player.commander.used ? '' : 'disabled'"
            @click="commanderPower()" draggable="true" @dragstart="startDrag($event)">
        <ManaBar :propMana="generalStore.player.mana"></ManaBar>
        <SecretsCounter class="secrets" v-if="generalStore.player.traps.length > 0" :propCommander='"player"'>
        </SecretsCounter>
        <img :src="'/img' + generalStore.player.commander?.abilityArtwork" alt=""
            :class="generalStore.player.activeTurn && !generalStore.player.commander.used ? '' : 'disabled'"
            class="commander-power" @click="commanderPower()">
    </figure>
</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
import ManaBar from './ManaBar.vue'
import SecretsCounter from '../t3/SecretsCounter.vue';
import { abilities } from '../../stores/abilities';

export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    components: { ManaBar, SecretsCounter },
    methods: {
        commanderPower() {
            if (this.generalStore.player.commander.used) return
            const commander = this.generalStore.player.commander
            commander.used = true
            this.generalStore.resolveAbility(commander)
        },
        startDrag(e) {
            this.generalStore.draggedCard = this.$el;
            this.generalStore.draggedCardObj = this.generalStore.player.commander
            console.log(this.generalStore.draggedCardObj)
        }
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

.commander-power {
    width: 150px;
    position: absolute;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
    right: -80%;

    &:hover {
        scale: 2;
        transform: translateY(-40%);
    }
}




img.disabled {
    filter: grayscale(70%);
}
</style>