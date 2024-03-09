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
                    <img src="/img/icons/coins.png" alt="">
                    <div> {{ generalStore.playerInfo.coins }} </div>
                </div>
                <div class="crystals">
                    <img src="/img/icons/crystal.png" alt="">
                    <div> {{ generalStore.playerInfo.crystals }} </div>
                </div>
                <div class="filter-inputs" v-show="currentProduct == 'singles'">
                    <div class="searchbar-container">
                        <!-- <img src="../../../img/lens.png" alt=""> -->
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
                <div class="popup" v-show="buying">
                    <p>
                        <span>
                            Are you sure you want to buy {{ activeProduct.name }} for {{ activeProduct.price }}
                        </span> <img :src="`./img/icons/${activeProduct.currency}.png`" alt=""
                            style="width: 50px; transform: translateY(10%);">
                        ?
                    </p>
                    <div class="selection">
                        <i class="fa-solid fa-square-check" @click="buyItem"></i>
                        <i class="fa-solid fa-square-xmark" @click="() => { buying = !buying }"></i>
                    </div>

                </div>
                <div class="pack" v-for="(pack, index) in allPacks" :key="index" v-if="currentProduct == 'packs'">
                    <img :src="pack.imgPath" alt="" class="preview">
                    <div class="pack-name"> {{ pack.name }}</div>
                    <button @click="openConfirm(pack)"> BUY FOR {{ pack.price }} <img src="/img/icons/coins.png"
                            alt=""></button>
                </div>
                <div class="singles" v-for="(card, index) in allCards" :key="card.name"
                    v-else-if="currentProduct == 'singles'"
                    v-show="card.name.toLowerCase().includes(searchString.toLowerCase()) && (card.type == typeFilter || typeFilter == 'all') && (card.color == colorFilter || colorFilter == 'all' || colorFilter == 'null' && !card.color && card.type !== 'commander') && (card.rarity == rarityFilter || rarityFilter == 'all')">
                    <div class="collection-card" :style="{ 'background-image': `url(./img${card.imgPath})` }">
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
                    <button @click="openConfirm(card)"> BUY FOR {{ calcSinglePrice(card.rarity) }} <img
                            src="/img/icons/crystal.png" alt=""></button>
                </div>
            </div>
        </div>
        <div class="pull-popup" v-if="newPull.length > 0">
            <div class="pull-container">
                <button class="close-icon" @click="() => { newPull = [] }"> CLOSE </button>
                <div class="collection-card" :style="{ 'background-image': `url(./img${card.imgPath})` }"
                    v-for="(card, index) in newPull" :key="index">
                    <span class="cost stat" v-if="card.type !== 'commander'">
                        {{ card.cost.current }}
                    </span>
                    <span class="op stat" v-if="card.type == 'unit'">
                        {{ card?.op.current }}
                    </span>
                    <span class="hp stat" v-if="card.type == 'unit'">
                        {{ card?.hp.current }}
                    </span>
                    <div class="overlay" @click="revealCard($event)">
                        <i class="fa-solid fa-question"></i>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

