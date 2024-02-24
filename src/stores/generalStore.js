import { defineStore } from 'pinia'
import { allCards } from '../db.js'

export const useGeneralStore = defineStore('generalStore', {
    state: () => ({
        cards: [...allCards.map(card => ({ ...card }))], // Copy each card object
        draggedCard: undefined,
        draggedCardObj: undefined,
        player: {
            deck: [],
            hand: [],
            mana:
            {
                current: 3,
                total: 2
            }

        },
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

        }

    },
})