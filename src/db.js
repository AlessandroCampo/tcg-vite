class gameCard {
    constructor({ name, op, hp, ability, description, imgPath, cost, triggerTiming }) {
        this.name = name
        this.op = op
        this.hp = hp
        this.ability = ability
        this.description = description
        this.imgPath = imgPath
        this.cost = cost
        this.triggerTiming = triggerTiming
    }
}



let wolf = new gameCard({
    name: 'wolf',
    op: 2,
    hp: 1,
    description: 'This card is a wolf',
    imgPath: './src/assets/img/cards/wolf.png',
    cost: 1,
    ability: function () {
        this.op++;
    },
    triggerTiming: 'onPlay'
});


let knight = new gameCard({
    name: 'knight',
    op: 1,
    hp: 2,
    description: 'This card  is a knight',
    ability: function () {
        this.hp++;
    },
    imgPath: './src/assets/img/cards/knight.png',
    cost: 1,
    triggerTiming: 'onPlay'
})

let ogre = new gameCard({
    name: 'ogre',
    op: 4,
    hp: 1,
    description: 'This card is an ogre',
    imgPath: './src/assets/img/cards/ogre.png',
    cost: 2,
    ability: null,
    triggerTiming: null
});

let sorceress = new gameCard({
    name: 'sorceress',
    op: 0,
    hp: 1,
    description: 'This card is an sorceress',
    imgPath: './src/assets/img/cards/sorceress.png',
    cost: 2,
    ability: null,
    triggerTiming: null
});

let reaper = new gameCard({
    name: 'reaper',
    op: 4,
    hp: 2,
    description: 'This card is an reaper',
    imgPath: './src/assets/img/cards/reaper.png',
    cost: 4,
    ability: null,
    triggerTiming: null
});

let skeleton = new gameCard({
    name: 'skeleton',
    op: 1,
    hp: 1,
    description: 'This card is an skeleton',
    imgPath: './src/assets/img/cards/skeleton.png',
    cost: 1,
    ability: null,
    triggerTiming: null
});

export const allCards = [wolf, knight, ogre, sorceress, skeleton, reaper]