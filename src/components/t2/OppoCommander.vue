<template>
    <figure class="enemy-hero" @drop="directAttack($event)" @dragover.prevent id="enemy-hero-cont">
        <img :src="generalStore.opponent.commander?.artwork" alt="" id="enemy-hero" class="hero-avatar"
            :class="generalStore.opponent.activeTurn ? '' : 'disabled'">
        <ManaBar :propMana="generalStore.opponent.mana"></ManaBar>
        <SecretsCounter class="secrets" v-if="generalStore?.opponent?.traps?.length" :propCommander='"enemy"'> 0">
        </SecretsCounter>
    </figure>
</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
import SecretsCounter from '../t3/SecretsCounter.vue';

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
            const attackerProxy = this.generalStore.draggedCard
            const initialLP = this.generalStore.opponent.lp;
            const target = null
            const damage = attacker.op.current;
            const interval = 150; // Interval between LP updates in milliseconds
            const iterations = damage; // Number of LP updates
            let foundGuardians = false;
            this.generalStore.opponent.field.forEach(unit => {
                if (unit.attributes.includes('guardian')) {
                    foundGuardians = true;
                }
            })

            if (foundGuardians && !attacker.attributes.includes('fly')) {
                return
            }

            attacker.canAttack = false

            this.generalStore.player.lastAction = {
                card: attackerProxy.id,
                target: 'player-hero-cont',
                cardObj: attacker,
                targetObj: null,
                action: 'attack'
            }
            this.generalStore.updateBothDb()
            this.generalStore.resetActionObj()
            this.generalStore.animateAttack(attackerProxy, document.getElementById('enemy-hero-cont'), damage)
            // Function to update LP value gradually
            if (this.generalStore.player.activeTurn && this.generalStore.opponent.traps.length > 0) {
                const trapFound = this.generalStore.checkTraps(attacker, target, 'onAttack');
                if (trapFound) return;
            }
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
                if (this.generalStore.opponent.lp <= 0) {
                    this.generalStore.player.winner = true
                }
                this.generalStore.updateBothDb();
            }, interval * iterations);
        },


    },
    components: { ManaBar, SecretsCounter }
}
</script>

<style lang="scss" scoped>
.hero-avatar {
    clip-path: circle();

    width: 205px;
}

.secrets {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


.enemy-hero {
    position: absolute;
    right: 12.8%;
    top: 2.3%;
    width: fit-content;
    z-index: 4200;
}

img.disabled {
    filter: grayscale(70%);
}
</style>