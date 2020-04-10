<template>
    <div @click="toggleSwitch" :class="['switchWrap', useScore ? 'switchOn' : 'switchOff']">
        <p :class="['circle', useScore ? 'circleOn' : '']" ></p>
    </div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            realPrice: state => state.order.real_price,
            useScore: state => state.useScore
        }),
    },
    methods: {
        ...mapMutations(['setUseScore']),
        toggleSwitch () {
            this.setUseScore(!this.useScore)
            this.$emit('toggleSwitch', this.useScore)
        }
    }
}
</script>

<style scoped>
.switchWrap {
    position: absolute;
    top: 50%;
    right: 36rpx;
    transform: translateY(-50%);
    width: 60rpx;
    height: 30rpx;
    border-radius: 15rpx;
    border: 1px solid #e1e1e1;
    overflow: hidden;
    transition: background-color 300ms;
}
.switchOff {
    background-color: #ccc;
}
.switchOn {
    background-color: #dc3538;
}
.circle {
    width: 25rpx;
    height: 25rpx;
    border-radius: 100%;
    background-color: white;
    margin: 3rpx;
    transition: transform 300ms;
}
.circleOn {
    transform: translateX(30rpx);
}

</style>
