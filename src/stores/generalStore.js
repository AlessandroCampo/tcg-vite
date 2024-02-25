import { defineStore } from 'pinia'
import { allCards, abilities, allCommanders } from '../db.js'
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc } from 'firebase/firestore'
import gsap from 'gsap'
const db = useFirestore()


// const player_db = useDocument(doc(collection(db, 'Users'), 'Player1'));

export const useGeneralStore = defineStore('generalStore', {
    state: () => ({
        cards: [...allCards.map(card => ({ ...card }))],
        user: null,
        opponentUid: undefined,
        draggedCard: undefined,
        draggedCardObj: undefined,
        player: {
            uid: '',
            username: '',
            activeTurn: true,
            deck: [],
            hand: [],
            field: [],
            commander: {},
            lp: 30,
            mana:
            {
                current: 1,
                total: 1
            }

        },
        opponent: {},
        enemyMana: {
            current: 1,
            total: 1
        },
    }),
    getters: {

    },
    actions: {
        firstTurn() {
            // if (this.player.activeTurn) {
            //     return
            // }
            let fiftyhChance = Math.floor(Math.random() * 2)
            console.log(fiftyhChance)
            if (fiftyhChance === 1 && this.isPlayerOne(this.player.uid)) {
                this.player.activeTurn = true
                this.opponent.activeTurn = false
            } else if (fiftyhChance === 0 && this.isPlayerOne(this.player.uid)) {
                this.player.activeTurn = false
                this.opponent.activeTurn = true
            }
            console.log(this.player.activeTurn)
            this.updateDB()
            this.updateOpponentDB()
        },
        isPlayerOne(id) {
            if (id === 'KNOiaPNOj3V7LNq9rvH8zvtR4Hp1') {
                return true
            } else if (id === 'PPMzIrPbubaazLC7Es7RDtI93mI3') {
                return false
            }
        },
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
                deck[randomIndex].status = 'inHand'
                this.player.hand.push(deck[randomIndex])
                deck.splice(randomIndex, 1)
            }
            console.log(this.player.hand)

        },
        assignCommander() {
            if (this.isPlayerOne(this.player.uid)) {
                this.player.leader = allCommanders[0]
            } else {
                this.player.leader = allCommanders[1]
            }
            this.updateDB()
            this.updateOpponentDB()
        },
        async updateDB() {
            const playerRef = doc(db, 'Users', this.player.uid);
            const playerObjCopy = { ...this.player }

            if (this.isPlayerOne(this.player.uid)) {
                this.opponentUid = 'PPMzIrPbubaazLC7Es7RDtI93mI3'
                this.player.leader = allCommanders[0]
            } else {
                this.opponentUid = 'KNOiaPNOj3V7LNq9rvH8zvtR4Hp1'
                this.player.leader = allCommanders[1]
            }
            await setDoc(playerRef, playerObjCopy)
            console.log(this.player.leader)

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
        },
        drawOne() {
            let randomIndex = Math.floor(Math.random() * this.player.deck.length)
            this.player.deck[randomIndex].status = 'inHand'
            this.player.hand.unshift(this.player.deck[randomIndex])
            this.player.deck.splice(randomIndex, 1)
            this.updateBothDb()
        },
        updateBothDb() {
            this.updateDB()
            this.updateOpponentDB()
        }

    },
})