<template>
    <form report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container dark-bg">
                <div class="white-bg ovh">
                    <div class="box">
                        <div class="column idcard" v-if='!isEncrypt'>
                            <div @click="upload('positive')" class="item" data-desc="正面">
                                <template v-if="!positive">
                                    <span>+</span>
                                    <b>上传身份证正面</b>
                                </template>
                                <template v-else>
                                    <img @click.stop :src="positive">
                                    <i @click.stop="positive=''" class="close"></i>
                                </template>
                            </div>
                            <div @click="upload('negative')" class="item" data-desc="反面">
                                <template v-if="!negative">
                                    <span>+</span>
                                    <b>上传身份证反面</b>
                                </template>
                                <template v-else>
                                    <img @click.stop :src="negative">
                                    <i @click.stop="negative=''" class="close"></i>
                                </template>
                            </div>
                        </div>

                        <div class="column hadImg" v-else>
                            <p class="text">身份证已为您加密处理，如需修改，请重新上传</p>
                            <div class="btn" @click="reUploadImg">重新上传</div>
                        </div>

                        <div class="column example">
                            <div class="item">
                                <b>示例</b>
                                <img src="https://img-ali.xiaohongchun.com.cn/program-inline-images/id_card_example_up.png" />
                            </div>
                            <div class="item">
                                <b>示例</b>
                                <img src="https://img-ali.xiaohongchun.com.cn/program-inline-images/id_card_example_down.png" />
                            </div>
                        </div>
                    </div>

                    <p class="tip">温馨提示：请上传原始比例的身份证正反面，请勿裁剪涂改，保证身份信息清晰显示，否则无法通过审核。</p>
                </div>

                <div class="idcard-info white-bg">
                    <h2>身份信息</h2>
                    <input v-model.trim="name" type="text" placeholder="真实姓名" />
                    <input v-if="isEdit" :disabled="true" :value="encrypt"  type="text" placeholder="身份证号码" />
                    <input v-else v-model.trim="card_id" type="text" placeholder="身份证号码" />

                </div>

                <div class="note">
                    <h2>为什么要上传身份证？</h2>
                    <p>您买下的商品来自境外，按照我国海关规定，需要您提交身份证以备海关检查。</p>
                    <p>切记切记，<em>收件人姓名需与身份证保持一致</em>，否则海关欧巴不会放行，商品只能含恨离去啦。</p>
                </div>

                <footer class="white-bg">
                    <radio @click="agree=!agree" color="red" :checked="agree" />
                    <p>自愿上传身份证信息，身份证信息真实可靠，仅用于买手下单，海关清关使用。</p>
                    <button :class="{disabled: !valid}" @click="save">保存</button>
                </footer>
            </div>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="@/style/common.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="./style.css" scoped></style>
