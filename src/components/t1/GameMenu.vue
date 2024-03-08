<template>

    <div class="home_menu">
        <nav>
            <button @click="joinQueue"> {{ !this.generalStore.playerInfo.inQueue ? 'PLAY' : 'IN QUEUE ' + queueTimer }}
            </button>
            <button @click="goToCollection"> COLLECTION </button>
            <button @click="goToShop"> SHOP </button>
        </nav>
        <div class="user" v-if="generalStore.user">
            <img src="/img/simple_soldier.png" alt="">
            <div> {{ generalStore.playerInfo.username }} </div>
            <div> LEVEL: {{ levelName }} ({{ generalStore.playerInfo.level }}) </div>
            <div> XP: {{ generalStore.playerInfo.experience }} / {{ xpForNextLevel }} </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { allCommanders } from '../../db';
import { useGeneralStore } from '../../stores/generalStore';
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';

const db = useFirestore()

export default {
    data() {
        return {
            generalStore: useGeneralStore(),
            timerInterval: null,
            minutes: 0,
            seconds: 0,
            playerLevel: '',
            levelName: '',
            experienceToNextLevel: 0,
            xpForNextLevel: 0
        }
    },
    mounted() {
        setTimeout(() => { this.calculatePlayerLevel() }, 1500)

    },
    methods: {
        async joinQueue() {
            if (this.generalStore.playerInfo.deck.decklist.length < 30) {
                window.alert('You need at least 30 cards in your deck to start a game')
                return
            }
            if (!this.generalStore.playerInfo.inQueue) {
                this.generalStore.playerInfo.inQueue = true
                this.timerInterval = setInterval(() => {
                    this.seconds++
                    if (this.seconds == 60) {
                        this.seconds = 0
                        this.minutes++
                    }
                }, 1000)
                this.generalStore.updatePlayerInfoDB()
                await this.findMatch()
            } else {
                this.generalStore.playerInfo.inQueue = false
                this.minutes = 0
                this.seconds = 0
                clearInterval(this.timerInterval)
                this.generalStore.updatePlayerInfoDB()
            }
        },
        goToCollection() {
            this.generalStore.collectionPageFlag = true
            this.$router.push('/collection')

        },
        goToShop() {
            this.generalStore.shopPageFlag = true
            this.$router.push('/shop')

        },
        goToBattle() {
            this.$router.push('/battle')
        },
        async findMatch() {

            const usersCollection = collection(db, 'Users');


            const querySnapshot = await getDocs(query(usersCollection, where('inQueue', '==', true)));


            for (const doc of querySnapshot.docs) {
                const opponent = doc.data();


                if (opponent.uid !== this.generalStore.player.uid && opponent.uid !== undefined) {

                    this.generalStore.opponentUid = opponent.uid;



                    // Update the database with the changes
                    this.generalStore.updateDB();
                    updateDoc(doc.ref, { inQueue: false });

                    // Redirect to the battle page
                    this.generalStore.battlePageFlag = true
                    this.$router.push('/battle');

                    // opponent.inQueue = false;
                    // this.generalStore.battlePageFlag = false

                    // Exit the function since we found a match
                    return;
                }
            }




            setTimeout(() => {
                this.findMatch();
            }, 1000);
        },
        changeFaction(color) {
            this.generalStore.color = color
            if (color == 'white') {
                this.generalStore.player.commander = allCommanders[1]
            } else if (color == 'black') {
                this.generalStore.player.commander = allCommanders[0]
            }

        },
        calculatePlayerLevel() {
            let currentPlayerLevel = this.generalStore.playerInfo.level;
            let currentPlayerXp = this.generalStore.playerInfo.experience;
            console.log(currentPlayerLevel)
            let levelNames = {
                11: 'Simple Soldier',
                21: 'Experienced Warrior',
                31: 'Seasoned Veteran',
                41: 'Elite Commander',
                51: 'Legendary Hero'
            };


            // Determine the player's current level name
            for (let level in levelNames) {
                if (currentPlayerLevel <= parseInt(level)) {
                    this.levelName = levelNames[level];
                    break;
                }
            }

            if (currentPlayerLevel < 50) {
                let nextLevel = Math.min(currentPlayerLevel + 1, 50);
                this.xpForNextLevel = Math.pow(nextLevel, 2) * 10;

                if (currentPlayerXp >= this.xpForNextLevel) {
                    this.generalStore.playerInfo.level++;
                    this.generalStore.playerInfo.experience = currentPlayerXp - this.xpForNextLevel;
                }
            }
            this.generalStore.updatePlayerInfoDB()




        }


    },
    computed: {
        queueTimer() {
            const formattedMinutes = String(this.minutes).padStart(2, '0');
            const formattedSeconds = String(this.seconds).padStart(2, '0');

            return `${formattedMinutes}:${formattedSeconds}`;
        }
    }


}
</script>

<style lang="scss" scoped>
.home_menu {
    background-image: url('../../assets/img/menu_background.png');
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    padding-inline-start: 80px;

    nav {
        display: flex;
        flex-direction: column;
        gap: 1.2em;

        button {
            color: white;
            background-color: rgba(55, 55, 55, 0.7);
            border-radius: 30px;
            cursor: pointer;
            padding-inline: 55px;
            padding-block: 5px;
            font-size: 2em;
        }
    }
}

.side-selection {
    position: absolute;
    bottom: 5%;
    right: 5%;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-direction: column;
    border-radius: 30%;
    background-color: rgba(55, 55, 55, 0.7);
    padding: 30px;

    img {
        width: 200px;
        cursor: pointer;
    }

    h2 {
        color: white;
        font-weight: bold;

        padding: 10px;
    }

    div {
        display: flex;
        align-items: center;
        gap: 50px;

    }

    .inactive {
        opacity: 0.3;
    }


}

.user {
    position: absolute;
    bottom: 5%;
    right: 5%;
    background-color: rgba(55, 55, 55, 0.7);
    padding: 30px;
    text-align: center;

    img {
        max-width: 250px;
        aspect-ratio: 1;
        clip-path: circle();
    }

    div {
        color: white;
        font-size: 2em;
    }
}
</style>