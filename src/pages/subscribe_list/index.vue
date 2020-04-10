<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="container">
                <toast />
                <subscribe-modal :showModal="isShowSubscribeAlert" @hideSubscribeAlert="hideSubscribeModal" />
                <Tab @fetch="fetch" :all="allNumber" :categorys="categorysNumber" :goods="goodsNumber" :labels="labelsNumber" :allClass="allClass" :categorysClass="categorysClass" :goodsClass="goodsClass" :labelsClass="labelsClass" ref="tab"></Tab>
                <div class="list-content">
                    <div v-if="current === 1" class="hot-tag-list" v-for="item in all" :key="item">
                        <goods-item v-if="item.type == 1" @toGo="toGoHandle(item, $event)" :toGo="item.toGo" :goodsImg="item.goodsImg" :radius="item.radius" :expire="item.expire" :icon="item.icon" :title="item.title" :topTitle="item.topTitle" :topDesc="item.topDesc" :topKeynote="item.topKeynote" :editRec="item.editRec" :underSecondary="item.underSecondary" :timeString ="item.timeString" :commentCount="item.comment_count" :valuePercentage="item.value_percentage" :bottomRedButton="item.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:item.type,did:item.id})" :ref="item.id" :isSubId="item.fav_id" :isSubscribe="false"></goods-item>
                        <goods-item v-else @toGo="toGoHandle(item, $event)" :toGo="item.toGo" :goodsImg="item.goodsImg" :radius="item.radius" :expire="item.expire" :icon="item.icon" :title="item.title" :topTitle="item.topTitle" :topDesc="item.topDesc" :topKeynote="item.topKeynote" :commentCount="item.comment_count" :valuePercentage="item.value_percentage" :underSecondary="item.underSecondary" :bottomRedButton="item.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:item.type,eid:item.id})" :ref="item.id" :isSubId="item.fav_id" :isSubscribe="false"></goods-item>
                    </div>
                    <div v-if="current === 2" class="hot-tag-list" v-for="item in categorys" :key="item">
                        <goods-item :goodsImg="item.goodsImg" :radius="item.radius"  :topTitle="item.topTitle" :bottomRedButton="item.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:2,eid:item.id})" :ref="item.id" :isSubId="item.fav_id" :isSubscribe="false"></goods-item>
                    </div>
                    <div v-if="current === 3" class="hot-tag-list" v-for="item in goods" :key="item">
                        <goods-item @toGo="toGoHandle(item, $event)" :toGo="item.toGo" :goodsImg="item.goodsImg" :radius="item.radius" :expire="item.expire" :icon="item.icon" :topTitle="item.topTitle" :topKeynote="item.topKeynote" :commentCount="item.comment_count" :valuePercentage="item.value_percentage" :underSecondary="item.underSecondary" :editRec="item.editRec" :timeString = "item.timeString" :bottomRedButton="item.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:1,did:item.id})" :ref="item.id" :isSubId="item.fav_id" :isSubscribe="false"></goods-item>
                    </div>
                    <div v-if="current === 4" class="hot-tag-list" v-for="item in labels" :key="item">
                        <goods-item :goodsImg="item.goodsImg" :radius="item.radius"  :topTitle="item.topTitle" :topDesc="item.topDesc" :bottomRedButton="item.bottomRedButton" @bottomRedButton="bottomRedHandle({e_type:3,eid:item.id})" :ref="item.id" :isSubId="item.fav_id" :isSubscribe="false"></goods-item>
                    </div>
                </div>
                <to-index></to-index>
                 <!-- 无消息 -->
                <div v-if="all.length == 0" class="no-subscribe">
                    <img src="https://img-ali.xiaohongchun.com.cn/admin/1570589430731723cd63.png">
                </div>
            </div>
            
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
<style src="@/components/subcribe/subcribe_focus.css"></style>
