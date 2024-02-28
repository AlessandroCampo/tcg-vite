import { useGeneralStore } from "./generalStore";
import gsap from 'gsap'

// const generalStore = useGeneralStore()

export const abilities = {
    increaseOp: (card) => {
        card.op.current++;
    },
    reduceHpBy2: (target) => {
        target.hp.current -= 2;
    },
    pay2Discard1: (card) => {
        let oppoHand = useGeneralStore().$state.opponent.hand
        let randomOppoHandCardIndex = Math.floor(Math.random() * oppoHand.length);
        useGeneralStore().$state.player.lp -= 2;
        oppoHand.splice(randomOppoHandCardIndex, 1)
    },
    targetKillCost2OrLess: () => {
        let oppoField = useGeneralStore().$state.opponent.field;
        oppoField.forEach((unit) => {
            if (unit.cost.current < 2) {
                const proxy = document.getElementById(unit.id);
                proxy.style.cursor = 'pointer';
                useGeneralStore().$state.freeze = true;

                // Cancel any existing tweens on the proxy
                gsap.killTweensOf(proxy);

                // Reset brightness and scale to initial values
                gsap.set(proxy, {
                    scale: 1,
                    filter: "brightness(1)"
                });

                // Apply new tween
                gsap.to(proxy, {
                    scale: 1.1,
                    filter: "brightness(1.2)",
                    repeat: -1,
                    yoyo: true
                });

                const handleClick = (e) => {
                    useGeneralStore().$state.freeze = false;
                    oppoField.splice(oppoField.indexOf(unit), 1);
                    useGeneralStore().updateBothDb();

                    const oppoFieldProxies = document.querySelectorAll(('#oppoField .card-base'))
                    oppoFieldProxies.forEach((el) => {
                        gsap.killTweensOf(el);
                        gsap.set(el, {
                            scale: 1,
                            filter: el.classList.contains('disabled') ? "grayscale(70%)" : "brightness(1.0)"
                        });
                        el.removeEventListener('click', handleClick);
                    });
                };

                proxy.addEventListener('click', handleClick);
            }
        });
    }




};


