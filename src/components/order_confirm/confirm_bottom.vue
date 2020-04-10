<template>
<div>
    <div class="bottom-container">
        <div class="bottom-total"><span>{{order.type == 8 ? '快递费:' : '合计金额:'}}</span><span class="price">¥{{computedPrice}}</span></div>
        <form data-name="pay" report-submit="true" @submit="toPay">
            <button 
                class="bottom-submit"
                data-name="pay"
                id="orderDetailPay"
                formType="submit"
                >提交订单</button>
        </form>
    </div>
    <div v-if="isIPX" class="fit"></div>
</div>
</template>

<script>
import _ from 'underscore'
import mixin from '../../mixin/mixin'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('orderConfirm')
export default {
    mixins: [mixin],
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'real_price', 'type')
        }),
        computedPrice () {
            return (this.order.real_price / 100).toFixed(2)
        }
    },
    methods: {
        toPay (e) {
            let formId = e.mp.detail.formId
            this.$emit('submitInfoToPay', formId)
        }
    }
}
</script>



<style scoped>
button::after {
    width: 0;
    height: 0;
    border: 0;
    background: none;
}
button::after{
    border:unset;
}
.bottom-container {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 99rpx;
    padding-left: 39rpx;
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    background-color: #fff;
    z-index: 2;
}
.bottom-submit {
    width: 230rpx;
    height: 99rpx;
    line-height: 99rpx;
    background: #dc3538;
    border-radius: 0;
    text-align: center;
    font-size: 31rpx;
    color: #fff;
}
.bottom-total {
    font-size: 30rpx;
    font-weight: bold;
    color: rgba(76,76,76,1);
    line-height: 88rpx;
}
.ipx .bottom-container{
    bottom: 60rpx;
}
.ipx .bottom-submit {
    width: 220rpx;
    height: 80rpx;
    line-height: 80rpx;
}
.fit {
    width: 100%;
    height: 60rpx;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 2;
}
.price {
    display: inline-block;
    margin-left: 16rpx;
    font-size: 36rpx;
    color: #dc3538;
}
</style>
