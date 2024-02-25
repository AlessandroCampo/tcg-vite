<template>
    <img src="../../assets/img/cardback.png" alt="" ref="facedown_card" class="card-base">
</template>

<script>

import gsap from 'gsap'

export default {
    mounted() {
        let el = this.$refs.facedown_card
        gsap.to(el, {
            width: 150 + 'px',
            height: 220 + 'px',
            duration: 1,
        })
    }
}
</script>

<style lang="scss" scoped>
img {
    width: 0px;
    height: 0px;
}
</style>