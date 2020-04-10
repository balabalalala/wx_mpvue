<template>
    <span v-if="show" @click="top" class="totop"></span>
</template>

<script>
    export default {
        props: {
            scrollTop: Number
        },
        data() {
            return {
                show: false
            }
        },
        watch:{
            scrollTop (newValue, oldValue) {
                if (newValue > 500) {
                    this.show = true
                } else {
                    this.show = false
                }
            }
        },
        methods: {
            top() {
                wx.pageScrollTo({
                    scrollTop: 0
                })
            }
        }
    }
</script>

<style scoped>
    .totop {
        position: fixed;
        width: 60rpx;
        height: 60rpx;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 50%;
        bottom: 60rpx;
        right: 54rpx;
        z-index: 5;
    }
    .totop::before {
        content: '';
        position: absolute;
        width: 20rpx;
        height: 20rpx;
        color: white;
        border-top: 1px solid;
        border-left: 1px solid;
        left: 50%;
        top: 50%;
        transform-origin: center;
        transform: translate(-50%, -30%) rotate(45deg);
        -webkit-transform: translate(-50%, -30%) rotate(45deg);
    }
</style>
