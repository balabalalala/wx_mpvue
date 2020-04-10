<template>
    <form report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container" :class="idcards.length ? 'dark-bg' : ''">

                <ul v-if="idcards.length" class="idcard-list">
                    <li @click="change(idcard.id)" :key="idcard.id" v-for="idcard in idcards" class="card">
                        <h2> {{idcard.name}} </h2>

                        <p>{{ idcard.card_id }}</p>

                        <div class="actions">
                            <template v-if="refer!=='mine'">
                                <radio :checked="idcard.id == current" color="red" :value="idcard.id" /> 选择此身份证
                            </template>

                            <button @click.stop="del(idcard.id)" class="del">删除</button>
                            <button @click.stop="edit(idcard)" class="edit">编辑</button>
                        </div>
                    </li>
                </ul>

                <p v-if="!idcards.length && refer !== 'mine'" class="note">应海关要求，您购买的商品需要添加身份证信息。 为了帮您及时买到心仪商品，请尽快上传。</p>

                <footer :class="footerClass">
                    <img v-if="!idcards.length" @click="toAdd" src="https://img-ali.xiaohongchun.com.cn/admin/15706767023542fc8d128.png" style="width:460rpx;height:460rpx">
                    <!-- <button @click="toAdd" class="btn btn-red no-btn-red"></button> -->
                    <button v-else @click="toAdd" class="btn btn-red">+ 添加身份证</button>
                </footer>

                <div v-if="refer!=='mine'" @click="laterUpload" :class="idcards.length ? '' : 'tac'" class="later-upload">
                    <radio color="red" :checked="later" /> 身份证不在身边？稍后上传身份证
                </div>

                <div v-if="idcards.length" class="footer-box"></div>
            </div>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="@/style/common.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="./style.css" scoped></style>
