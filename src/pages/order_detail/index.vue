<template>
<form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div class="detail-container" :style="showRefundCoinTip || showStopTime ? 'padding-bottom: 180rpx;' : 'padding-bottom: 100rpx;'">
            <save-money v-if="order.economy_price" />
            <order-status />
            <logistics v-if="order.express_no && order.express_compony" />
            <order-number />
            <div class="margin-top">
                <address-info />
            </div>
            <div class="margin-top">
                <disclosure />
                <order-remark v-if="order.remark" />
            </div>
            <div class="margin-top">
                <discount @showServiceFeeDialog="showServiceFeeDialog = true" />
            </div>
            <div class="margin-top">
                <differ-price v-if="order.diff_status != 0 && order.diff_status != null" />
            </div>
            <div class="margin-top">
                <remark />
            </div>
            <order-bottom  @showPrelongModal="isShowPrelongModal = true"/>
            <differ-price-tip v-if="showDifferPriceTip" @backpriceIntro="showCoinIntro" />
            <stoptime v-if="showStopTime" :stoptime="order.user_diff_apply_time" :diff_price="order.user_diff_price/100" />
            <coin-intro v-if="coinIntroShow" @closeDiffIntro="showCoinIntro" />
            <div v-if="showRefundCoinTip" class="diff-price-area-fixed">待退金币 {{-(diffPrice)}} 金币</div>
            <div class="margin-top">
                <guess-like />
            </div>
        </div>
        <!-- 代买服务费弹窗 -->
        <modal
            v-if="showServiceFeeDialog"
            :show-cancel="false"
            :show-confirm="false"
            :width="'530rpx'"
            @maskClick="showServiceFeeDialog = false"
            >
            <div slot="body" class="modal-content">
                <p class="dialog-fee-title">什么是代买服务费</p>
                <p class="dialog-fee-text">1、代买服务费为订单金额的3%。代买服务费不足2元时，统一按2元收取。</p>
                <p class="dialog-fee-text">2、由天天跟我买平台取消的订单，代买服务费将全额退还给用户。若用户主动取消订单，代买服务费将不退还。</p>
            </div>
        </modal>
        <!-- 支付差价成功弹窗 -->
        <modal
            v-if="showPaySuccessModal"
            :show-cancel="false"
            :show-confirm="false"
            :width="'530rpx'"
            @maskClick="showPaySuccessModal = false"
            >
            <div slot="body" class="pay-success-modal-content">
                <image class="suc-icon" src="https://img-ali.xiaohongchun.com.cn/admin/157111315149720db9dbf.png"></image>
                <view class="t-title">{{payModalType ? "差价支付成功！" : "订单取消成功！"}}</view>
                <view class="b-title" v-if="payModalType">买手将即刻为您下单</view>
            </div>
        </modal>
        <!-- 延长收货弹窗 -->
        <prelong-time v-if="isShowPrelongModal" @hidePrelongModal="hidePrelongModal"/>
        <fish-group v-if="isFishOrder" @showFishAlert="showFishAlert"></fish-group>
        <fish-group-alert v-if="showFishGroupAlert" :chopper="order.rank" @fishAlertHide="showFishAlert"></fish-group-alert>
        <!-- 补差价 -->
        <stop-timer v-if="(order.status == 3 || order.status == 4) && order.diff_status == 1" :stoptime="stopDiffTime" :diff_price="diff_price"></stop-timer>
        <to-index />
    </button>
</form>
</template>


<script src="./script.js"></script>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style scoped>
.detail-container {
    background-color: rgba(249,249,249,1);
}
.ipx .detail-container {
    margin-bottom: 60rpx;
}
.margin-top {
    margin-top: 20rpx;
}
.dialog-fee-title {
    margin-bottom: 38rpx;
    font-size: 30rpx;
    color: #222;
}
.dialog-fee-text {
    margin-top: 20rpx;
    text-align: left;
    font-size: 26rpx;
    color: #4C4C4C;
}
.modal-content {
    padding: 1em;
}
.diff-price-area-fixed {
    line-height: 79rpx;
    background: #FFD8D8;
    color: #dc3538;
    font-size: 28rpx;
    text-align: right;
    padding-right: 36rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 100rpx;
    z-index: 2;
}
.ipx .diff-price-area-fixed {
    bottom: 160rpx;
}
.pay-success-modal-content {
    padding-top: 34rpx;
    padding-bottom: 58rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.pay-success-modal-content .suc-icon {
    width: 60rpx;
    height: 60rpx;
}
.pay-success-modal-content .t-title{
    line-height: 1;
    margin-top: 30rpx;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    color: #222;
}
.pay-success-modal-content .b-title{
    line-height: 1;
    font-size: 28rpx;
    color: #4C4C4C;
}
</style>
