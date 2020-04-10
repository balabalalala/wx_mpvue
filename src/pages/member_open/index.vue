<template>
<form :class="{ipx: isIPX}" @click="onclick" report-submit='true' @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div class="member-content">
            <!-- 会员权益 -->
            <div class="member-rights">
                <img v-if="selectedCard.type === 5" class="member-bgimg" src="https://img-ali.xiaohongchun.com.cn/admin/15620687031811c7f6860.png"/>
                <img v-else class="member-bgimg" src="https://img-ali.xiaohongchun.com.cn/admin/1548224074234177f8ea7.png"/>
                <div class="member-right-icon">
                    <member-right :horizontal=false :memberLevel=-1 :fullBG="(this.selectedCard.type === 5 || this.selectedCard.type === 9) ? false : true"> </member-right>
                </div>
            </div>
            <!-- 会员卡 -->
            <div class="member-card-list">
                <ul>
                    <li class="member-card" :class="card.id === selectId ? 'selected' : ''" v-for="card in cards" :key="card.id" @click="selectId = card.id">
                        <div class="card-desc">
                            <b class="desc-name">{{ card.name }}</b>
                            <p class="desc-experience" v-if="card.type == 7">仅限体验 1 次</p>
                        </div>
                        <div class="card-price">
                            <b class="peice-current">{{ card.current_price / 100 }}元</b>
                            <del class="peice-del">{{ card.original_price / 100 }}元</del>
                            <p class="peice-sale" v-if="card.id == selectId && card.original_price > 0">已优惠{{ (card.original_price - card.current_price) / 100 }}元</p>
                        </div>
                        <!-- checkbox图标 -->
                        <i></i>
                    </li>
                </ul>
            </div>
            <!-- 开通会员 -->
            <div class="member-pay">
                <button data-name="member-pay" formType="submit" @click="toPay" class="gold-bg-btn pay-btn" hover-class="none">立即支付</button>
                <p @click="toIntro">开通即视为同意《天天会员说明》</p>
            </div>
            <!-- 成功弹窗 -->
            <success-modal v-if="showSuccessModal" :img="successImg" :orderParams="orderParams"></success-modal>
        </div>
    </button>
</form>
</template>

<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
