<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <ul class="container">
                <li class="old-people">
                    <div>
                        <img src="https://img-ali.xiaohongchun.com.cn/admin/15711247890042f0f5cde.png"/>
                        <b>支付成功</b>
                    </div>
                    <p>实付款：¥{{money}}</p>
                    <a class="btn-group">
                        <button data-name="paid_back_home" @click="backIndex">返回首页</button>
                        <button data-name="paid_show_order_detail" @click="toOrder">查看订单</button>
                    </a>
                </li>
                <li v-if="newPeople" class="new-people">
                    <strong>欢迎成为第 {{chopper}} 位天天剁手党！</strong>
                    <img src="https://img-ali.xiaohongchun.com.cn/admin/154467371060331ac8e2e.png" />
                    <button data-name="paid_inner_group" open-type="contact" session-from="pay_success">前往加群</button>
                </li>
                
            </ul>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
