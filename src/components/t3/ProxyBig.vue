<template>
    <div class="card-base" :style="{ 'background-image': 'url(' + 'img/' + propCard.imgPath + ')' }" ref="card-big"
        :class="[]">
        <span class="cost stat"> {{ propCard.cost.current
            }}
        </span>
        <span class="op stat" v-if="propCard.type == 'unit'"> {{ propCard?.op.current }}
        </span>
        <span class="hp stat" v-if="propCard.type == 'unit'"> {{ propCard?.hp.current }}
        </span>
        <img src="../../assets/img/animations/sleep.gif" alt="" class="animation"
            v-if="propCard.status === 'onField' && !propCard.canAttack">
    </div>
</template>

<script>

import gsap from 'gsap'

export default {
    props: ['propCard'],
    mounted() {
        gsap.to(this.$el, {
            width: 350
        })
    }

}
</script>

<style lang="scss" scoped>
.card-base {
    width: 0px;
    aspect-ratio: 1/2;
    overflow: hidden;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
    z-index: 10;
    transform-style: preserve-3d;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 5%;
}
</style>