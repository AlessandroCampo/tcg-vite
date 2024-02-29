// myScript.js









class gameCard {
    constructor({ name, ability, imgPath, cost, type }) {
        this.name = name
        this.ability = ability
        this.imgPath = imgPath
        this.cost = cost
        this.type = type


    }
}

class unit extends gameCard {
    constructor({ name, ability, imgPath, cost, type, op, hp, canAttack, status, killed }) {
        super({ name, ability, imgPath, cost, type });
        this.op = op;
        this.hp = hp;
        this.canAttack = canAttack;
        this.status = status;
        this.killed = killed
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
    op: { original: 2, current: 2 },
    hp: { original: 1, current: 1 },
    imgPath: './src/assets/img/cards/wolf.png',
    cost: { original: 1, current: 1 },
    ability: { effect: 'targetKill', condition: "unit.cost.current < 2", triggerTiming: 'onPlay', cost: null },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false
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
    ability: { effect: 'modifyStat', amount: 1, selfTarget: true, triggerTiming: 'onPlay', buff: true, targetStat: 'hp', cost: null },
    imgPath: './src/assets/img/cards/knight.png',
    cost: {
        original: 1,
        current: 1
    },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false
})

let ogre = new unit({
    name: 'ogre',
    op: {
        original: 4,
        current: 4
    },
    hp: {
        original: 2,
        current: 2
    },
    imgPath: './src/assets/img/cards/ogre.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: { effect: 'modifyStat', amount: 1, selfTarget: true, triggerTiming: 'onPlay', buff: false, targetStat: 'hp', cost: null },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false
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
    ability: { effect: 'discard', condition: null, triggerTiming: 'onPlay', cost: { from: 'hp', amount: 2 }, amount: 1 },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false
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
    ability: { effect: 'targetKill', condition: "unit.cost.current < 2", triggerTiming: 'onPlay', cost: null, target: true },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false
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
    ability: { effect: 'targetKill', condition: "unit.cost.current < 2", triggerTiming: 'onPlay', cost: null },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false
});


//*** CARDS [SPELLS] */

let inner_fear = new gameCard({
    name: 'Inner Fear',
    imgPath: './src/assets/img/cards/inner_fear.png',
    cost: 1,
    ability: { effect: 'modifyStat', amount: 2, selfTarget: false, triggerTiming: 'onPlay', buff: false, targetStat: 'hp', cost: null, condition: null, target: true },
    type: 'spell'
})

let pot_of_malice = new gameCard({
    name: 'Pot of Malice',
    imgPath: './src/assets/img/cards/pot_of_malice.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: { effect: 'draw', amount: 2 },
    type: 'spell'
})

export const allCards = [reaper, inner_fear, pot_of_malice]
export const allCommanders = [black, green]






