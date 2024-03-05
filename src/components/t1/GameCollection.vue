<template>
    <div class="collection-container">

        <div class="deck-container" @dragenter.prevent @dragover.prevent @drop="addCard($event)">
            <div class="deck-commander"
                :style="{ 'background-image': `url(./img${generalStore.player.commander.artwork})` }">
                <p class="total-cards">
                    Cards in deck: {{ generalStore.player.deck.length }}
                    <i class="fa-solid fa-trash-can" @click="emptyDeck"></i>
                </p>
            </div>

            <!-- Iterate over deck cards -->
            <template v-for="(card, index) in generalStore.player.deck">
                <!-- Check if it's the first occurrence of this card -->
                <template v-if="index === generalStore.player.deck.findIndex(c => c.name === card.name)">
                    <div class="deck-card" :style="{ 'background-image': `url(./img${card.imgPath})` }">
                        <div class="color-overlay" :style="{ background: generateGradient(card.color) }"></div>
                        <div class="deck-card-cost">
                            {{ card.cost.original }}
                        </div>
                        <div class="deck-card-name" :style="{ color: card.color !== 'white' ? 'white' : 'black' }">
                            {{ card.name }}
                        </div>
                        <!-- Show count of copies -->
                        <div class="copy-count">
                            <i class="fa-solid fa-circle-xmark remove-icon" @click="removeCard(card)"></i>
                            <span>{{ countCopies(card) }}</span>
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <div class="collection-right">
            <div class="card-filter-bar">
                <div class="searchbar-container">
                    <img src="../../../img/lens.png" alt="">
                    <input type="text" v-model="searchString" placeholder="Search..." class="searchbar">
                </div>
                <select v-model="typeFilter">
                    <option value="all" selected> Any type </option>
                    <option value="commander">Commander</option>
                    <option value="unit">Unit</option>
                    <option value="spell">Spell</option>
                    <option value="trap">Trap</option>
                </select>

                <select v-model="colorFilter">
                    <option value="all" selected> Any faction </option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="null">Factionless</option>
                </select>

            </div>
            <div class="card-container">
                <span class="card-block" v-for="(block, index2) in transformArray(collection)" :key="index2">
                    <div class="collection-card" :style="{ 'background-image': `url(./img${card.imgPath})` }"
                        :draggable="true" v-for="(card, index) in block" :key="index" @dragstart="startDrag(card)"
                        v-show="card.name.toLowerCase().includes(searchString.toLowerCase()) && (card.type == typeFilter || typeFilter == 'all') && (card.color == colorFilter || colorFilter == 'all' || colorFilter == 'null' && !card.color && card.type !== 'commander')">
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
                </span>
            </div>
        </div>


    </div>
</template>

<script>

import { useGeneralStore } from '../../stores/generalStore';

export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            collection: undefined,
            searchString: '',
            typeFilter: 'all',
            colorFilter: 'all'
        }
    },
    created() {
        // Define a function to compare cards based on color, type, and cost

        // Order the collection array using the compareCards function
        this.collection = this.generalStore.playerInfo.collection
        this.collection.sort(this.compareCards);

        // console.log(this.transformArray(this.collection))

    },
    mounted() {
        console.log(this.generalStore.playerInfo.collection)
        console.log(this.transformArray(this.collection))
    },
    methods: {
        compareCards(a, b) {
            if (a.color === null && b.color !== null) {
                return 1;
            }
            if (a.color !== null && b.color === null) {
                return -1;
            }

            // Compare cards by color
            const colorComparison = (a.color || '').localeCompare(b.color || '');
            if (colorComparison !== 0) {
                return colorComparison;
            }

            const typeOrder = { 'commander': 0, 'unit': 1, 'spell': 2, 'trap': 3 };
            const typeComparison = typeOrder[a.type] - typeOrder[b.type];
            if (typeComparison !== 0) {
                return typeComparison;
            }
            if (a.cost.current !== b.cost.current) {
                return a.cost.current - b.cost.current;
            }
            return a.name.localeCompare(b.name);
        },
        countCopies(card) {
            return this.generalStore.player.deck.filter(c => c.name === card.name).length;
        },
        generateGradient(color) {
            let gradient;
            switch (color) {
                case 'black':
                    gradient = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';
                    break;
                case 'white':
                    gradient = 'linear-gradient(rgba(225, 225, 225, 0.7), rgba(225, 225, 225, 0.7))';
                    break;
                case 'red':
                    gradient = 'linear-gradient(rgba(255, 0, 0, 0.7), rgba(255, 0, 0, 0.7))';
                    break;
                default:
                    gradient = 'linear-gradient(rgba(30, 30, 30, 0.7), rgba(30, 30, 30, 0.7))';
            }
            return gradient;
        },
        transformArray(cards) {
            const result = [];
            const cardTypes = {};

            // Group cards by their type
            cards.forEach(card => {
                const cardType = card.name || card.type; // Assuming each card object has either a 'name' or 'type' property
                if (!cardTypes[cardType]) {
                    cardTypes[cardType] = [];
                }
                cardTypes[cardType].push(card);
            });

            // Convert grouped cards to arrays
            for (const cardType in cardTypes) {
                result.push(cardTypes[cardType]);
            }

            return result;
        },
        startDrag(card) {
            this.generalStore.draggedCard = this.$el;
            this.generalStore.draggedCardObj = card;
        },
        addCard() {
            const newCard = this.generalStore.draggedCardObj
            if (newCard.type == 'commander') {
                this.generalStore.player.commander = newCard
                this.emptyDeck()

            } else if (!this.generalStore.player.commander.colors.includes(newCard.color) && newCard.color !== null) {
                window.alert("You can only add cards of the same faction as your deck's commander, or factionless cards")
                return
            }
            else {
                const index = this.generalStore.playerInfo.collection.indexOf(newCard)
                this.generalStore.player.deck.push(newCard)
                this.generalStore.playerInfo.collection.splice(index, 1)
            }
            this.generalStore.player.deck.sort(this.compareCards)
        },
        removeCard(card) {
            const index = this.generalStore.player.deck.indexOf(card)
            if (index !== -1) {
                this.generalStore.player.deck.splice(index, 1)
                this.generalStore.playerInfo.collection.push(card)
                this.generalStore.playerInfo.collection.sort(this.compareCards)
            }
        },
        emptyDeck() {
            this.generalStore.player.deck.forEach((card, index) => {
                this.generalStore.playerInfo.collection.push(card)
            })
            this.generalStore.player.deck = []
            this.generalStore.playerInfo.collection.sort(this.compareCards)
        }
    }
}
</script>

