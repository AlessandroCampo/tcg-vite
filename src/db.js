// myScript.js









class gameCard {
    constructor({ name, ability, imgPath, cost, type, playerOwned, color }) {
        this.name = name
        this.ability = ability
        this.imgPath = imgPath
        this.cost = cost
        this.type = type
        this.playerOwned = playerOwned
        this.color = color
    }
}

class unit extends gameCard {
    constructor({ name, ability, imgPath, cost, type, op, hp, canAttack, status, killed, playerOwned, color, attributes }) {
        super({ name, ability, imgPath, cost, type, playerOwned, color });
        this.op = op;
        this.hp = hp;
        this.canAttack = canAttack;
        this.status = status;
        this.killed = killed
        this.attributes = attributes
    }
}



////**** COMMANDERS //// */

let black = {

    name: 'black',
    artwork: '/commanders/black.png',
    abilityArtwork: '/commanders/black_power.png',
    colors: ['black'],
    ability: { effect: 'reborn', amount: 1, triggerTiming: 'onPlay', cost: { from: 'mana', amount: 2 }, condition: 'index == 0', ownGraveyard: true, description: 'Pay  2 mana: Reborn the first unit in your graveyard' },
    type: 'commander',
    used: false,
    imgPath: '/cards/ades.png',
    lp: 27,
    hp: {
        current: 27,
        original: 27
    },
    cost: {
        current: 2,
        original: 2
    }

}

let white = {
    name: 'white',
    artwork: '/commanders/white.png',
    abilityArtwork: '/commanders/white_power.png',
    colors: ['white'],
    ability:
        { effect: 'drawAndGain', draw_amount: 1, triggerTiming: 'onPlay', cost: { from: 'mana', amount: 2 }, condition: null, gain_amount: 'card.cost.current', gain: true },

    type: 'commander',
    used: false,
    lp: 30,
    imgPath: '/cards/zeus.png',
    hp: {
        current: 30,
        original: 30
    },
    cost: {
        current: 2,
        original: 2
    }
}

let green = {
    name: 'green',
    artwork: '/commanders/green.png',
    colors: ['green']
}


//** CARDS [UNITS] */

//** BLACK  */

let wolf = new unit({
    name: 'wolf',
    op: { original: 2, current: 2 },
    hp: { original: 1, current: 1 },
    imgPath: '/cards/wolf.png',
    cost: { original: 1, current: 1 },
    ability: null,
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: []
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
    ability: null,
    imgPath: '/cards/knight.png',
    cost: {
        original: 1,
        current: 1
    },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: []
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
    imgPath: '/cards/ogre.png',
    cost: {
        original: 2,
        current: 2
    },
    ability: { effect: 'modifyStat', amount: 1, selfTarget: true, triggerTiming: 'onPlay', buff: false, targetStat: 'hp', cost: null },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: []
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
    imgPath: '/cards/sorceress.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: { effect: 'discard', condition: null, triggerTiming: 'onPlay', cost: { from: 'hp', amount: 2 }, amount: 1 },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: []
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
    imgPath: '/cards/reaper.png',
    cost: {
        original: 4,
        current: 4
    },
    ability: { effect: 'targetKill', condition: "unit.cost.current <= 2", triggerTiming: 'onPlay', cost: null, target: true },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: []
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
    imgPath: '/cards/skeleton.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: { effect: 'draw', amount: 1, triggerTiming: 'onKilled', cost: null, target: false },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: []
});

let crow = new unit({
    name: 'crow',
    op: {
        original: 2,
        current: 2
    },
    hp: {
        original: 1,
        current: 1
    },
    imgPath: '/cards/crow.png',
    cost: {
        original: 2,
        current: 2
    },
    ability: null,
    status: 'none',
    canAttack: true,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: ['fly']
});


let golem = new unit({
    name: 'golem',
    op: {
        original: 1,
        current: 1
    },
    hp: {
        original: 4,
        current: 4
    },
    imgPath: '/cards/golem.png',
    cost: {
        original: 3,
        current: 3
    },
    ability: null,
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'black',
    attributes: ['guardian']
});

//WHTE

let crusader = new unit({
    name: 'crusader',
    op: {
        original: 1,
        current: 1
    },
    hp: {
        original: 2,
        current: 2
    },
    imgPath: '/cards/crusader.png',
    cost: {
        original: 1,
        current: 1
    },
    status: 'none',
    canAttack: false,
    type: 'unit',
    ability: { effect: 'modifyLp', amount: 2, triggerTiming: 'onKilled', cost: null, target: false, gain: true, condition: null },
    playerOwned: false,
    color: 'white',
    attributes: [],
    killed: false
})

let peacekeeper = new unit({
    name: 'peacekeeper',
    op: {
        original: 3,
        current: 3
    },
    hp: {
        original: 5,
        current: 5
    },
    imgPath: '/cards/peacekeeper.png',
    cost: {
        original: 4,
        current: 4
    },
    ability: null,
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'white',
    attributes: ['guardian']
});

