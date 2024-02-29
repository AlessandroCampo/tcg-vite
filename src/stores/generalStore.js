import { defineStore } from 'pinia'
import { reactive } from 'vue';
import { allCards, allCommanders } from '../db.js'
import { abilities } from './abilities.js';
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc, updateDoc } from 'firebase/firestore'
import gsap from 'gsap'


const db = useFirestore()



// const player_db = useDocument(doc(collection(db, 'Users'), 'Player1'));

export const useGeneralStore = defineStore('generalStore', {
    state: () => ({
        cards: [...allCards.map(card => ({ ...card }))],
        user: null,
        opponentUid: undefined,
        dummyProperty: 0,
        freeze: false,
        draggedCard: undefined,
        draggedCardObj: undefined,
        clickedCard: undefined,
        clickedCardObj: undefined,
        summonedUnitCard: undefined,
        summonedUnitObj: undefined,
        player: {
            uid: '',
            username: '',
            activeTurn: true,
            activatedCard: null,
            deck: [],
            hand: [],
            field: [],
            commander: {},
            lp: 30,
            lastAction: {
                action: '',
                card: null,
                target: null
            },
            mana:
            {
                current: 1,
                total: 1
            }

        },
        opponent: {}
    }),
    getters: {

    },
    actions: {
        generateChoice(targets, condition, selectionCallback) {
            let selectedCard;
            console.log(condition)
            targets.forEach((unit) => {
                if (condition(unit)) { // 
                    const proxy = document.getElementById(unit.id);
                    proxy.style.cursor = 'pointer';
                    this.$state.freeze = true;


                    gsap.killTweensOf(proxy);


                    gsap.set(proxy, {
                        scale: 1,
                        filter: "brightness(1)"
                    });

                    gsap.to(proxy, {
                        scale: 1.1,
                        filter: "brightness(1.2)",
                        repeat: -1,
                        yoyo: true
                    });

                    const handleClick = (e) => {
                        this.freeze = false;
                        selectedCard = unit;
                        selectionCallback(selectedCard, targets);
                        this.updateBothDb()


                        // Remove event listener and reset visuals
                        const oppoFieldProxies = document.querySelectorAll('#oppoField .card-base');
                        oppoFieldProxies.forEach((el) => {
                            gsap.killTweensOf(el);
                            gsap.set(el, {
                                scale: 1,
                                filter: el.classList.contains('disabled') ? "grayscale(70%)" : "brightness(1.0)"
                            });
                            el.removeEventListener('click', handleClick);
                        });
                    };

                    // Add click event listener
                    proxy.addEventListener('click', handleClick);
                }
            });
        },
        firstTurn() {
            let fiftyhChance = Math.floor(Math.random() * 2)

            if (fiftyhChance === 1 && this.isPlayerOne(this.player.uid)) {
                this.player.activeTurn = true
                this.opponent.activeTurn = false
            } else if (fiftyhChance === 0 && this.isPlayerOne(this.player.uid)) {
                this.player.activeTurn = false
                this.opponent.activeTurn = true
            }

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
        generateCardId(index, name) {
            const myID = this.player.uid
            const oppoID = this.opponentUid
            const cardIndex = index
            const cardName = name
            let ID
            if (this.isPlayerOwned) {
                ID = myID
            } else {
                ID = oppoID
            }
            return ID + '-' + cardName + '-' + cardIndex
        },
        generateDeck() {
            for (let i = 0;i < 4;i++) {
                this.cards.forEach((card) => {
                    const cardCopy = { ...card };
                    const reactiveCard = reactive(cardCopy);
                    reactiveCard.id = this.generateCardId(i, card.name);
                    this.player.deck.push(reactiveCard);
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
            await updateDoc(playerRef, playerObjCopy)

        },
        async updateOpponentDB() {
            const opponentRef = doc(db, 'Users', this.opponentUid);
            const opponentObjCopy = { ...this.opponent }
            await updateDoc(opponentRef, opponentObjCopy)
        },
        checkAbility(name, card) {
            if (card.ability.target && this.opponent.field.length == 0) {
                if (card.type == 'spell') {
                    this.player.activatedCard = null
                    this.updateBothDb()
                }
                return
            } else {
                this.freeze = true
            }
            if (abilities.hasOwnProperty(name)) {
                if (card.type == 'unit') {
                    setTimeout(() => {
                        this.player.field.forEach((unit) => {
                            if (unit.id == card.id) {
                                const playerField = document.getElementById('player-field')
                                // const cardElement = playerField.querySelector('#' + unit.id);
                                console.log(card.id)
                                const cardElement = document.getElementById(unit.id)
                                console.log(unit)

                                this.animateAbility(cardElement, unit)
                                this.sendActionObj(unit, unit, 'effectTrigger')
                                this.resetActionObj()
                            }
                        });
                    }, 700);
                } else if (card.type == 'spell') {
                    console.log('spell activated')
                    this.player.activatedCard = card
                    this.updateBothDb()
                    setTimeout(() => { this.resolveAbility(card) }, 500)

                }

            }
        },
        animateAbility(cardElement, unit) {
            console.log(cardElement, unit)
            let effect = new Image()
            effect.src = "./src/assets/img/animations/effect.gif"
            effect.className = "icon"
            cardElement.append(effect)
            gsap.timeline()
                .to(cardElement, {
                    y: -20,
                    scale: 1.2,

                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power1.inOut'
                })
                .to(cardElement, {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    onComplete: () => {
                        effect.remove();
                        this.resolveAbility(unit)
                    }
                });
        },
        resolveAbility(activated) {
            if (activated.status == 'onField' && activated.ability.triggerTiming == 'onPlay' && activated.type == 'unit') {
                this.player.field.forEach((card) => {
                    if (card.id === activated.id) {
                        card.canAttack = false;
                        abilities[card.ability.effect](card);
                        this.updateBothDb()
                    }
                });
            } else if (activated.type == 'spell') {
                abilities[activated.ability.effect](activated);
                this.updateBothDb()
            }

        },
        battle(attacker, target) {

            attacker.canAttack = false
            attacker.hp.current -= target.op.current;
            target.hp.current -= attacker.op.current;

            this.updateBothDb()
        },
        drawOne() {
            let randomIndex = Math.floor(Math.random() * this.player.deck.length)
            this.player.deck[randomIndex].status = 'inHand'
            this.player.hand.push(this.player.deck[randomIndex])
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
        playSpell(propCard) {
            const playerHandArray = this.player.hand
            const propCardIndex = playerHandArray.indexOf(propCard)
            playerHandArray.splice(propCardIndex, 1)
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

            var stopDistance = distance + 200;
            if (targetCard.id == 'enemy-hero-cont' || targetCard.id == 'player-hero-cont') {
                stopDistance += 2500
            }

            var normalizedDeltaX = deltaX / distance * stopDistance;
            var normalizedDeltaY = deltaY / distance * stopDistance;

            gsap.to(attackingCard, {
                rotation: angle,
                x: attackingRect.left + normalizedDeltaX - attackingRect.left,
                y: attackingRect.top + normalizedDeltaY - attackingRect.top,
                duration: 0.1,
                scale: 1,
                onComplete: function () {
                    let dmgIcon = document.createElement('div')
                    dmgIcon.classList.add('icon')
                    let dmgIcon2 = document.createElement('div')
                    dmgIcon2.classList.add('icon')
                    dmgIcon.style.backgroundImage = "url('./src/assets/img/animations/icon_damage.png')"
                    dmgIcon2.style.backgroundImage = "url('./src/assets/img/animations/icon_damage.png')"
                    dmgIcon.innerText = '-' + defDmg
                    dmgIcon2.innerText = '-' + attackDmg
                    if (defDmg) {
                        attackingCard.append(dmgIcon)
                    }

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
        },
        performLastAction(action, cardID, targetID, cardObj, targetObj) {
            if (!action) return
            const card = document.getElementById(cardID)
            const target = document.getElementById(targetID)
            if (action === 'attack') {
                this.animateAttack(card, target, cardObj?.op.current, targetObj?.op.current)
            }
            if (action == 'effectTrigger') {
                this.animateAbility(target, targetObj)
            }
        },
        sendActionObj(attacker, target, action) {
            this.player.lastAction = {
                card: attacker.id,
                target: target.id,
                cardObj: attacker,
                targetObj: target,
                action: action
            }
            this.updateBothDb()
        },
        resetActionObj() {
            this.player.lastAction = {
                action: '',
                card: null,
                target: null
            }
            this.updateBothDb()
        },




    },

})
