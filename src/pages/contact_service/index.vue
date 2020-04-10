<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container">
                <img class="tip-img" src="https://img-ali.xiaohongchun.com.cn/admin/1541647074455382842b0.png" />
                <ul class="service-content" v-if="connectionInfo && connectionInfo.connectionTime">
                    <li class="phone-service">
                        <div class="service-title">电话客服</div>
                        <p class="service-tip">{{connectionInfo.connectionTime.online}}</p>
                        <p class="service-tip">{{connectionInfo.tip}}</p>
                        <div data-name="call_CSD" class="phone-content" @click="callPhone">
                            <img data-name="call_CSD" class="phone-icon" src="https://img-ali.xiaohongchun.com.cn/admin/15416485696652b275722.png" />
                            <p data-name="call_CSD" class="phone-number">拨打客服热线 400-050-0565</p>
                        </div>
                    </li>
                    <li class="online-service">
                        <div class="service-title">在线客服</div>
                        <!-- <p class="service-tip">{{connectionInfo.connectionTime.weixin}}</p> -->
                        <p class="service-tip">周一到周日 9:00-18:00</p>
                        <button data-name="connect_CSD" class="online-btn" open-type="contact">连线客服天天君</button>
                    </li>
                </ul>
                <p class="agreement">
                    <i @click="jump('/protocol/user')">《用户协议》</i>
                    <i @click="jump('/protocol/privacy')">《隐私政策》</i>
                </p>

            </div>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
