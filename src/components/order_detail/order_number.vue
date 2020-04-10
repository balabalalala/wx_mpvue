<template>
    <div class="order_number">
        <!-- <div class="order_number_content" :style="order.express_no && order.express_compony ? 'border-top: 1rpx solid #e5e5e5;' : ''"> -->
            <p class="order_number_info">订单编号</p>
            <p class="order_number_sn">{{order.sn}}</p>
        <!-- </div> -->
    </div> 
</template>

<script>
import _ from 'underscore' 
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'sn', 'express_no', 'express_compony')
        })
    }
}
</script>

<style scoped>
.order_number{
    line-height: 90rpx;
    padding-left: 35rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
}
.order_number_info{
    font-size: 28rpx;
    font-weight: 500;
    color: #222;
}
.order_number_sn{
    color: #4c4c4c;
    font-size: 26rpx;
    margin-left: 20rpx;
}
</style>