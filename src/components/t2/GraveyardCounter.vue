<template>
    <div class="gy-container" @click="emitOverlayEvent()" :class="playerGy ? 'player' : 'opponent'">
        <img src="/img/icons/tomb.png" alt="">
        {{ playerGy ? generalStore.player.graveyard.length : generalStore.opponent.graveyard.length }}
    </div>
</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            overlayData: {
                title: 'Graveyard',
                array: []
            }
        }
    },
    props: ['propGy', 'playerGy'],
    created() {
        if (this.playerGy) {
            this.gyLength = this.generalStore.player?.graveyard.length
            this.overlayData.array = this.generalStore.player?.graveyard
            this.overlayData.title = 'Your Graveyard'
        } else {
            this.gyLength = this.generalStore.opponent?.graveyard.length
            this.overlayData.array = this.generalStore.opponent?.graveyard
            this.overlayData.title = "Opponent's Graveyard"
        }



    },
    methods: {
        emitOverlayEvent() {
            if (this.playerGy) {
                this.gyLength = this.generalStore.player?.graveyard.length
                this.overlayData.array = this.generalStore.player?.graveyard
                this.overlayData.title = 'Your Graveyard'
            } else {
                this.gyLength = this.generalStore.opponent?.graveyard.length
                this.overlayData.array = this.generalStore.opponent?.graveyard
                this.overlayData.title = "Opponent's Graveyard"
            }
            console.log('showing', this.overlayData)
            this.$emit('showOverlay', this.overlayData);
        }
    }
}
</script>

<style lang="scss" scoped>
.gy-container {
    position: absolute;

    z-index: 12;
    font-size: 1.7em;
    font-weight: bold;
    border-radius: 50%;
    width: 71px;
    height: 71px;
    color: white;
    background-color: #282625;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.gy-container.player {
    bottom: 24.5%;
    right: 14.5%;
}

.gy-container.opponent {
    top: 24.5%;
    right: 14.5%;
}

img {
    width: 25px;
}
</style>