let pegasus = new unit({
    name: 'pegasus',
    op: {
        original: 2,
        current: 2
    },
    hp: {
        original: 4,
        current: 4
    },
    imgPath: '/cards/pegasus.png',
    cost: {
        original: 3,
        current: 3
    },
    ability: null,
    status: 'none',
    canAttack: true,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'white',
    attributes: ['fly']
});

let joyce = new unit({
    name: 'joyce',
    op: {
        original: 1,
        current: 1
    },
    hp: {
        original: 1,
        current: 1
    },
    imgPath: '/cards/joyce.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: { effect: 'modifyLp', condition: null, triggerTiming: 'onPlay', cost: null, amount: 3, gain: true },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'white',
    attributes: []
});

let leonidas = new unit({
    name: 'leonidas',
    op: {
        original: 5,
        current: 5
    },
    hp: {
        original: 7,
        current: 7
    },
    imgPath: '/cards/leonidas.png',
    cost: {
        original: 6,
        current: 6
    },
    ability: { effect: 'modifyStat', condition: "player.lp > 30", triggerTiming: 'onPlay', cost: null, amount: 5, selfTarget: true, buff: true, targetStat: 'op' },
    status: 'none',
    canAttack: false,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: 'white',
    attributes: []
});

//COLORLESS

let landless_dragon = new unit({
    name: 'landless_dragon',
    op: {
        original: 5,
        current: 5
    },
    hp: {
        original: 5,
        current: 5
    },
    imgPath: '/cards/landless_dragon.png',
    cost: {
        original: 5,
        current: 5
    },
    ability: null,
    status: 'none',
    canAttack: true,
    type: 'unit',
    killed: false,
    playerOwned: false,
    color: null,
    attributes: ['fly']
});

//*** CARDS [SPELLS] */

let inner_fear = new gameCard({
    name: 'Inner Fear',
    imgPath: '/cards/inner_fear.png',
    cost: {
        original: 1,
        current: 1
    },
    ability: { effect: 'modifyStat', amount: 2, selfTarget: false, triggerTiming: 'onPlay', buff: false, targetStat: 'hp', cost: null, condition: null, target: true },
    type: 'spell',
    playerOwned: false,
    color: 'black'
})

let pot_of_malice = new gameCard({
    name: 'Pot of Malice',
    imgPath: '/cards/pot_of_malice.png',
    cost: {
        original: 2,
        current: 2
    },
    ability: { effect: 'draw', amount: 2 },
    type: 'spell',
    playerOwned: false,
    color: null
})

let blessing = new gameCard({
    name: 'Elijahs Blessing',
    imgPath: '/cards/blessing.png',
    cost: {
        original: 2,
        current: 2
    },
    ability: { effect: 'healAll', cost: null, condition: null },
    type: 'spell',
    playerOwned: false,
    color: 'white'
})

let brain_control = new gameCard({
    name: 'Pot of Malice',
    imgPath: '/cards/brain_control.png',
    cost: {
        original: 3,
        current: 3
    },
    ability: { effect: 'steal', amount: 1, target: true, triggerTiming: 'onPlay', cost: null },
    type: 'spell',
    playerOwned: false,
    color: 'black'
})

let called_from_grave = new gameCard({
    name: 'Called from the grave',
    imgPath: '/cards/called_from_grave.png',
    cost: {
        original: 3,
        current: 3
    },
    ability: { effect: 'reborn', amount: 1, triggerTiming: 'onPlay', cost: null, condition: 'index == graveyard.length - 1', ownGraveyard: true },
    type: 'spell',
    playerOwned: false,
    color: null
})

//*** CARDS [TRAPS] */

let dimensional_gate = new gameCard({
    name: 'Dimensional gate',
    imgPath: '/cards/dimensional_gate.png',
    cost: {
        original: 2,
        current: 2
    },
    ability: { effect: 'kill', amount: 1, target: false, triggerTiming: 'onAttack', cost: null },
    type: 'trap',
    playerOwned: false,
    color: null
})

let trap_hole = new gameCard({
    name: 'Trap Hole',
    imgPath: '/cards/trap_hole.png',
    cost: {
        original: 2,
        current: 2
    },
    ability: { effect: 'kill', amount: 1, target: false, triggerTiming: 'onSummon', cost: null, condition: "trapTarget.op.current <= 2" },
    type: 'trap',
    playerOwned: false,
    color: null
})

export const allCards = [crusader, pegasus, blessing, leonidas, joyce, peacekeeper, wolf, crow, ogre, knight, called_from_grave, reaper, sorceress, skeleton, golem, trap_hole, dimensional_gate, pot_of_malice, inner_fear, blessing, brain_control]
export const allCommanders = [black, white]
export const welcomePack = [black, white, landless_dragon, crusader, pegasus, joyce, peacekeeper, wolf, crow, knight, ogre, pot_of_malice, trap_hole, dimensional_gate]






