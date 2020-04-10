<template>
    <form report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container">
                <div class="card form">
                    <ul>
                        <li>
                            <label>收货人</label>
                            <input v-model.trim="addressInfo.user_name" placeholder-class="address-edit-input" placeholder="请填写真实姓名" />
                        </li>
                        <li>
                            <label>手机号码</label>
                            <input v-model.trim="addressInfo.tel_number" type="number" placeholder-class="address-edit-input" placeholder="11位手机号码" />
                        </li>
                        <li>
                            <label>选择地区</label>
                            <picker class="region-picker" mode="region" @change="region = $event.mp.detail.value" v-model="region">
                                {{regionStr}}
                            </picker>
                        </li>
                        <li>
                            <label>详细地址</label>
                            <input v-model.trim="addressInfo.detail_info" placeholder-class="address-edit-input" placeholder="街道门牌信息" />
                        </li>
                        <li>
                            <label>邮政编码</label>
                            <input v-model.trim="addressInfo.postal_code" placeholder-class="address-edit-input" placeholder="非必填" />
                        </li>
                    </ul>
                </div>

                <div class="card">
                    <labels @input="current=$event" :current="current" :labels="labels"></labels>
                </div>

                <div class="card default-address">
                    设为默认地址

                    <switch @change="addressInfo.is_primary=$event.mp.detail.value ? 1 : 0" :checked="addressInfo.is_primary" color="##dc3538" />
                </div>

                <button @click="save" class="save-btn" hover-class="none">保存</button>
            </div>

            <toast />
        </button>
    </form>
</template>

<script src="./script.js"></script>

<style>
.address-edit-input {
    color: #ccc;
    line-height: 34rpx;
}
</style>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
<style src="@/style/common.css"></style>
<style src="@/style/btns.css"></style>

