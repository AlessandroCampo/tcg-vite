<template>
    <figure class="enemy-hero" @drop="directAttack($event)" @dragover.prevent>
        <img :src="generalStore.opponent.leader?.artwork" alt="" id="enemy-hero" class="hero-avatar"
            :class="generalStore.opponent.activeTurn ? '' : 'disabled'">
        <ManaBar :propMana="generalStore.opponent.mana"></ManaBar>
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
    methods: {
        directAttack(e) {
            const attacker = this.generalStore.draggedCardObj;
            const initialLP = this.generalStore.opponent.lp;
            const damage = attacker.op;
            const interval = 150; // Interval between LP updates in milliseconds
            const iterations = damage; // Number of LP updates

            // Function to update LP value gradually
            const updateLP = () => {
                if (this.generalStore.opponent.lp > initialLP - damage) {
                    // Decrement LP value
                    this.generalStore.opponent.lp--;
                    if (this.generalStore.opponent.lp < 0) {
                        this.generalStore.opponent.lp = 0
                    }
                    // Schedule next update
                    setTimeout(updateLP, interval);
                }
            };

            // Start countdown animation
            updateLP();

            // Update database after countdown animation completes
            setTimeout(() => {
                this.generalStore.updateBothDb();
            }, interval * iterations);
        }

    },
    components: { ManaBar }
}
</script>

<style lang="scss" scoped>
.hero-avatar {
    clip-path: circle();

    width: 205px;
}

#player-hero {
    bottom: 1.7%;
}

.enemy-hero {
    position: absolute;
    right: 12.8%;
    width: fit-content;
    z-index: 4200;
}

img.disabled {
    filter: grayscale(70%);
}
</style>