<template>
    <view data-name="o_alert_inner_group_close" class="mask" @click="fishAlertHide">
        <view>
            <view data-name="o_alert_inner_group_close" class="buyer">欢迎成为第 {{chopper}} 位天天剁手党！</view>
            <image data-name="o_alert_inner_group_close" class="member-modal-image" style="width: 684rpx; height: 864rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/15446944727333501dfd8.png"/>
            <view data-name="o_alert_inner_group_close" class="member-modal-close" style="bottom: 8%;">×</view>
            <button data-name="o_alert_inner_group" open-type="contact" session-from="pay_success">前往加群</button>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        chopper: {
            type: Number,
            default: 0
        }
    },
    methods: {
        fishAlertHide() {
            this.$emit("fishAlertHide", false)
        }
    }
    
}
</script>

<style src="../../common/style/common.css"></style>
<style scoped>
.buyer{
    width: 100%;
    text-align: center;
    line-height: 33rpx; 
    font-size: 34rpx; 
    color: #222;
    position: absolute;
    top: 21%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}
button{
    position: absolute;
    bottom: 22%;
    left: 50%;
    transform: translateX(-50%);
    width: 210rpx;
    text-align: center;
    line-height: 58rpx;
    border-radius: 28rpx;
    font-size: 30rpx;
    color:#fff;
    background: linear-gradient(to right, #fd9e66, #ea695e);
    box-shadow: #ea695e 0 2rpx 10rpx;
    overflow: hidden;
}
button::after{
    content: '';
    position: absolute;
    top: -4rpx;
    left: 60rpx;
    width: 12rpx;
    height: 80rpx;
    background: #fff;
    opacity: 0.4;
    transform: rotate(42deg);
}
</style>
