<template>
    <div class="container" v-if="order.diff_status != 0 && order.diff_status != null">
        <div class="item emp">
            <p class="label" v-if="(order.status == 3 || order.status==4) && order.diff_status ==1">待补差价</p>
            <p class="label" v-if="(order.status == 10 || order.status == 6 ||order.status == 0)&& order.diff_status ==1">未补差价</p>
            <p class="label" v-if="order.diff_status == 3 || order.diff_status == 2">已补差价</p>
            <p class="content">¥{{order.user_diff_price / 100}}</p>
        </div>
        <div class="item reason-box">
            <p class="label">补差价原因：</p>
            <p class="content reason">{{order.user_diff_reason}}</p>
        </div>
        <div class="item pic">
            <p class="label">截图凭证 </p>
            <image  class="img" :src="order.user_diff_image" @click="previewImage"></image>
            <p class="click" @click="previewImage">点击查看更多</p>
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
            order: state => _.pick(state.order, 'status', 'diff_status', 'user_diff_price', 'user_diff_reason', 'user_diff_image')
        })
    },
    methods: {
        previewImage(event) {
            wx.previewImage({
                urls: [this.order.user_diff_image]
            })
        },
  }
}
</script>

<style scoped>
.container{
    background: #fff;
    font-size: 28rpx;
    box-sizing: border-box;
    padding-left: 40rpx;
    font-size: 28rpx;
}
.item{
    position: relative;
    border-bottom: 1rpx solid #F1F1F1;
    padding: 28rpx 32rpx 28rpx 0;
    display: flex;
}
.label{
    text-align: left;
    font-size: 28rpx;
    font-weight: 600;
}
.pic .label {
    margin-right: 28rpx;
}
.emp{
    justify-content: space-between;
    color: #dc3538;
}
.content{
    font-size: 26rpx;
}
.reason-box{
    padding: 28rpx 32rpx 28rpx 0;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
}
.reason{
    line-height: 35rpx;
    width: 500rpx;
}
.img{
    width:320rpx;
    height:170rpx;
    vertical-align: middle;
}
.click{
    position: absolute;
    top:80rpx;
    left:235rpx;
    font-size: 24rpx;
    color:#4c4c4c;
}

</style>
