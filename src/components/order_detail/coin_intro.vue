<template>
    <div class="diff-coin-content">
        <div class="diff-coin-intro-shadow"></div>
        <div class="diff-coin-intro-area">
            <div class="diff-coin-intro">
                <p class="title">退金币规则</p>
                <p class="intro">有时候买手会因商品降价、个人账号优惠等原因以更低的价格下单，那么省下的金额将会全额返还给您。</p>
                <p class="intro">您确认收货后，差价将会以金币形式退到您的账户中，金币可在下次消费时抵现哦。</p>
                <p class="intro">以金币形式退给您的差价在订单取消时需要先返还给平台。</p>
                <p class="intro">若在差价返还前，您的账户金币足够，在扣除相应金币后订单金额将全额退款。</p>
                <p class="intro">若在差价返还前，您的账户金币不足，将会在您的订单退款里扣除与金币不足部分等额的现金。</p>
                <p class="intro">详情请在【我的-金币-金币记录】中查看。</p>
            </div>
            <image @click="closeDiffIntro" class="close-diff-intro" src="https://img-ali.xiaohongchun.com.cn/admin/15343143848035affd58.png"></image>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeDiffIntro(event) {
            this.$emit("closeDiffIntro", false)
        }
    }
}
</script>

<style scoped>
.diff-coin-intro-shadow{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #a7a7a7;
    opacity:0.3;
    z-index: 8;
}
.diff-coin-intro-area{
    width: 530rpx;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
}
.diff-coin-intro{
    border-radius: 20rpx;
    background: #fff;
    padding: 69rpx 40rpx 30rpx;
}
.diff-coin-intro .title{
    line-height: 30rpx;
    font-size: 30rpx;
    color: #222;
    font-weight: 500;
    text-align: center;
    margin-bottom: 20rpx;
}
.diff-coin-intro .intro{
    margin-top: 8rpx;
    font-size:28rpx;
    color:#4c4c4c;
    line-height:40rpx;
}
.close-diff-intro{
    display: block;
    margin:0 auto;
    margin-top:16rpx;
    width: 64rpx;
    height: 64rpx;
}
</style>
