<template>
    <div class="discount-container">
        <div class="discount-box" v-if="pageType == 2">
            <p>商品总价</p>
            <p class="discount-fee">¥ {{order.total_price / 100}}</p>
        </div>
        <div class="discount-box" @click="showDialog" v-if="servicePrice || order.service_fee">
            <div class="fee-left">
                <p>代买服务费</p>
                <p class="fee-tips">!</p>
                <p v-if="memberStatus == 2" class="member_icon"></p>
            </div>
            <p class="discount-fee" v-if="order.is_free == 0">{{servicePrice / 100 || order.service_fee/100}}元</p>
            <p class="discount-fee linethougth" v-else>{{(servicePrice / 100 || order.service_fee/100)}} 元</p>
        </div>
        <div class="discount-box" @click="toRedPacketPage" v-if="pageType == 1 || order.coupon_used">
            <p>红包</p>
            <p class="discount-redbag" v-if="!coupon && order.canuse_coupons">有{{order.canuse_coupons}}个红包可用</p>
            <p class="discount-redbag gray-color" v-if="!coupon && order.canuse_coupons == 0">暂无可用</p>
            <p class="discount-fee" v-if="!coupon && order.coupon_used > 0">-￥{{order.coupon_used / 100}}元</p>
            <p class="discount-redbag" v-if="useCoupon" >-￥{{coupon.amount / 100}}</p>
            <p v-if="noCoupon == -1" class="discount-redbag">暂不使用红包</p>
            <image v-if="pageType == 1" class="go" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/MythreeActiveIcon.png"></image>
        </div>
        <div class="discount-box" v-if="pageType == 1">
            <template v-if="score > 0">
                <p>本单可用{{score}}积分抵扣{{score / 100}}元</p>
                <switch-component @toggleSwitch="toggleSwitch" />
            </template>
           <template v-else>
                <p>满{{conversionCoin}}金币可抵现，您当前拥有{{totalCoin}}金币</p>
            </template>
        </div>
        <div class="discount-box" v-if="pageType == 2">
            <p>订单总价</p>
            <p class="discount-fee">
                <span v-if="order.pay_total == 0">￥ 0.00</span>
                <span v-if="order.pay_total > 0">￥{{order.pay_total / 100}}</span>
                <span v-if="order.coin_used"> + {{order.coin_used}} 金币</span>
                <span v-if="order.diff_status == 2 || order.diff_status == 3"> + {{order.diff_price / 100}} 差价</span>
            </p>
        </div>
    </div>
</template>

<script>
import _ from 'underscore'
import jump from '../../common/lib/jump'
import switchComponent from './switch'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('orderConfirm')
export default {
    components: {
        switchComponent  
    },
    computed: {
        ...mapState({
            score: state => state.useful_coin,
            totalCoin: state => state.total_coin,
            conversionCoin: state => state.conversion_coin,
            coupon: state => state.coupon,
            order: state => _.pick(state.order, 
                'sn', 'canuse_coupons', 'coupon_used', 'is_free',
                'service_charge', 'service_fee', 'diff_price',
                'diff_status', 'pay_total', 'coin_used', 'total_price'),
            noCoupon: state => state.noCoupon,
            pageType: state => state.pageType
        }),
        ...mapGetters(['memberStatus']),
        servicePrice () {
            return this.order.service_charge && this.order.service_charge.price
        },
        useCoupon () {
            return !_.isEmpty(this.coupon)
        }
    },
    methods: {
        ...mapMutations(['setPrice', 'setUseScore']),
        showDialog () {
            this.$emit('showServiceFeeDialog')
        },
        toRedPacketPage () {
            let params = {
                sn: this.order.sn,
                code: this.noCoupon
            }
            jump.navigateTo('order_red_packet', params)
        },
        toggleSwitch (useScore) {
            if (useScore) {
                this.setPrice(this.score)
                this.setUseScore(true)
            } else {    
                this.setPrice(-this.score)
                this.setUseScore(false)
            }
        }
    }
}
</script>

<style scoped>
.discount-container {
    padding: 5.5rpx 0 5.5rpx 37rpx;
    background-color: #fff;
}
.discount-box {
    height: 85rpx;
    padding-right: 33rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(34,34,34,1);
    position: relative;
}
.discount-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1rpx;
    background-color: #F1F1F1;
}
.discount-box:first-child::before {
    height: 0;
}
.discount-redbag {
    position: absolute;
    top: 50%;
    right: 75rpx;
    transform: translateY(-50%);
    font-size: 26rpx;
    font-family: PingFang-SC-Regular;
    color:#4c4c4c;
}
.gray-color {color:rgba(204,204,204,1);}
.go{
    height: 30rpx;
    width: 20rpx;
    position: absolute;
    right: 34rpx;
    top: 50%;
    transform: translateY(-50%);
}
.discount-fee{
    color: #4c4c4c;
    font-size: 26rpx;
}
.linethougth{
    text-decoration: line-through;
}
.fee-left {
    display: flex;
    align-items: center;
}
.member_icon{
    display: inline-block;
    width: 116rpx;
    height: 32rpx;
    margin-left: 15rpx;
    vertical-align: -5rpx;
    background-image: url(https://img-ali.xiaohongchun.com.cn/admin/15353397845518fc6e05.png);
    background-repeat: no-repeat;
    background-size: contain;
}
.fee-tips{
    display: inline-block;
    width: 24rpx;
    height: 24rpx;
    color: #838383;
    border: 1rpx solid;
    background:rgba(255,255,255,1);
    border-radius: 50%;
    text-align: center;
    line-height: 26rpx;
    margin-left: 6rpx;
}
</style>
