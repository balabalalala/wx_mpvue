<template>
<form @click="onclick" report-submit='true' @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div class="container">
            <div class="subscribe-top">
                <div data-name="subscribeManage" class="subscribe-top-manage" @click="toManage">订阅管理</div>
            </div>
            <!-- 无订阅提示 -->
            <div class="subscribe-intro" v-if="!isAttention">
                <p style="font-weight: bold;margin:160rpx auto 13rpx auto;font-size: 28rpx;text-align: center;">您目前还没有订阅，赶快订阅吧</p>
            </div>
            <!-- 订阅列表 -->
            <div v-if="isAttention" class="attention">
                <div class="attention-container" v-for="(item, index) in goods" :key="item">
                    <scroll-view v-if="goods.length > 3 && index === 3" scroll-x="true" class="category-list">
                        <div class="category-node" v-for="(cate, i) in categorys" :key="cate">
                            <category :goodsImg="cate.goodsImg" :title="cate.title" :bottomRedButton="cate.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:2,eid:cate.id})" :ref="cate.id" isSubId="" :isSubscribe="false"></category>
                        </div>
                    </scroll-view>
                    <div class="attention-goods-content" :style="goods.length > 3 && index === 3 ? 'margin-top:0' : ''">
                        <goods
                            :goodsType="0"
                            :buyStatus="1"
                            :title="item.topTitle"
                            :price="item.topKeynote"
                            :imageUrl="item.goodsImg"
                            :mall="item.underSecondary"
                            :editorDesc="item.editRec"
                            :publishTime="item.timeString"
                            :valuePercentage="item.value_percentage"
                            :commentCount="item.comment_count" 
                            :goodsId="item.id || item.gid" />
                    </div>
                </div>
                <scroll-view scroll-x="true" class="category-list" v-if="goods.length <= 3">
                    <div class="category-node" v-for="categ in categorys" :key="categ">
                        <category :goodsImg="categ.goodsImg" :title="categ.title" :bottomRedButton="categ.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:2,eid:categ.id})" :ref="categ.id" isSubId="" :isSubscribe="false"></category>
                    </div>
                </scroll-view>
            </div>
            <!-- 无订阅推荐 -->
            <div v-else class="not-attention">
                <div class="hot-tag">热门分类</div>
                <scroll-view class="category-list" scroll-x="true">
                    <div class="category-node" v-for="(cate, i) in categorys" :key="cate">
                        <category :goodsImg="cate.smallImage" :title="cate.title" :bottomRedButton="cate.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:2,eid:cate.id})" :ref="cate.id" isSubId="" :isSubscribe="false"></category>
                    </div>
                </scroll-view>
                <div class="hot-tag" v-if="goods.length>0">热门商品</div>
                <div>
                    <div class="hot-tag-list" v-for="item in goods" :key="item">
                        <goods-item 
                            @toGo="toGoHandle(item, $event)" 
                            :toGo="item.toGo"
                            :goodsImg="item.goodsImg" 
                            :radius="item.radius" 
                            :expire="item.expire" 
                            :icon="item.icon" 
                            :topTitle="item.topTitle" 
                            :topDesc="item.topDesc" 
                            :topKeynote="item.topKeynote" 
                            :underSecondary="item.underSecondary" 
                            :editRec="item.editRec"
                            :timeString ="item.timeString"
                            :bottomRedButton="item.bottomRedButton" 
                            @bottomRedButton="bottomRedHandle({e_type:1,did:item.id})" 
                            :ref="item.id" 
                            :isSubId="item.fav_id"
                            :valuePercentage="item.value_percentage"
                            :commentCount="item.comment_count" 
                            :isSubscribe="true">
                        </goods-item>
                    </div>
                </div>
            </div>

            <loading v-if="needLoad"></loading>
            <div v-if="noData" class="no-data">好价在路上，再等等哦~</div>
            <to-index></to-index>
        </div>

        <subscribe-modal :showModal="isShowSubscribeAlert" @hideSubscribeAlert="hideSubscribeModal" />

    </button>
</form>
</template>

<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
<style src="@/components/subcribe/subcribe_focus.css"></style>

