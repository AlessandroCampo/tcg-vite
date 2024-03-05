<template>
    <figure class="enemy-hero" id="enemy-hero-cont">
        <img :src="'/img' + generalStore.opponent.commander?.artwork" alt="" id="enemy-hero" class="hero-avatar"
            :class="generalStore.opponent.activeTurn && !generalStore.opponent.commander.used ? '' : 'disabled'"
            @dragover.prevent @drop="directAttack($event)" @dragenter.prevent>
        <ManaBar :propMana="generalStore.opponent.mana"></ManaBar>
        <SecretsCounter class="secrets" v-if="generalStore?.opponent?.traps?.length" :propCommander='"enemy"'> 0">
        </SecretsCounter>
        <img :src="'/img' + generalStore.opponent.commander?.abilityArtwork" alt=""
            :class="generalStore.opponent.activeTurn && !generalStore.opponent.commander.used ? '' : 'disabled'"
            class="commander-power">

    </figure>

</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
import SecretsCounter from '../t3/SecretsCounter.vue';

import ManaBar from './ManaBar.vue'

export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            commanderImage: null
        }
    },
    created() {
        // this.getImage()
    },
    methods: {
        getImage() {
            this.commanderImage = '/img' + this.generalStore.opponent.commander.artwork
        },
        directAttack(e) {
            console.log('dropped')
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
            if (this.generalStore.player.activeTurn && this.generalStore.opponent.traps.length > 0) {
                const trapFound = this.generalStore.checkTraps(attacker, null, 'onAttack');

                if (trapFound) return;
            }
            const updateLP = () => {
                if (this.generalStore.opponent.lp > initialLP - damage) {
                    this.generalStore.opponent.lp--;
                    if (this.generalStore.opponent.lp < 0) {
                        this.generalStore.opponent.lp = 0
                    }
                    setTimeout(updateLP, interval);
                }
            };

            updateLP();

            setTimeout(() => {
                if (this.generalStore.opponent.lp <= 0) {
                    this.generalStore.player.winner = true
                    this.generalStore.player.gameover = true
                    this.generalStore.opponent.gameover = true
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
    z-index: 10000000000;
    margin: 0;
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

.commander-power {
    width: 150px;
    position: absolute;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
    right: -80%;

    &:hover {
        scale: 2;
        transform: translateY(-20%);
    }
}
</style>