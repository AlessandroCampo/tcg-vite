<template>
    <div class="shop-container">
        <div class="shop-left">
            <button @click="() => { currentProduct = 'packs' }"> PACKS </button>
            <button @click="() => { currentProduct = 'singles' }"> SINGLES </button>
            <button style="opacity: 0.3;"> DECKS </button>

        </div>
        <div class="shop-right">
            <div class="currency-bar">
                <div class="coins">
                    <img src="../../../img/icons/coins.png" alt="">
                    <div> {{ generalStore.playerInfo.coins }} </div>
                </div>
                <div class="crystals">
                    <img src="../../../img/icons/crystal.png" alt="">
                    <div> {{ generalStore.playerInfo.crystals }} </div>
                </div>
                <div class="filter-inputs" v-show="currentProduct == 'singles'">
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

                    <select v-model="rarityFilter">
                        <option value="all" selected> Any rarity </option>
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                    </select>
                </div>
                <router-link to="/">
                    <button> BACK TO MENU </button>
                </router-link>

            </div>
            <div class="products-container">
                <div class="pack" v-for="(pack, index) in allPacks" :key="index" v-if="currentProduct == 'packs'">
                    <img :src="pack.imgPath" alt="">
                    <div class="pack-name"> {{ pack.name }}</div>
                    <button> BUY FOR {{ pack.price }} <img src="../../../img/icons/coins.png" alt=""></button>
                </div>
                <div class="singles" v-for="(card, index) in allCards" :key="card.name"
                    v-else-if="currentProduct == 'singles'">
                    <div class="collection-card" :style="{ 'background-image': `url(./img${card.imgPath})` }"
                        v-show="card.name.toLowerCase().includes(searchString.toLowerCase()) && (card.type == typeFilter || typeFilter == 'all') && (card.color == colorFilter || colorFilter == 'all' || colorFilter == 'null' && !card.color && card.type !== 'commander') && (card.rarity == rarityFilter || rarityFilter == 'all')">
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
            </div>
        </div>
    </div>
</template>

<script>

import { useGeneralStore } from '../../stores/generalStore';
import { allPacks, allCards } from '../../db';


export default {
    data() {
        return {
            currentProduct: 'packs',
            currentProductArray: [],
            generalStore: useGeneralStore(),
            searchString: '',
            typeFilter: 'all',
            colorFilter: 'all',
            rarityFilter: 'all',
            allPacks: allPacks,
            allCards: allCards
        }
    },
    created() {
        console.log(allPacks.length)
        this.allCards.sort(this.compareCards)
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
        }
    }
}
</script>

<style lang="scss" scoped>
.shop-container {
    height: 100vh;
    width: 100vw;
    background-color: #211720;
    display: flex;

    .shop-left {
        width: 15%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
        border: 2px solid #7f6c54;
        background-color: saddlebrown;

    }

    .shop-right {
        width: 85%;

        .currency-bar {
            padding-block: 25px;
            padding-inline: 50px;
            display: flex;
            gap: 30px;
            width: 100;
            justify-content: center;

            .coins,
            .crystals {
                color: white;
                display: flex;
                align-items: center;
                gap: 15px;
                background-color: #28201e;
                padding: 5px;
                width: 150px;
                font-size: 1.5em;
                border-radius: 30px;
                justify-content: center;
                border: 2px solid #7f6c54;

                img {
                    width: 30px;
                }
            }
        }

        .products-container {
            display: flex;
            flex-wrap: wrap;
            padding-block: 30px;
            padding-inline: 60px;
            gap: 20px;
            overflow-y: auto;
            max-width: 85vw;

            .pack {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                img {
                    width: 200px;
                }

                .pack-name {
                    color: white;
                    background-color: rgba($color: #201c18, $alpha: 0.8);
                    width: fit-content;
                    padding: 5px;
                    position: absolute;
                    bottom: 25%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 66%;
                    text-align: center;
                    font-size: 1.2em;
                    border-radius: 15px;
                }

                button {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-block: 5px;
                    padding-inline: 20px;
                    border-radius: 25px;
                    background-color: #1c1714;
                    border: 3px solid #0d0605;
                    color: white;
                    cursor: pointer;

                    &:hover {
                        border-color: aqua;
                        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                    }

                    img {
                        width: 25px;

                    }
                }
            }


        }
    }


}

.filter-inputs {
    display: flex;
    align-items: center;
    gap: 25px;

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

        img {
            width: 20px;
        }
    }
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

button {
    padding-block: 6px;
    width: 200px;
    border-radius: 30px;
    color: white;
    background-color: #1c1714;
    border: 3px solid #0d0605;
    font-size: 1.2em;

    &:hover {
        border-color: aqua;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        cursor: pointer;
    }
}
</style>