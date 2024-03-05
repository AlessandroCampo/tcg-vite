<template>

    <div class="home_menu">
        <nav>
            <button @click="joinQueue"> {{ !this.generalStore.playerInfo.inQueue ? 'PLAY' : 'IN QUEUE' }} </button>
            <button @click="goToCollection"> COLLECTION </button>


            <button> SHOP </button>
            <button> QUIT </button>
        </nav>
        <div class="side-selection">
            <h2> CHOOSE YOUR FACTION: </h2>
            <div>
                <img src="../../assets/img/black.png" alt="" @click="changeFaction('black')"
                    :class="generalStore.color !== 'black' ? 'inactive' : ''">
                <img src="../../assets/img/white.png" alt="" @click="changeFaction('white')"
                    :class="generalStore.color == 'black' ? 'inactive' : ''">
            </div>

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
            generalStore: useGeneralStore()
        }
    },
    methods: {
        async joinQueue() {
            if (this.generalStore.player.deck.length < 30) {
                window.alert('You need at least 30 cards in your deck to start a game')
                return
            }
            if (!this.generalStore.playerInfo.inQueue) {
                this.generalStore.playerInfo.inQueue = true
                this.generalStore.updatePlayerInfoDB()
                await this.findMatch()
            } else {
                this.generalStore.playerInfo.inQueue = false
                this.generalStore.updatePlayerInfoDB()
            }



        },
        goToCollection() {
            this.generalStore.collectionPageFlag = true
            this.$router.push('/collection')

        }
        ,
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
</style>