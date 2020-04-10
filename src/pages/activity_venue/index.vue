<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container">
                <div class="top-banner">
                    <image mode="widthFix" style="width:100%;" src="https://img-ali.xiaohongchun.com.cn/admin/15547753633932ae0c664.png" />
                    <image mode="widthFix" style="width:100%; " src="https://img-ali.xiaohongchun.com.cn/admin/155477545902627f58e56.png" />
                </div>
                <div v-if="!isEnd" class="venue-list">
                    <div class="tab-content">
                        <div @click="switchTab(tabIndex)" class="tab-content-node" v-for="(tabVenue, tabIndex) in venues" :key="tabIndex" :style="tabIndex === currentVenue ? (tabVenue.day_status === 2 ? 'background:#EAEAEA; color:#a6a6a6;' : 'color:#fff;background:#ff7f7a;') : (tabVenue.day_status === 2 ? 'color:#d7d7d7;' : '')">
                            <p class="tab-content-date">{{tabVenue.day_date}}</p>
                            <p class="tab-content-title">{{tabVenue.day_title}}</p>
                        </div>
                    </div>
                    <div class="venue-content">
                        <div class="venue-content-node" v-for="(dayVenue, dayIndex) in venues" :key="dayIndex" v-if="dayIndex === currentVenue">
                            <div class="venue-margin" v-for="(fieldItem, fieldIndex) in dayVenue.hour_list" :key="fieldIndex">
                                <field-title :currentTime="currentTime" :isCurrent="dayIndex === currentVenue" :isFirst="fieldIndex === 0" :fieldItem="fieldItem" @fetchVenue="fetchVenue"></field-title>
                                <div class="goods-content">
                                    <div v-for="(disclureItem, disclureIndex) in fieldItem.hour_items" :key="disclureIndex" class="goods" :style="((disclureIndex === fieldItem.hour_items.length -1) || (disclureIndex === fieldItem.hour_items.length -2)) ? 'padding-bottom:20rpx;' : ''">
                                        <kill-goods :currentTime="currentTime" :fieldItem="fieldItem" :disclosure="disclureItem" @startTipHandle="startTipHandle" @disclosureTipHandle="disclosureTipHandle"></kill-goods>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <image mode="widthFix" style="width:100%;" src="https://img-ali.xiaohongchun.com.cn/admin/15547754627763850af8b.png" />
                <div class="sellings-list">
                    <div class="selling" v-for="(item, index) in selllingGoods" :key="index">
                        <goods-item v-if="index === 0 || index === 1 || index === 2" :disclosure="item" :top="index+1"></goods-item>
                        <goods-item v-else :disclosure="item"></goods-item>
                    </div>
                    <img v-if="noData" class="no-data" style="display:block;" src="https://img-ali.xiaohongchun.com.cn/admin/154357660074425c07c71.jpg"/>
                </div>
                <disclosure-toast v-if="startTip" :threeTip="threeTip"> </disclosure-toast>
                <disclosure-alert v-if="disclosureTipShow" :disclosureTipParams="disclosureTipParams" @closeDisclosureTip="closeDisclosureTip" @topBtnHandle="topBtnHandle" @bottomBtnHandle="bottomBtnHandle"></disclosure-alert>
                <loading v-if="needLoad"></loading>
                <to-index></to-index>
                <to-top :scrollTop="scrollTop"></to-top>
            </div>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
