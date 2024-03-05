import { defineStore } from 'pinia'
import { reactive } from 'vue';
import { allCards, allCommanders } from '../db.js'
import { abilities } from './abilities.js';
import { useFirestore, useDocument } from 'vuefire'
import { doc, collection, setDoc, updateDoc, runTransaction, writeBatch } from 'firebase/firestore'
import gsap from 'gsap'


const db = useFirestore()



// const player_db = useDocument(doc(collection(db, 'Users'), 'Player1'));

export const useGeneralStore = defineStore('generalStore', {
    state: () => ({
        battlePageFlag: false,
        collectionPageFlag: false,
        cards: [...allCards.map(card => ({ ...card }))],
        color: 'black',
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
            winner: false,
            gameover: false,
            decided: false,
            uid: '',
            username: '',
            activeTurn: true,
            activatedCard: null,
            deck: [],
            hand: [],
            field: [],
            graveyard: [],
            traps: [],
            commander: allCommanders[0],
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
        playerInfo: {
            inQueue: false,
            uid: '',
            username: '',
            email: '',
            collection: []
        },
        opponent: {}
    }),
    getters: {

    },
    actions: {
        generateChoice(targets, condition, selectionCallback) {
            let selectedCard;
            let foundTargets = false
            targets.forEach((unit) => {
                if (condition(unit)) { // 
                    const proxy = document.getElementById(unit.id);
                    proxy.style.cursor = 'pointer';
                    this.$state.freeze = true;
                    foundTargets = true


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
                        // this.updateBothDb()


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
            if (!foundTargets) {
                this.freeze = false;
            }
        },
        async firstTurn() {
            if (!this.opponent.decided) {
                this.player.activeTurn = !this.opponent.activeTurn
                this.player.decided = true
                await this.updateBothDb();
            }

        }
        ,
        isPlayerOne(id) {
            if (id === 'KNOiaPNOj3V7LNq9rvH8zvtR4Hp1') {
                return true
            } else if (id === 'PPMzIrPbubaazLC7Es7RDtI93mI3') {
                return false
            }
        },
        isPlayerOwned(cardID) {
            if (cardID.includes(this.player.uid)) {
                return true
            } else {
                return false
            }
        },
        generateCardId(index, name) {
            const myID = this.player.uid
            const oppoID = this.opponentUid
            const cardIndex = index
            const cardName = name
            let ID = myID
            return ID + '-' + cardName + '-' + cardIndex
        },
        generateDeck() {
            // for (let i = 0;i < 4;i++) {
            //     this.cards.forEach((card) => {
            //         if (card.color == this.color || !card.color) {
            //             const cardCopy = { ...card };
            //             const reactiveCard = reactive(cardCopy);
            //             reactiveCard.id = this.generateCardId(i, card.name);
            //             reactiveCard.playerOwned = this.isPlayerOwned(reactiveCard.id)
            //             this.player.deck.push(reactiveCard);
            //         }
            //     });
            // }

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
            switch (this.color) {
                case 'black':
                    this.player.commander = allCommanders[0];
                    this.player.lp = this.player.commander.lp

                    break;
                case 'white':
                    this.player.commander = allCommanders[1];
                    this.player.lp = this.player.commander.lp

                    break;
                default:
                    this.player.commander = allCommanders[0];
            }
            this.updateDB()
        },


        checkAbility(name, card) {
            if (card.ability.target && this.opponent.field.length == 0) {
                if (card.type == 'spell') {
                    this.player.activatedCard = null
                    this.updateDB()
                    setTimeout(() => { this.player.activatedCard = null }, 1000)
                } else if (card.type == 'unit') {
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
                                const cardElement = document.getElementById(unit.id)
                                this.animateAbility(cardElement, unit)
                                if (unit.ability.triggerTiming !== 'onKilled' && unit) {

                                    this.sendActionObj(unit, unit, 'effectTrigger')
                                }
                                this.resetActionObj()

                            }
                        });
                    }, 700);
                } else if (card.type == 'spell') {

                    this.player.activatedCard = card
                    this.updateDB()
                    setTimeout(() => { this.resolveAbility(card) }, 500)

                }

            }
        },
        animateAbility(cardElement, unit) {
            if (unit.ability.triggerTiming == 'onKilled') {
                this.resolveAbility(unit)
                return
            }
            let effect = new Image()
            effect.src = "./img/animations/effect.gif"
            effect.className = "icon"
            if (cardElement) {
                cardElement.append(effect)
            } else {
                return
            }

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
                        abilities[card.ability.effect](card);
                        if (!activated.ability.target) {
                            card.canAttack = false;
                        }
                        this.updateDB()

                    }
                });
            } else if (activated.type == 'spell') {
                abilities[activated.ability.effect](activated);
                this.updateDB()

            } else if (activated.status == 'onField' && activated.ability.triggerTiming == 'onKilled' && activated.type == 'unit') {
                abilities[activated.ability.effect](activated);
                // this.updateBothDb()
            } else if (activated.type == 'commander') {
                abilities[activated.ability.effect](activated);
            }

        },
        battle(attacker, target) {

            if (this.player.activeTurn && this.opponent.traps.length > 0) {
                const trapFound = this.checkTraps(attacker, target, 'onAttack');
                if (trapFound) return;
            }
            attacker.canAttack = false
            attacker.hp.current -= target.op.current;
            target.hp.current -= attacker.op.current;
            if (attacker.hp.current <= 0) {
                attacker.killed = true

            } if (target.hp.current <= 0) {
                target.killed = true

            }

            this.updateBothDb()
        },
        drawOne() {
            let randomIndex = Math.floor(Math.random() * this.player.deck.length);
            let drawnCard = this.player.deck[randomIndex]; // Store the drawn card in a variable
            drawnCard.status = 'inHand';
            this.player.hand.push(drawnCard);
            this.player.deck.splice(randomIndex, 1);
            this.updateDB();
            return drawnCard; // Return the drawn card
        },
        async updateDB() {
            const playerRef = doc(db, 'Users', this.player.uid, 'GameState', 'GameState' + this.player.uid);
            const playerObjCopy = { ...this.player };
            await updateDoc(playerRef, playerObjCopy);
        },

        async updateOpponentDB() {
            const opponentRef = doc(db, 'Users', this.opponentUid, 'GameState', 'GameState' + this.opponentUid);
            const opponentObjCopy = { ...this.opponent };
            await updateDoc(opponentRef, opponentObjCopy);
        },
        async updateBothDb() {
            const batch = writeBatch(db);
            const playerRef = doc(db, 'Users', this.player.uid, 'GameState', 'GameState' + this.player.uid);
            batch.update(playerRef, { ...this.player });
            const opponentRef = doc(db, 'Users', this.opponentUid, 'GameState', 'GameState' + this.opponentUid);
            batch.update(opponentRef, { ...this.opponent });
            await batch.commit();
        },
        async updatePlayerInfoDB() {
            const playerRef = doc(db, 'Users', this.player.uid);
            const playerInfoObjCopy = { ...this.playerInfo };
            await updateDoc(playerRef, playerInfoObjCopy);
        }
        ,
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
        playTrap(propCard) {
            const playerHandArray = this.player.hand
            const propCardIndex = playerHandArray.indexOf(propCard)
            playerHandArray.splice(propCardIndex, 1)
            this.player.traps.push(propCard)
            this.updateDB()
        },
        animateAttack(attackingCard, targetCard, attackDmg, defDmg) {
            if (!attackingCard || !targetCard) return
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
                    dmgIcon.style.backgroundImage = "url('./img/animations/icon_damage.png')"
                    dmgIcon2.style.backgroundImage = "url('./img/animations/icon_damage.png')"
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
            if (action == 'attack') {

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


            this.updateDB()
        },
        resetActionObj() {
            this.player.lastAction = {
                action: '',
                card: null,
                target: null
            }
            this.updateDB()
        },
        checkTraps(trapTarget, attackTarget, triggerType) {


            let foundTrap = false
            this.opponent.traps.forEach((trap, index) => {
                const condition = trap.ability.condition
                    ? new Function('trapTarget', `return ${trap.ability.condition}`)
                    : new Function('trapTarget', 'return true');
                if (trap.ability.triggerTiming == triggerType && !foundTrap && condition(trapTarget)) {

                    foundTrap = true
                    this.opponent.activatedCard = trap
                    this.opponent.traps.splice(index, 1)
                    abilities[trap.ability.effect](trap, trapTarget, attackTarget);
                    this.updateBothDb()
                    // setTimeout(() => { this.opponent.activatedCard = null; this.player.activatedCard = null; this.updateBothDb }, 1400)
                }
            })
            return foundTrap
        }
    },

})
