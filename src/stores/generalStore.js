import { defineStore } from 'pinia'
import { allCards, abilities } from '../db.js'
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc } from 'firebase/firestore'
import gsap from 'gsap'
const db = useFirestore()


// const player_db = useDocument(doc(collection(db, 'Users'), 'Player1'));

export const useGeneralStore = defineStore('generalStore', {
    state: () => ({
        cards: [...allCards.map(card => ({ ...card }))],
        user: null,
        activeTurn: false,
        opponentUid: undefined,
        draggedCard: undefined,
        draggedCardObj: undefined,
        player: {
            uid: '',
            username: '',
            deck: [],
            hand: [],
            field: [],
            mana:
            {
                current: 3,
                total: 2
            }

        },
        opponent: {},
        enemyMana: {
            current: 3,
            total: 2
        },
    }),
    getters: {

    },
    actions: {
        generateDeck() {
            for (let i = 0;i < 4;i++) {
                this.cards.forEach((card) => {
                    // Create a shallow copy of the card object
                    const cardCopy = { ...card };
                    this.player.deck.push(cardCopy);
                });
            }

        },
        generateFirstHand(deck) {
            for (let i = 0;i < 5;i++) {
                let randomIndex = Math.floor(Math.random() * deck.length)

                this.player.hand.push(deck[randomIndex])
                deck.splice(randomIndex, 1)
            }

        },
        async updateDB() {
            const playerRef = doc(db, 'Users', this.player.uid);
            const playerObjCopy = { ...this.player }
            await setDoc(playerRef, playerObjCopy)
            this.player.uid === 'gMopyAIBdRe8HOTkXQ2dCe86V2k1' ? this.opponentUid = 'gEnS7hbk5zMwMRPiU5CvuBTU1As1' : this.opponentUid = 'gMopyAIBdRe8HOTkXQ2dCe86V2k1'

        },
        async updateOpponentDB() {
            const opponentRef = doc(db, 'Users', this.opponentUid);
            const opponentObjCopy = { ...this.opponent }
            await setDoc(opponentRef, opponentObjCopy)
        },
        checkAbility(name, card) {
            if (abilities.hasOwnProperty(name)) {
                abilities[name](card);
            } else {
                console.error(`Ability "${name}" not found.`);
            }
        },
        battle(attacker, target, attackerProxy, targetProxy) {
            let killedIndexAttacker = -1;
            let killedIndexTarget = -1;

            // Decrease HP of attacker and target
            attacker.hp -= target.op;
            target.hp -= attacker.op;

            // Check if attacker is killed
            // if (attacker.hp <= 0) {
            //     killedIndexAttacker = this.player.field.indexOf(attacker);
            //     this.player.field.splice(killedIndexAttacker, 1);
            // }

            // // Check if target is killed
            // if (target.hp <= 0) {
            //     killedIndexTarget = this.opponent.field.indexOf(target);
            //     this.opponent.field.splice(killedIndexTarget, 1);
            // }

            this.updateDB()
            this.updateOpponentDB()
        }

        ,
        // destroyedByBattle(proxy) {
        //     gsap.to(proxy, {
        //         opacity: 0,
        //         duration: 0.7,
        //         onComplete() {
        //             proxy.remove()
        //         }
        //     })
        // }

    },
})