<template>
    <div class="overlay-container">
        <h2>
            {{ overlayData.title }}
        </h2>

        <div class="cards-container" v-for="(card, index) in overlayData.array" :key="card.name">
            <div class="overlay-card" :style="{ 'background-image': `url(./img${card.imgPath})` }">
                <span class="cost stat" v-if="card.type !== 'commander'">
                    {{ card.cost.current }}
                </span>
                <span class="op stat" v-if="card.type == 'unit'">
                    {{ card?.op.current }}
                </span>
                <span class="hp stat" v-if="card.type == 'unit'">
                    {{ card?.hp.current }}
                </span>
            </div>

        </div>

        <button @click="handleCloseOverlay">
            done
        </button>
    </div>
</template>

<script>
export default {
    props: {
        overlayData: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleCloseOverlay() {
            // Emit close_overlay event to the parent component
            this.$emit('close_overlay');
        }
    }
}
</script>

<style lang="scss" scoped>
.overlay-container {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba($color: #000000, $alpha: 0.8);
    z-index: 121131312;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3em;

    h2 {
        color: white;
        font-size: 2.5em;
    }

    button {
        font-size: 1.5em;
        border-radius: 30px;
        padding-inline: 30px;
        padding-block: 5px;
        background-color: #121212;
        color: white;
        cursor: pointer;
        text-transform: uppercase;

        &:hover {
            scale: 1.1;
            border: 1px solid aqua;
        }
    }
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .overlay-card {
        width: 140px;
        height: 210px;
        background-size: cover;
        background-repeat: no-repeat;
        position: relative;
        display: inline-block;
        cursor: grab;


        .stat {
            position: absolute;
            font-size: 0.8em;
            font-weight: bold;
            color: white;
        }

        .op,
        .hp {
            bottom: 5.5%;
        }

        .op {
            left: 10.5%;
        }

        .hp {
            right: 10.5%;
        }

        .cost {
            left: 10.5%;
            top: 5.5%;
        }
    }
}
</style>