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
        clickedCard: undefined,
        clickedCardObj: undefined,
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
            attacker.canAttack = false
            attacker.hp -= target.op;
            target.hp -= attacker.op;

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
        },
        summonUnit(propCard) {
            const playerFieldArray = this.player.field
            const playerHandArray = this.player.hand
            const propCardIndex = playerHandArray.indexOf(propCard)
            playerHandArray.splice(propCardIndex, 1)
            propCard.status = 'onField'
            playerFieldArray.push(propCard)
        },
        animateAttack(attackingCard, targetCard, attackDmg, defDmg) {
            var attackingRect = attackingCard.getBoundingClientRect();
            var targetRect = targetCard.getBoundingClientRect();
            var deltaX = targetRect.left - attackingRect.left;
            var deltaY = targetRect.top - attackingRect.top;
            var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            var angleBetweenCards = Math.atan2(deltaY, deltaX);
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);


            if (deltaX < 0) {
                angle = -45;
            } else {
                angle = 45;
            }

            var stopDistance = distance - 50;

            var normalizedDeltaX = deltaX / distance * stopDistance;
            var normalizedDeltaY = deltaY / distance * stopDistance;

            gsap.to(attackingCard, {
                rotation: angle,
                x: attackingRect.left + normalizedDeltaX - attackingRect.left,
                y: attackingRect.top + normalizedDeltaY - attackingRect.top,
                duration: 0.2,
                scale: 0.8,
                onComplete: function () {
                    let dmgIcon = document.createElement('div')
                    dmgIcon.classList.add('icon')
                    let dmgIcon2 = document.createElement('div')
                    dmgIcon2.classList.add('icon')
                    dmgIcon.style.backgroundImage = "url('./src/assets/img/animations/icon_damage.png')"
                    dmgIcon2.style.backgroundImage = "url('./src/assets/img/animations/icon_damage.png')"
                    dmgIcon.innerText = '-' + defDmg
                    dmgIcon2.innerText = '-' + attackDmg
                    attackingCard.append(dmgIcon)
                    targetCard.append(dmgIcon2)
                    setTimeout(() => { dmgIcon.remove(), dmgIcon2.remove() }, 1100)
                    gsap.to(attackingCard, {
                        rotation: 0,
                        x: 0,
                        y: 0,
                        duration: 0.5
                    });
                }
            });
        }

    },
})