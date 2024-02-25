class gameCard {
    constructor({ name, op, hp, ability, description, imgPath, cost, triggerTiming, status, canAttack }) {
        this.name = name
        this.op = op
        this.hp = hp
        this.ability = ability
        this.description = description
        this.imgPath = imgPath
        this.cost = cost
        this.triggerTiming = triggerTiming
        this.status = status
        this.canAttack = canAttack
    }
}

export const abilities = {
    increaseOp: (card) => {
        card.op++;
    },
};

////**** COMMANDERS //// */

let black = {

    name: 'black',
    artwork: './src/assets/img/commanders/black.png',
    colors: ['black']
}

let green = {
    name: 'green',
    artwork: './src/assets/img/commanders/green.png',
    colors: ['green']
}


let wolf = new gameCard({
    name: 'wolf',
    op: 2,
    hp: 1,
    description: 'This card is a wolf',
    imgPath: './src/assets/img/cards/wolf.png',
    cost: 1,
    ability: 'increaseOp',
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
});


let knight = new gameCard({
    name: 'knight',
    op: 1,
    hp: 2,
    description: 'This card  is a knight',
    ability: 'increaseOp',
    imgPath: './src/assets/img/cards/knight.png',
    cost: 1,
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
})

let ogre = new gameCard({
    name: 'ogre',
    op: 4,
    hp: 1,
    description: 'This card is an ogre',
    imgPath: './src/assets/img/cards/ogre.png',
    cost: 1,
    ability: 'increaseOp',
    triggerTiming: null,
    status: 'none',
    canAttack: false,
});

let sorceress = new gameCard({
    name: 'sorceress',
    op: 0,
    hp: 1,
    description: 'This card is an sorceress',
    imgPath: './src/assets/img/cards/sorceress.png',
    cost: 1,
    ability: null,
    triggerTiming: null,
    status: 'none',
    canAttack: false,
});

let reaper = new gameCard({
    name: 'reaper',
    op: 4,
    hp: 2,
    description: 'This card is an reaper',
    imgPath: './src/assets/img/cards/reaper.png',
    cost: 1,
    ability: null,
    triggerTiming: null,
    status: 'none',
    canAttack: false,
});

let skeleton = new gameCard({
    name: 'skeleton',
    op: 1,
    hp: 1,
    description: 'This card is an skeleton',
    imgPath: './src/assets/img/cards/skeleton.png',
    cost: 1,
    ability: null,
    triggerTiming: null,
    status: 'none',
    canAttack: false,
});

export const allCards = [wolf, knight, ogre, sorceress, skeleton, reaper]
export const allCommanders = [black, green]
