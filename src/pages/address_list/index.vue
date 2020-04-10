<template>
    <form report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div :class="addresses.length ? 'container':'container container2'">
                <ul class="addresses">
                    <li @click="change(address.id)" :key="address.id" v-for="address in addresses" class="card">
                        <h2>
                            {{address.user_name}}  {{address.tel_number}}

                            <span class="label-btn label-btn-active" v-if="address.tag">{{address.tag}}</span>
                            <span class="label-btn label-btn-default" v-if="address.is_primary">默认</span>
                        </h2>

                        <p>{{ address.province_name }}  {{ address.city_name }} {{ address.county_name || '' }} {{ address.detail_info }}</p>

                        <div class="actions">
                            <template v-if="refer !== 'mine'">
                                <radio :checked="address.id == current" color="red" :value="address.id" /> 选择此地址
                            </template>

                            <button @click.stop="del(address.id)" class="del">删除</button>
                            <button @click.stop="edit(address)" class="edit">编辑</button>
                        </div>
                    </li>
                </ul>

                <div class="address-empty" v-if="!addresses.length">
                    <img style="width:460rpx" src="https://img-ali.xiaohongchun.com.cn/admin/1570866411590cc38cfb.png" alt="">
                </div>

                <div class="footer-box">
                    <footer :class="addresses.length ? 'footer-fixed' : ''" :style="ipx ? 'padding-bottom:50rpx' : ''">
                        <button @click="chooseAddress" class="btn btn-green">使用微信地址</button>
                        <button @click="add" class="btn btn-red">添加新地址</button>
                    </footer>
                </div>

            </div>

            <toast />
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="@/style/common.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="./style.css" scoped></style>
