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


export const abilities = {
    increaseOp: (card) => {
        card.op++;
    },
    reduceHpBy2: (target) => {
        target.hp -= 2
    }
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


//** CARDS [UNITS] */

let wolf = new unit({
    name: 'wolf',
    op: 2,
    hp: 1,
    imgPath: './src/assets/img/cards/wolf.png',
    cost: 1,
    ability: {
        name: 'increaseOp',
        type: 'self_buff'
    },
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
});


let knight = new unit({
    name: 'knight',
    op: 1,
    hp: 3,
    ability: {
        name: 'increaseOp',
        type: 'self_buff'
    },
    imgPath: './src/assets/img/cards/knight.png',
    cost: 1,
    triggerTiming: 'onPlay',
    status: 'none',
    canAttack: false,
    type: 'unit'
})

let ogre = new unit({
    name: 'ogre',
    op: 4,
    hp: 1,
    imgPath: './src/assets/img/cards/ogre.png',
    cost: 1,
    ability: {
        name: 'increaseOp',
        type: 'self_buff'
    },
    triggerTiming: null,
    status: 'none',
    canAttack: false,
    type: 'unit'
});

let sorceress = new unit({
    name: 'sorceress',
    op: 0,
    hp: 1,
    imgPath: './src/assets/img/cards/sorceress.png',
    cost: 1,
    ability: null,
    triggerTiming: null,
    status: 'none',
    canAttack: false,
    type: 'unit'
});

let reaper = new unit({
    name: 'reaper',
    op: 2,
    hp: 5,
    imgPath: './src/assets/img/cards/reaper.png',
    cost: 1,
    ability: null,
    triggerTiming: null,
    status: 'none',
    canAttack: false,
    type: 'unit'
});

let skeleton = new unit({
    name: 'skeleton',
    op: 1,
    hp: 1,
    imgPath: './src/assets/img/cards/skeleton.png',
    cost: 1,
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

export const allCards = [wolf, knight, ogre, skeleton, reaper]
export const allCommanders = [black, green]
