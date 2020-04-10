<template>
    <div class="logistics-container" @click="checktrans">
        <div class="logistics-item" >
            <p class="info">物流公司</p>
            <p class="fee">{{order.express_compony}}</p>
        </div>
        <div class="logistics-item">
            <p class="info">物流单号</p>
            <p class="fee">{{order.express_no}}</p>
        </div>
        <image class="go" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/MythreeActiveIcon.png" @click="checktrans"></image>
    </div>
</template>

<script>
import _ from 'underscore' 
import jump from '../../common/lib/jump'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'express_compony', 'express_no', 'sn')
        })
    },
    methods: {
        checktrans() {
            jump.navigateTo('order_logistics', {sn: this.order.sn})
        }
    }
}
</script>

<style scoped>
.logistics-container {
    height: 160rpx;
    width: 750rpx;
    font-size: 25rpx;
    box-sizing: border-box;
    background-color: #fff;
    padding: 15rpx 35rpx;
    position: relative;
}
.logistics-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 35rpx;
    right: 0;
    height: 2rpx;
    background-color: #F1F1F1;
}
.logistics-item {
    height: 50rpx;
    width: 715rpx;
    line-height: 90rpx;
    box-sizing: border-box;
    position: relative;
}
.logistics-item p {
    display: inline-block;
}
.info {
    font-size: 28rpx;
    font-weight: bolder;
    color:#222222;
}
.fee {
    margin-left: 20rpx;
    color:#4c4c4c;
    font-size: 26rpx;
}
.go { 
    position: absolute;
    height: 30rpx;
    width: 20rpx;
    right:35rpx;
    top: 60rpx;
}
</style>
