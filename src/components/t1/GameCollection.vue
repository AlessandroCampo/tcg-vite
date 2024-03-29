<template>
    <div class="collection-container">
        <div class="collection-left">
            <div class="deck-container" @dragenter.prevent @dragover.prevent @drop="addCard($event)">
                <div class="deck-commander"
                    :style="{ 'background-image': `url(./img${generalStore.playerInfo.deck?.commander.artwork})` }"
                    v-if="generalStore.playerInfo.deck.commander">
                    <p class="total-cards">
                        Cards in deck: {{ generalStore.playerInfo.deck.decklist.length }}
                        <i class="fa-solid fa-trash-can" @click="emptyDeck"></i>
                    </p>
                    <input type="text" class="deck-name" v-model="generalStore.playerInfo.deck.name">
                </div>

                <!-- Iterate over deck cards -->
                <template v-for="(card, index) in generalStore.playerInfo.deck.decklist">
                    <!-- Check if it's the first occurrence of this card -->
                    <template
                        v-if="index === generalStore.playerInfo.deck.decklist.findIndex(c => c.name === card.name)">
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
            <div class="other-decks">
                <div class="other-deck-cover"
                    :style="{ 'background-image': deck.commander ? `url(img/${deck.commander.artwork})` : 'none' }"
                    v-for="(deck, index) in generalStore.playerInfo.otherDecks" :key="index" @click="switchDeck(index)">
                    <p> {{ deck.name || 'New Deck' }} </p>
                    <i class="fa-solid fa-circle-xmark close-icon" @click="deleteDeck(index)"></i>

                </div>
            </div>


        </div>

        <div class="collection-right">
            <div class="card-filter-bar">
                <div class="searchbar-container">
                    <!-- <img src="../../../img/icons/lens.png" alt=""> -->
                    <i class="fa-solid fa-magnifying-glass"></i>
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

                <button @click="createNewDeck">
                    NEW DECK
                </button>

                <button @click="saveDeck">
                    SAVE
                </button>

                <router-link to="/">
                    <button> BACK TO MENU </button>
                </router-link>



            </div>
            <div class="card-container">
                <span class="card-block" v-for="(block, index2) in transformArray(collection)" :key="index2">
                    <div class="collection-card" :style="{ 'background-image': `url(./img${card.imgPath})` }"
                        :draggable="true" v-for="(card, index) in block" :key="index" @dragstart="startDrag(card)"
                        v-show="card.name.toLowerCase().includes(searchString.toLowerCase()) && (card.type == typeFilter || typeFilter == 'all') && (card.color == colorFilter || colorFilter == 'all' || colorFilter == 'null' && !card.color && card.type !== 'commander') && (!generalStore.playerInfo.deck.decklist.some(deckCard => deckCard.id === card.id))
                ">
                        <span class="cost stat">
                            {{ card.cost.current }}
                        </span>
                        <span class="op stat" v-if="card.type == 'unit'">
                            {{ card?.op.current }}
                        </span>
                        <span class="hp stat" v-if="card.type == 'unit' || card.type == 'commander'">
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
import { RouterLink } from 'vue-router';

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
        console.log(this.generalStore.playerInfo.collection)
        this.collection = this.generalStore.playerInfo.collection
        this.collection.sort(this.compareCards);


    },
    mounted() {

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
            return this.generalStore.playerInfo.deck.decklist.filter(c => c.name === card.name).length;
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
                    gradient = 'linear-gradient(rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.5))';

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
            if (!this.generalStore.playerInfo.deck.commander && newCard.type !== 'commander') {
                window.alert('Choose a commander for this deck first')
                return
            }
            if (this.generalStore.playerInfo.deck.decklist.length >= 45) {
                window.alert("Your deck can't contain more than 45 cards")
                return
            }
            if (newCard.type == 'commander') {
                this.generalStore.playerInfo.deck.commander = newCard
                this.emptyDeck()

            } else if (!this.generalStore.playerInfo.deck.commander.colors.includes(newCard.color) && newCard.color !== null) {
                window.alert("You can only add cards of the same faction as your deck's commander, or factionless cards")
                return
            }
            else {
                // const index = this.generalStore.playerInfo.collection.indexOf(newCard)
                if (this.countCopies(newCard) < 4) {
                    this.generalStore.playerInfo.deck.decklist.push(newCard)
                } else {
                    window.alert('You cant use more than 4 copies of the same card')
                }

                // this.generalStore.playerInfo.collection.splice(index, 1)
            }
            this.generalStore.playerInfo.deck.decklist.sort(this.compareCards)
        },
        removeCard(card) {
            const index = this.generalStore.playerInfo.deck.decklist.indexOf(card)
            if (index !== -1) {
                this.generalStore.playerInfo.deck.decklist.splice(index, 1)
                // this.generalStore.playerInfo.collection.push(card)
                this.generalStore.playerInfo.collection.sort(this.compareCards)
            }
        },
        emptyDeck() {
            // this.generalStore.playerInfo.deck.decklist.forEach((card, index) => {
            //     this.generalStore.playerInfo.collection.push(card)
            // })
            this.generalStore.playerInfo.deck.decklist = []
            this.generalStore.playerInfo.collection.sort(this.compareCards)
        },
        saveDeck() {
            //FIXME - 
            let deckAlreadySaved = false
            this.generalStore.playerInfo.otherDecks.forEach((deck) => {
                if (deck.name == this.generalStore.playerInfo.deck.name) {
                    deckAlreadySaved = true
                }
            })
            if (!deckAlreadySaved) {
                this.generalStore.playerInfo.otherDecks.push(this.generalStore.playerInfo.deck)
            }
            this.generalStore.updatePlayerInfoDB()
        },
        createNewDeck() {
            const newDeck = {
                name: '',
                commander: null,
                decklist: []
            }
            this.generalStore.playerInfo.otherDecks.push(newDeck)
        },
        switchDeck(index) {
            this.generalStore.playerInfo.deck = this.generalStore.playerInfo.otherDecks[index]
        },
        deleteDeck(index) {
            this.generalStore.playerInfo.otherDecks.splice(index, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
.collection-container {
    height: 100vh;
    width: 100vw;
    background-color: #292627;
    display: flex;

    .collection-left {
        width: 30%;

        .deck-container {
            width: 100%;
            height: 85%;
            overflow-y: auto;

            .deck-commander {
                height: 200px;
                background-image: url('./img/commanders/black.png');
                background-position: center;
                background-position-y: 10%;
                position: relative;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 20px;

                .deck-name {
                    background-color: rgba($color: black, $alpha: 0.6);
                    color: white;
                    font-size: 2em;
                    text-align: center;
                }

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
                        cursor: pointer;
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

        .other-decks {
            height: 15%;
            display: flex;
            gap: 20px;
            justify-content: flex-start;

            .other-deck-cover {
                width: calc(100% / 4 - 20px);
                height: 100%;
                background-size: cover;
                background-position: center;
                border: 3px solid white;
                background-color: #121212;
                position: relative;
                cursor: pointer;

                &:hover i {
                    display: initial;
                }

                .close-icon {
                    position: absolute;
                    top: -10%;
                    right: -10%;
                    font-size: 1.5em;
                    color: crimson;
                    display: none;
                    cursor: pointer;
                }

                p {
                    color: white;
                    background-color: rgba($color: black, $alpha: 0.6);
                    text-align: center;
                    font-size: 1.2em;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;



                }
            }
        }
    }



    div.collection-right {
        width: 70%;
        height: 100vh;

        display: flex;
        flex-direction: column;

        .card-filter-bar {
            height: 12%;
            background-color: #412b28;
            display: flex;
            padding-inline: 30px;
            align-items: center;
            justify-content: space-around;

            input,
            select,
            button {
                background-color: #201c18;
                border: 0;
                font-size: 1.5em;
                color: white;
            }

            button {
                background-color: #6b4828;
                font-size: 1.2em;
                height: 50px;
                padding-inline: 25px;
                border-radius: 20px;
                cursor: pointer;

                &:hover {
                    scale: 1.1
                }
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
                width: 20%;

                .searchbar {
                    max-width: 88%;
                }


                i {
                    color: white;
                    font-size: 1.2em;
                    margin-top: 0.21;
                }
            }

        }

        .card-container {
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            overflow-y: auto;
            padding-block: 30px;
            padding-inline: 30px;
            height: 88%;

            .card-block {
                // margin-right: 30px;
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;
                padding-inline: 10px;
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
    }


    .collection-card:not(:first-child) {
        margin-left: -110px;
    }

    .collection-card:last-child:hover {
        scale: 1.5;
        z-index: 12;
    }

    .collection-card:last-child:active {
        scale: 1;
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