<style lang="scss" scoped>
.collection-container {
    height: 100vh;
    width: 100vw;
    // background-image: url('../../img/collection_background.png');
    background-color: #292627;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;

    .deck-container {
        width: 30%;
        height: 100%;
        overflow-y: auto;

        .deck-commander {
            height: 200px;
            background-image: url('./img/commanders/black.png');
            background-position: center;
            background-position-y: 10%;
            position: relative;

            .total-cards {
                position: absolute;
                bottom: 5%;
                right: 5%;
                color: white;
                background-color: rgba($color: black, $alpha: 0.6);
                padding: 10px;
                font-size: 1.5em;

                i {
                    margin-left: 10px;
                    color: crimson;
                }
            }
        }

        .deck-card {
            width: 100%;
            height: 50px;
            border: 2px solid slategray;
            color: white;
            position: relative;
            background-size: cover;
            background-repeat: no-repeat;
            background-position-y: 26%;
            display: flex;
            align-items: center;
            gap: 50px;
            padding-inline: 30px;

            .deck-card-cost {
                font-weight: bold;
                font-size: 1.3em;
                background-color: #072851;
                width: 50px;
                position: absolute;
                z-index: 3;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 37px;
                height: 37px;
                border: 1px solid #036874;
            }

            .remove-icon {
                color: white;
                right: 5%;
                color: crimson;
                background-color: white;
                clip-path: circle();
                font-size: 22px;
                cursor: pointer;
            }

            .deck-card-name {
                font-weight: bold;
                font-size: 1.3em;
                position: absolute;
                z-index: 3;
                left: 15%;
                text-transform: uppercase;
            }

            .color-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

        }
    }

    div.collection-right {
        width: 70%;

        .card-filter-bar {
            height: 10%;
            background-color: #412b28;
            display: flex;
            padding-inline: 30px;
            align-items: center;
            gap: 35px;

            input,
            select {
                background-color: #201c18;
                border: 0;
                font-size: 1.5em;
                color: white;

            }

            select {
                border-radius: 20px;
                padding: 10px;
                padding-inline: 15px;
                font-size: 1.3em;
                height: 50px;
            }

            .searchbar-container {
                background-color: #201c18;
                border-radius: 20px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 12px;
                height: 50px;

                img {
                    width: 20px;
                }
            }

        }

        .card-container {
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            padding-block: 100px;
            padding-inline: 30px;
            margin-top: -50px;

            .card-block {
                margin-right: 30px;
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
                width: fit-content;
            }


            .collection-card {
                width: 140px;
                height: 210px;
                background-size: cover;
                background-repeat: no-repeat;
                position: relative;
                display: inline-block;
                cursor: grab;


                .stat {
                    position: absolute;
                    font-size: 1em;
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
    }


    .collection-card:not(:first-child) {
        margin-left: -110px;
    }

    .copy-count {
        position: absolute;
        right: 10%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        flex-direction: row-reverse;
    }

    .copy-count span {
        font-size: 1.5em;
        background: #262931;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }






}
</style>