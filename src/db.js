// myScript.js









class gameCard {
    constructor({ name, ability, imgPath, cost, triggerTiming, type }) {
        this.name = name
        this.ability = ability
        this.imgPath = imgPath
        this.cost = cost
        this.triggerTiming = triggerTiming
        this.type = type

    }
}

class unit extends gameCard {
    constructor({ name, ability, imgPath, cost, triggerTiming, type, op, hp, canAttack, status }) {
        super({ name, ability, imgPath, cost, triggerTiming, type });
        this.op = op;
        this.hp = hp;
        this.canAttack = canAttack;
        this.status = status;
    }
}



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


//** CARDS [UNITS] */


let wolf = new unit({
    name: 'wolf',
    op: {
        original: 2,
        current: 2
    },
    hp: {
        original: 1,
        current: 1
    },
    imgPath: './src/assets/img/cards/wolf.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: {
        name: 'targetKillCost2OrLess',
        type: 'target'
    },
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
});


let knight = new unit({
    name: 'knight',
    op: {
        original: 1,
        current: 1
    },
    hp: {
        original: 3,
        current: 3
    },
    ability: {
        name: 'targetKillCost2OrLess',
        type: 'target'
    },
    imgPath: './src/assets/img/cards/knight.png',
    cost: {
        original: 1,
        current: 1
    },
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
})

let ogre = new unit({
    name: 'ogre',
    op: {
        original: 4,
        current: 4
    },
    hp: {
        original: 1,
        current: 1
    },
    imgPath: './src/assets/img/cards/ogre.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: {
        name: 'targetKillCost2OrLess',
        type: 'target'
    },
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
});

let sorceress = new unit({
    name: 'sorceress',
    op: {
        original: 0,
        current: 0
    },
    hp: {
        original: 1,
        current: 1
    },
    imgPath: './src/assets/img/cards/sorceress.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: {
        name: 'pay2Discard1',
        type: 'discard'
    },
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
});

let reaper = new unit({
    name: 'reaper',
    op: {
        original: 2,
        current: 2
    },
    hp: {
        original: 5,
        current: 5
    },
    imgPath: './src/assets/img/cards/reaper.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: {
        name: 'targetKillCost2OrLess',
        type: 'target'
    },
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
});

let skeleton = new unit({
    name: 'skeleton',
    op: {
        original: 1,
        current: 1
    },
    hp: {
        original: 1,
        current: 1
    },
    imgPath: './src/assets/img/cards/skeleton.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: null,
    triggerTiming: null,
    status: 'none',
    canAttack: false,
    type: 'unit'
});


//*** CARDS [SPELLS] */

let inner_fear = new gameCard({
    name: 'Inner Fear',
    imgPath: './src/assets/img/cards/inner_fear.png',
    cost: 1,
    ability: { name: 'reduceHpBy2', type: 'target_enemy' },
    triggerTiming: null,
    type: 'spell'
})

export const allCards = [knight, reaper, ogre]
export const allCommanders = [black, green]






