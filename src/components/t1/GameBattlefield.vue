<template>
    <div id="battlefield-container" v-if="!this.generalStore.player.gameover">
        <transition name="fade">
            <div v-if="generalStore.player.activatedCard || generalStore.opponent.activatedCard">
                <ProxyBig :propCard="generalStore.player.activatedCard || generalStore.opponent.activatedCard">
                </ProxyBig>
            </div>
        </transition>
        <div class="oppoName">
            {{ generalStore.opponent.username }}
        </div>
        <GameOverlay :overlayData="overlayData" v-if="overlay" @close_overlay="overlay = false"></GameOverlay>
        <PlayerHand></PlayerHand>
        <PlayerField></PlayerField>
        <OppoField></OppoField>
        <OppoHand></OppoHand>
        <TurnButton></TurnButton>
        <LpCounter :propLp="generalStore.player.lp" :playerLp="true"></LpCounter>
        <LpCounter :propLp="generalStore.opponent.lp" :playerLp="false"></LpCounter>
        <GraveyardCounter :playerGy="true" @showOverlay="handleShowOverlay">
        </GraveyardCounter>
        <GraveyardCounter :playerGy="false" @showOverlay="handleShowOverlay">
        </GraveyardCounter>
        <DeckProxy :propDeck="generalStore.player.deck" :playerDeck="true"></DeckProxy>
        <DeckProxy :propDeck="generalStore.opponent.deck" :playerDeck="false"></DeckProxy>
        <PlayerCommander></PlayerCommander>
        <OppoCommander></OppoCommander>



    </div>
    <EndgameScreen v-else :propWinner="this.generalStore.player.winner"></EndgameScreen>

</template>

<script>

import GameOverlay from '../t2/GameOverlay.vue';
import EndgameScreen from '../t1/EndgameScreen.vue'
import PlayerHand from '../t2/PlayerHand.vue';
import PlayerField from '../t2/PlayerField.vue';
import OppoField from '../t2/OppoField.vue';
import OppoHand from '../t2/OppoHand.vue';
import ManaBar from '../t2/ManaBar.vue';
import TurnButton from '../t2/TurnButton.vue';
import DeckProxy from '../t2/DeckProxy.vue';
import LpCounter from '../t2/LpCounter.vue';
import GraveyardCounter from '../t2/GraveyardCounter.vue';
import PlayerCommander from '../t2/PlayerCommander.vue';
import OppoCommander from '../t2/OppoCommander.vue';
import ProxyBig from '../t3/ProxyBig.vue';
import { useGeneralStore } from '../../stores/generalStore'
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc, onSnapshot } from 'firebase/firestore'
const db = useFirestore()
const playerRef = doc(db, 'Users', 'Player1');


export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            overlayData: {
                title: 'Default Title',
                array: []
            },
            overlay: false
        }
    },
    components: { PlayerHand, PlayerField, ManaBar, OppoField, OppoHand, TurnButton, DeckProxy, LpCounter, GraveyardCounter, PlayerCommander, OppoCommander, ProxyBig, EndgameScreen, GameOverlay },
    async created() {
        this.generalStore.opponentUid
        const oppo_unsub = onSnapshot(doc(db, "Users", this.generalStore?.opponentUid, 'GameState', 'GameState' + this.generalStore?.opponentUid), (doc) => {
            this.generalStore.opponent = doc.data()
        });
        setTimeout(() => {
            this.generalStore.firstTurn()
            this.generalStore.assignCommander()
            this.generalStore.player.inQueue = false
            console.log(this.generalStore.opponent.username)
        }, 500)
    },
    methods: {
        handleShowOverlay(data) {

            this.overlay = true
            console.log(this.overlay)
            this.overlayData.title = data.title
            this.overlayData.array = data.array
            console.log('Overlay should be shown with data:', data);
        }
    },
    computed: {
        getPlayerMana() {
            return this.playerDoc ? this.playerDoc.mana : null
        },

    },
    watch: {
        getPlayerMana(newValue) {
            this.playerMana = newValue
        }
    }
}
</script>

<style lang="scss" scoped>
#battlefield-container {
    background-image: url('../../assets/img/gameboard.png');
    background-size: cover;
    height: 100vh;
    width: 100vw;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.oppoName {
    position: absolute;
    background-color: rgba($color: #000000, $alpha: 0.6);
    color: white;
    padding-block: 15px;
    padding-inline: 60px;
    font-size: 2em;
    top: 3%;
    left: 1%;
    z-index: 200;
}
</style>