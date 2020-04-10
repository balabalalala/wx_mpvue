<template>
    <div class="disclosure-container" @click="closeDisclosureTip">
        <div class="disclosure-content">
            <div class="disclosure-title">{{disclosureTipParams.title}}</div>
            <div data-name="sale_tip_off_yes" class="top-btn" @click="topBtnHandle">{{disclosureTipParams.topBtn}}</div>
            <div data-name="sale_tip_off_no" class="bottom-btn" @click="bottomBtnHandle">{{disclosureTipParams.bottomBtn}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['disclosureTipParams'],
    methods: {
        closeDisclosureTip() {
            this.$emit("closeDisclosureTip")
        },
        topBtnHandle() {
            this.$emit("topBtnHandle", this.disclosureTipParams)
        },
        bottomBtnHandle() {
            this.$emit("bottomBtnHandle")
        }
    }
}
</script>
<style scoped>
.disclosure-container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 31;
}
.disclosure-content{
    position: fixed;
    width: 640rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: white;
    box-sizing: border-box;
    padding: 100rpx 48rpx 80rpx;
    border-radius: 10rpx;
}
.disclosure-title{
    line-height: 38rpx;
    font-size: 30rpx;
    font-weight: 400;
    text-align: center;
    color:rgba(34,34,34,1);
}
.top-btn{
    width: 233rpx;
    text-align: center;
    line-height: 58rpx;
    background:rgba(255,255,255,1);
    border: 2rpx solid rgba(204, 204, 204, 1);
    border-radius: 30rpx;
    font-size: 28rpx;
    color:rgba(128,128,128,1);
    margin: 48rpx auto 0;
}
.bottom-btn{
    width: 233rpx;
    text-align: center;
    line-height: 60rpx;
    background: linear-gradient(0deg,rgba(252,36,52,1),rgba(255,92,83,1),rgba(255,112,112,1));
    box-shadow: 0 10rpx 21rpx 0 rgba(198,41,46,0.22);
    border-radius: 30rpx;
    font-size: 30rpx;
    font-weight: 500;
    color:rgba(255,255,255,1);
    margin: 20rpx auto 0;
}
</style>
