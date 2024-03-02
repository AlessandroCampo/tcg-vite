<template>

    <div class="home_menu">
        <nav>
            <button @click="joinQueue"> {{ !this.generalStore.player.inQueue ? 'PLAY' : 'IN QUEUE' }} </button>
            <button> COLLECTION </button>
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
            this.generalStore.player.inQueue = true
            this.generalStore.updateDB()
            await this.findMatch()

        },
        goToBattle() {
            this.$router.push('/battle')
        },
        async findMatch() {
            // Get a reference to the Firestore user collection
            const usersCollection = collection(db, 'Users');

            // Query users who are in the queue
            const querySnapshot = await getDocs(query(usersCollection, where('inQueue', '==', true)));

            // Iterate through the query snapshot to find a match
            for (const doc of querySnapshot.docs) {
                const opponent = doc.data();

                // Check if the opponent is not the current player, is in the queue, and has a valid UID
                if (opponent.uid !== this.generalStore.player.uid && opponent.uid !== undefined) {
                    console.log(opponent, opponent.uid);

                    // Assign the opponent's UID to the player's opponent UID
                    this.generalStore.opponentUid = opponent.uid;

                    // Remove both players from the queue


                    // Update the database with the changes
                    this.generalStore.updateDB();
                    updateDoc(doc.ref, { inQueue: false });

                    // Redirect to the battle page
                    this.generalStore.battlePageFlag = true
                    this.$router.push('/battle');
                    // this.generalStore.player.inQueue = false;
                    // opponent.inQueue = false;
                    // this.generalStore.battlePageFlag = false

                    // Exit the function since we found a match
                    return;
                }
            }

            // If no match was found, log a message
            console.log('No match found');

            // Call the function recursively after a delay (e.g., 5 seconds)
            setTimeout(() => {
                this.findMatch();
            }, 1000); // Adjust the delay as needed
        },
        changeFaction(color) {
            this.generalStore.color = color
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