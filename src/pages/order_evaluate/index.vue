<template>
    <form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container">
                <!-- 买手信息 -->
                <div v-if="sellerInfo" class="evaluate-buyer">
                    <img class="buyer-icon" :src="sellerInfo.icon">
                    <div class="buyer-info">
                        <p class="buyer-nick">{{sellerInfo.nick}}</p>
                        <div class="buyer-order">
                            <img class="buyer-vip" src="https://img-ali.xiaohongchun.com.cn/admin/15451114130821d014cc9.png">
                            <p class="buyer-star">{{buyerStar}}</p>
                            <p class="buyer-buy-count">{{sellerInfo.buy_count}}单</p>
                        </div>
                    </div>
                    <img class="buyer-phone" @click="phoneCallAction" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/threeNewWechat.png">
                </div>
                <!-- 商品信息 -->
                <div class="evaluate-goods">
                    <img class="goods-image" :src="orderInfo.img_url">
                    <div class="goods-info">
                        <p class="goods-title">{{orderInfo.title}}</p>
                        <p v-if="orderInfo.price" class="goods-price">{{orderInfo.price}}元</p>
                    </div>
                </div>
                <!-- 评价信息 -->
                <div class="evaluate-content">
                    <div class="evaluate-head">
                        <p class="evaluate-title">服务评价</p>
                        <img class="evaluate-star" 
                            v-for="(item, index) in goodStarNumber" 
                            :key="item"
                            @click="clickDidSelectStar(index)" 
                            src="https://img-ali.xiaohongchun.com.cn/admin/15711130960602a00e242.png">
                        <img class="evaluate-star" 
                            v-if="isEvaluate"
                            v-for="(item, index) in 5 - goodStarNumber" 
                            :key="item" 
                            @click="clickUnSelectStar(index)"
                            src="https://img-ali.xiaohongchun.com.cn/admin/157111310906918a4d0c.png">
                    </div>
                    <textarea class="evaluate-text" v-model="orderEvaluateText" :disabled="!isEvaluate" :placeholder="placeholder" maxlength="-1" adjust-position="true"></textarea>
                </div>
                <!-- evaluate-help & evaluate-submit 查看评价页隐藏-->
                <div v-if="isEvaluate" class="evaluate-help" @click="needHelpAction">
                    <img class="help-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/threeNewNeedHelp.png">
                    <p class="help-text">需要帮助</p>
                </div>
                <div v-if="isEvaluate" class="evaluate-submit">
                    <button class="submit-button" @click="evaluateContentSubmit">提交评价</button>
                </div>
            </div>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style scoped src="./style.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="@/common/style/common.css"></style>