import { useGeneralStore } from '../../stores/generalStore';
import { allPacks, allCards } from '../../db';
import gsap from 'gsap';


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
            allCards: allCards,
            buying: false,
            activeProduct: {
                name: '',
                price: 0,
                currency: 'crystal'
            },
            buyProduct: {},
            newPull: []
        }
    },
    created() {
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
        },
        calcSinglePrice(rarity) {
            if (rarity == 'common') {
                return 50
            } else if (rarity == 'rare') {
                return 150
            } else if (rarity == 'epic') {
                return 500
            } else if (rarity == 'legendary') {
                return 2000
            }
        },
        openConfirm(product) {
            this.activeProduct = product
            this.buyProduct = product
            if (!product.price) {
                this.activeProduct.price = this.calcSinglePrice(product.rarity)
                this.activeProduct.currency = 'crystal'
            } else {
                this.activeProduct.price = product.price
                this.activeProduct.currency = 'coins'
            }
            this.buying = true
            this.activeProduct.name = product.name


        },
        countCopies(card) {
            return this.generalStore.playerInfo.collection.filter(c => c.name === card.name).length;
        },
        buyItem() {

            if (this.buyProduct.type) {

                if (this.alreadyMaxCopies(this.buyProduct)) {
                    window.alert(`You already own maximum copies of ${this.buyProduct.name}`)
                    this.buying = false
                    return
                } else {
                    if (this.generalStore.playerInfo.crystals >= this.calcSinglePrice(this.buyProduct.rarity)) {
                        this.generalStore.playerInfo.crystals -= this.calcSinglePrice(this.buyProduct.rarity)
                        this.buyProduct.id = this.generalStore.generateCardId((this.countCopies(this.buyProduct) + 1), this.buyProduct.name)
                        this.generalStore.playerInfo.collection.push({ ...this.buyProduct })

                        this.generalStore.updatePlayerInfoDB()
                        this.buying = false
                    } else {
                        window.alert(`You don't have enough crystals to buy ${this.buyProduct}`)
                        this.buying = false
                        return
                    }

                }
            }
            else if (this.buyProduct.productType == 'pack') {

                if (this.generalStore.playerInfo.coins >= this.buyProduct.price) {
                    this.generalStore.playerInfo.coins -= this.buyProduct.price
                    let pull = []
                    let cardList = this.generalStore.shuffle(this.buyProduct.cardList)
                    while (pull.length !== 5) {
                        cardList.forEach((card) => {
                            if (this.isPulled(card.rarity) && pull.length !== 5) {
                                pull.push({ ...card });
                            }
                        });
                    }

                    pull.forEach((card) => {
                        if (!this.alreadyMaxCopies(card)) {

                            this.generalStore.playerInfo.collection.push(card)
                            card.id = this.generalStore.generateCardId((this.countCopies(card) + 1), card.name)
                        } else {
                            this.generalStore.playerInfo.crystals += (this.calcSinglePrice(card.rarity) / 5)
                        }
                    })

                    this.generalStore.updatePlayerInfoDB()
                    this.buying = false
                    this.newPull = pull
                } else {
                    window.alert(`You don't have enough coins to buy ${this.activeProduct.name}`)
                }

            }
        },
        isPulled(rarity) {
            let pullProbability
            let randomNumber = Math.floor(Math.random() * 500)
            switch (rarity) {
                case 'common':
                    pullProbability = 200 // Adjusted probability for common cards
                    break;

                case 'rare':
                    pullProbability = 150 // Adjusted probability for rare cards
                    break;

                case 'epic':
                    pullProbability = 100 // Adjusted probability for epic cards
                    break;

                case 'legendary':
                    pullProbability = 50 // Adjusted probability for legendary cards
                    break;
            }
            if (pullProbability > randomNumber) {
                return true
            } else {
                return false
            }
        },
        alreadyMaxCopies(newCard) {
            let ownedCopies = 0
            this.generalStore.playerInfo.collection.forEach((card) => {
                if (newCard.name == card.name) {
                    ownedCopies++
                }
            })
            if (ownedCopies >= 4) return true
            else return false
        },
        revealCard(e) {
            gsap.to(e.target, {
                opacity: 0,
                duration: 1,
            })
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
            align-items: flex-start;
            padding-block: 30px;
            padding-inline: 60px;
            gap: 20px;
            overflow-y: auto;
            max-width: 85vw;
            height: 100%;
            padding-bottom: 110px;

            button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding-block: 5px;
                padding-inline: 20px;
                border-radius: 25px;
                background-color: #1c1714;
                justify-content: center;
                border: 3px solid #0d0605;
                color: white;
                cursor: pointer;
                font-size: 1.1em;
                text-align: center;

                &:hover {
                    border-color: aqua;
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                }

                img {
                    width: 25px;
                }
            }

            .pack {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                img.preview {
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

        i {
            color: white;
            font-size: 1.2em;
            margin-top: 0.21;
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

div.popup {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background-color: rgba($color: #121212, $alpha: 0.6);
    padding: 60px;
    border-radius: 150px;

    .selection {
        display: flex;
        gap: 30px;
        margin-top: 30px;
        font-size: 1.5em;


        .fa-square-xmark {
            color: crimson;
            cursor: pointer;
        }

        .fa-square-check {
            color: greenyellow;
            cursor: pointer;
        }
    }
}

.singles {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pull-popup {

    height: fit-content;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;


    .pull-container {
        display: flex;
        gap: 10px;
        position: relative;
        border: 1px solid white;
        padding: 20px;

        .close-icon {
            position: absolute;
            bottom: -40%;
            left: 50%;
            font-size: 2em;
            color: crimson;
            z-index: 10;
            transform: translate(-50%, -50%);
            background-color: rgba($color: #000000, $alpha: 0.99);
        }

        .collection-card {
            width: 220px;
            height: 330px;

            &:hover {
                border-color: aqua;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                cursor: pointer;
            }

            .overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: rgba($color: #000000, $alpha: 0.999);
                color: crimson;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                i {
                    font-size: 3em;
                    cursor: pointer;
                    pointer-events: none;
                }
            }

            .stat {
                position: absolute;
                font-size: 1.2em;
                font-weight: bold;
                color: white;
            }

            .op,
            .hp {
                bottom: 6%;
            }

            .op {
                left: 10.5%;
            }

            .hp {
                right: 10.5%;
            }

            .cost {
                left: 10.5%;
                top: 6.5%;
            }
        }
    }


}
</style>