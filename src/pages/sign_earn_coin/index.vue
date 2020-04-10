<template>
<form report-submit='true' @click="onclick" @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div class="sign-in-activity">
            <img src="https://img-ali.xiaohongchun.com.cn/admin/15668968156912ef32dc9.jpg" alt="" class="banner">
            <div class="activity-guide">
                <button
                open-type="contact"
                @click="showFocus=false"
                session-from="sign_earn_coin"
                slot="footer"
                class="same-share-btn"
                send-message-title="点击下方消息下载App"
                :send-message-path="contactMsgPath"
                send-message-img="https://img-ali.xiaohongchun.com.cn/admin/15509095856652608cf5b.png"
                show-message-card="true"
                data-name="activity_pick_up"
                >马上去签到
                </button>
            </div>
            <to-index></to-index>
        </div>
    </button>
</form>
</template>
<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
<style src="@/style/btns.css"></style>
