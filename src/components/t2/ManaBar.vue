<template>
    <div class="mana-bar" :class="propMana?.current === 0 ? 'out-of-mana' : ''">
        <span>
            <img src="../../assets/img/mana.png" alt="">
            {{ propMana?.current > 0 ? propMana?.current : 'Out of mana' }}
        </span>
        <div class="mana-bar-inner" style="width: 100%;" ref="mana_bar">
            <!-- {{ propMana?.current > 0 ? propMana?.current : '' }} -->
        </div>
    </div>
</template>

<script>
import { useGeneralStore } from '../../stores/generalStore';
import gsap from 'gsap'

export default {
    data() {
        return {
            generalStore: useGeneralStore()
        }
    },
    props: ['propMana'],
    watch: {
        'propMana.current': function (newValue, oldValue) {
            let mana_bar = this.$refs.mana_bar;
            const percentage = (this.propMana.current / this.propMana.total) * 100;
            gsap.to(mana_bar, {
                width: percentage
            });
        }
    }


}
</script>

<style lang="scss" scoped>
.mana-bar {
    width: 150px;
    height: 30px;
    background-color: #f0f0f0;
    border-radius: 10px;
    border: 2px solid black;
    overflow: hidden;
    position: absolute;
    z-index: 3;

    span {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        color: black;
        font-weight: bold;
        font-size: 1.3em;

        img {
            width: 15%;
        }
    }
}

.out-of-mana {
    background-color: lightcoral;
    text-align: center;
    color: black;
}

.mana-bar-inner {
    height: 100%;
    background-color: cornflowerblue;
    transition: width 0.5s;
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 1.5em;

}

.mana-bar-inner.low {
    background-color: #FF5722;
    /* Color for low mana */
}

.mana-bar-inner.medium {
    background-color: #FFEB3B;
    /* Color for medium mana */
}

.mana-bar-inner.high {
    background-color: #2196F3;
    /* Color for high mana */
}
</style>