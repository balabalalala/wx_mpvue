<template>
<form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div class="confirm-container">
            <save-money v-if="disclosure.economy_price" />
            <div class="marginTop">
                <address-info />
                <id-card v-if="disclosure.need_idcard"/>
            </div>
            <div class="marginTop">
                <disclosure />
            </div>
            <div class="marginTop">
                <member v-if="memberComponentShow && memberStatus != 2" :asn="asn" />
            </div>
            <div class="marginTop">
                <discount @showServiceFeeDialog="showServiceFeeDialog = true" />
            </div>
            <div class="marginTop">
                <remark />
            </div>
            <confirm-bottom @submitInfoToPay="checkoutInfo" />
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
        <!-- 客服 -->
        <button
            class="customer-service-container"
            open-type="contact"
            :session-from="'orderDetail_' + sn"
            :send-message-title="shareTitle"
            :send-message-path="sendMessagePath"
            :send-message-img="disclosure.image_url"
            :show-message-card="true"
            >客服</button>
         <!-- 会员提示 -->
        <member-tip
            v-if="memberTipShow"
            @toBuyMember="toBuyMember"
            @closeMemberTip="closeMemberTip"
            @noMoreMemberTip="noMoreMemberTip"
            ></member-tip>
        <toast />
    </button>
</form>
</template>

<script src="./script.js"></script>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="./style.css" scoped></style>
<style src="@/common/style/common.css"></style>
