<template>
    <div class="diff-coin-area">
        <div class="diff-coin">
            <p v-if="(order.combin_status === 402 || order.combin_status === 403) && dStatus === 1" class="diff-coin-title">待退金币</p>
            <p 
                v-if="(order.combin_status === 503 || order.combin_status === 507 || order.combin_status === 509 || order.combin_status === 803 || order.combin_status === 807 || order.combin_status === 809) && dStatus === 2" 
                class="diff-coin-title"
                >
                已退金币
            </p>
            <p class="diff-coin-icon" @click="backpriceIntro">?</p>
            <p 
                v-if="(dStatus === 1 || dStatus === 2) && diffPrice < 0" 
                class="diff-coin-number"
                >
                {{-(diffPrice)}}金币
            </p>
        </div>
    </div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'combin_status', 'plate_form_diff_price_status'),
            dStatus: state => state.order.plate_form_diff_price_status,
            diffPrice: state => state.order.plate_form_diff_price
        })
    },
    methods: {
        backpriceIntro() {
            this.$emit("backpriceIntro", true)
        }
    }
}
</script>

<style scoped>
.diff-coin-area{
    padding: 20rpx 0 0;
    background: #f1f1f1;
}
.diff-coin{
    height: 86rpx;
    line-height: 86rpx;
    background: #fff;
    display: flex;
    align-items:center;
    padding: 0 40rpx;
}
.diff-coin-title{
    line-height: 28rpx;
    color: #222;
    font-size: 28rpx;
    font-weight: 500;
}
.diff-coin-icon{
    width: 24rpx;
    text-align: center;
    line-height: 24rpx;
    font-size:20rpx;
    font-weight: lighter;
    color:#4C4C4C;
    border: 1rpx solid #4C4C4C;
    border-radius: 50%;
    margin-left: 22rpx;
}
.diff-coin-number{
    line-height: 26rpx;
    color:#4C4C4C;
    font-size: 26rpx;
    margin-left:auto;
}
</style>
