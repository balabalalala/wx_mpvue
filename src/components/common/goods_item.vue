<template>
    <div class="content-box" @click="boxHandle">
        <img v-if="!!goodsImg" class="goods-image" :src="goodsImg"/>
        <img v-if="!!smallImage" :class="{'small-image':smallImage, 'small-image-radius':smallImgRadius}" :src="smallImage"/>
        <div v-if="!!title" class="goods-title" :style="expire ? '-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' "><img v-if="!!titleTopIcon" class="title-top-icon" :src="titleTopIcon"/>{{title}}</div>
        <div v-if="!!topTitle" class="top-title" :style="expire ? '-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' ">{{topTitle}}</div>
        <div v-if="!!topDesc" class="top-desc" :style="expire ? '-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' ">{{topDesc}}</div>
        <div v-if="!!keynoteBg" class="keynote-bg">{{keynoteBg}}</div>
        <div v-if="!!keynote" class="keynote">{{keynote}}</div>
        <!-- 卡片第二行 -->
        <div class="detail-info">
            <div v-if="!!topKeynote" class="top-keynote">{{topKeynote}}</div>
            <div v-if="!!bottomRedButton" :style="!!underSecondary ? '':'top:180rpx'" class="bottom-red-button" @click="bottomRedHandle" :data-name="bottomRedButton.track">{{bottomRedButton.text}}</div>
        </div>
        <div v-if="!!editRec" class="editRec" >{{editRec}}</div>
        <div v-if="!!keySecondary" class="key-secondary" :style="expire ? ';-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' ">{{keySecondary}}</div>
        <div v-if="!!secondary" class="secondary" >{{secondary}}</div>
        <div class="mall-time">
            <div v-if="!!underSecondary" class="under-secondary">{{underSecondary}}</div>
            <div v-if="!!timeString" class="time-string" :style="{marginLeft: (underSecondary ? 10 : 0) +'rpx'}">{{timeString}}</div>
        </div>
        <div v-if="!!centerKeynote || !!centerSecondary" class="center-block">
            <span v-if="!!centerKeynote" class="center-keynote">{{centerKeynote}}</span>
            <span v-if="!!centerSecondary" class="center-secondary">{{centerSecondary}}</span>
        </div>
        <div v-if="!!bottomKey || !!bottomSecondary" class="bottom-block">
            <span v-if="!!bottomKey" class="bottom-key">{{bottomKey}}</span>
            <span v-if="bottomKey && bottomSecondary" class="divider">|</span>
            <span v-if="!!bottomSecondary" class="bottom-secondary">{{bottomSecondary}}</span>
        </div>
        <!-- 评论 -->
        <div class="comment" v-if="!!topKeynote || !!keynote" :style="!!bottomRedButton ? 'bottom:26rpx':''">
            <img class="comment-img" src="https://img-ali.xiaohongchun.com.cn/admin/15646399240282f17f0a8.png">
            <span class="comment-num">{{commentCount}}</span>
        </div>
        <!-- 值 -->
        <div v-if="!!topKeynote || !!keynote" class="value" :style="!!bottomRedButton ? 'bottom:26rpx':''">
            <img class="value-img" src="https://img-ali.xiaohongchun.com.cn/admin/15639606652059466134.png" >
            <span class="percentage">{{valuePercentage}}%</span>
        </div> 
        <div v-if="!!bottomButton" @click.stop="bottomButtonHandle" class="bottom-button">{{bottomButton}}</div>
        <div v-if="!!bottomGrayButton" @click.stop="bottomGrayHandle" class="bottom-gray-button">{{bottomGrayButton}}</div>
        <div v-if="!!bottomKeyButton" class="bottom-key-button">{{bottomKeyButton}}</div>
        <!-- 订阅按钮 -->
        <!-- <div v-if="!!bottomRedButton" class="bottom-red-button" @click="bottomRedHandle" :data-name="bottomRedButton.track">{{bottomRedButton.text}}</div> -->
        <!-- 我的足迹页删除 -->
        <img v-if="centerIcon" @click.stop="centerIconHandle" class="center-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/delIcon.png"/>
        <img v-if="topIcon" @click.stop="topIconHandle" class="top-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/delIcon.png"/>
        <!-- 已过期标识 -->
        <img v-if="expire" class="overtime-img" src="https://img-ali.xiaohongchun.com.cn/admin/15665431734372a4a2ef8.png"/>
        <!--img v-if="icon" class="icon-img" src="https://img-ali.xiaohongchun.com.cn/admin/15425993344122a708b8d.png"/-->
    </div>
</template>
<script>
    export default {

        data() {
            return { 
                goodsImage: true,
                imgRadius: true,
                smallImage: true,
                smallImgRadius: true
            }
        },
        props: ["valuePercentage","commentCount","toGo", "goodsImg", "radius", "smallImage", "expire", "icon", "title", "keynoteBg", "keynote", "keySecondary", "secondary", "centerKeynote", "centerSecondary", "bottomKey", "bottomSecondary", "centerIcon", "topIcon", "bottomButton", "bottomKeyButton", "titleTopIcon", "bottomRedButton", "underSecondary", "timeString", "topTitle", "topDesc","topKeynote", "editRec"],
        methods: {
            boxHandle(event){
                if(this.toGo){
                    this.$emit("toGo",event)
                }
            },
            centerIconHandle() {
                if(this.centerIcon){
                    this.$emit("centerIcon")
                }
            },
            topIconHandle() {
                if(this.topIcon){
                    this.$emit("topIcon")
                }
            },
            bottomButtonHandle() {
                if(this.bottomButton){
                    this.$emit("bottomButton")
                }
            },
            bottomRedHandle() {
                if(this.bottomRedButton){
                    this.$emit("bottomRedButton")
                }
            },
            bottomGrayHandle() {
                if(this.bottomGrayButton){
                    this.$emit("bottomGrayButton")
                }
            }
        },
        mounted() {

            if(this.radius !== undefined){
                this.imgRadius = this.radius
            }
            if(this.radius !== undefined){
                this.smallImgRadius = this.radius
            }

        },

        computed: {
            widthData: {
                get: function () {
                    let width = 200
                    if (this.timeString) {
                        width += this.timeString.length * 10
                    }
                    return 480 - width;
                },
            }
        },
    }
</script>

<style scoped>
    .detail-info {
        width: 470rpx;
        display: flex;
        justify-content: space-between;
    }
    .content-box{
        height: 100%;
        position: relative;
    }
    .goods-image{
        position:absolute;
        left:20rpx;
        top:30rpx;
        width: 210rpx;
        height: 210rpx;
    }
    .small-image{
        position:absolute;
        left:30rpx;
        top:26rpx;
        width: 160rpx;
        height: 160rpx;
    }
    .small-image-radius{
        /* border-radius: 10rpx; */
    }
    .goods-title{
        position: absolute;
        left: 250rpx;
        top: 30rpx;
        max-width: 430rpx;
        height: 80rpx;
        line-height: 40rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #000;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
    }
    .top-title{
        position: absolute;
        left: 250rpx;
        top: 30rpx;
        max-width: 430rpx;
        height: 80rpx;
        line-height: 40rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: #000;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
    }
    .top-desc{
        position: absolute;
        left: 250rpx;
        top: 94rpx;
        max-width: 450rpx;
        height: 80rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        color: #a3a3a3;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
    }
    .keynote-bg{
        position: absolute;
        left: 250rpx;
        top: 32rpx;
        max-width: 400rpx;
        line-height: 45rpx;
        font-size: 26rpx;
        color:#dc3538;
        text-overflow: ellipsis;
        overflow: hidden;
        background-color: #ffe4e1;
        padding: 0 20rpx;
        white-space: nowrap;
    }
    .keynote{
        position: absolute;
        left: 250rpx;
        top: 110rpx;
        max-width: 380rpx;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 28rpx;
        color:#dc3538;
    }
    .top-keynote{
        position: absolute;
        left: 250rpx;
        top: 120rpx;
        max-width: 310rpx;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 28rpx;
        color:#dc3538;
    }
    .editRec {
        position: absolute;
        left: 250rpx;
        top: 170rpx;
        max-width: 380rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 28rpx;
        color: #a3a3a3;
    }
    .key-secondary{
        position: absolute;
        left: 250rpx;
        top: 95rpx;
        max-width: 480rpx;
        height: 80rpx;
        line-height: 40rpx;
        height: 80rpx;
        font-size: 28rpx;
        color: #4c4c4c;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
    }
    .secondary{
        position: absolute;
        left: 250rpx;
        top: 156rpx;
        max-width: 390rpx;
        font-size: 28rpx;
        line-height: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a3a3a3;
    }
    .mall-time {
        position: absolute;
        left: 250rpx;
        bottom: 27rpx; 
        max-width: 222rpx; 
        height: 36rpx;
        line-height: 1;
    }
    .under-secondary{
        max-width: 123rpx;
        display: inline-block;
        font-size: 24rpx;
        line-height: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a3a3a3;
    }
    .time-string {
        display: inline-block;
        font-size: 24rpx;
        max-width: 90rpx;
        line-height: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a3a3a3;
    }
    .center-block{
        position: absolute;
        bottom: 22rpx;
        left: 250rpx;
        display: flex;
        color:#dc3538;
        line-height: 36rpx;
    }
    .center-keynote{
        font-size: 30rpx;
    }
    .center-secondary{
        margin-left: 10rpx;
        font-size: 36rpx;
    }
    .bottom-block{
        position: absolute;
        left: 250rpx;
        bottom: 43rpx;
        font-size: 24rpx;
        line-height: 30rpx;
        display: flex;
    }
    .bottom-key{
        font-size: 30rpx;
        color:#dc3538;
    }
    .divider{
        color: #a3a3a3;
        margin: 0 10rpx;
    }
    .bottom-secondary{
        max-width: 222rpx;
        color: #a3a3a3;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
     .comment{
        position: absolute;
        right: 160rpx;
        bottom: 43rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: right;
        width: 110rpx;
        line-height: 32rpx;
    }
    .comment-img {
        width: 28rpx;
        height: 28rpx;
    }
    .comment-num {
        margin-left: 12rpx;
        font-size:24rpx;
        color:rgba(128,128,128,1);
    }
    .value {
        position: absolute;
        right: 37rpx;
        bottom: 43rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 105rpx;
        line-height: 32rpx;
    }
    .value-img {
        width: 32rpx;
        height: 32rpx;
    }
    .percentage{
        font-size:24rpx;
        color:rgba(128,128,128,1);
        margin-left: 10rpx;
    }
    .bottom-key-button{
        position: absolute;
        bottom: 20rpx;
        right: 40rpx;
        padding: 0 30rpx;
        line-height: 56rpx;
        z-index: 2;
        background:#dc3538;
        color: #fff;
        font-size: 24rpx;
        border-radius: 30rpx;
    }
    .bottom-red-button{
        position: absolute;
        top: 115rpx;
        right: 40rpx;
        z-index: 2;
        width:114rpx;
        height: 54rpx;
        text-align: center;
        line-height:54rpx;
        background: #f5f5f5;
        font-size:24rpx;
        font-weight:400;
        color:#dc3538;
    }
    .overtime-img{
        position: absolute;
        top: 30rpx;
        left: 20rpx;
        height:34rpx;
        width:84rpx;
    }
    .icon-img{
        width: 64rpx;
        height: 85rpx;
        position: absolute;
        left: 20rpx;
        top: 30rpx;
    }
    .center-icon{
        width: 56rpx;
        height: 56rpx;
        position: absolute;
        top: 80rpx;
        right: 16rpx;
        z-index: 4;
    }
    .top-icon{
        width: 35rpx;
        height: 35rpx;
        position: absolute;
        top: 40rpx;
        right: 10rpx;
    }
    .bottom-button{
        width: 125rpx;
        height: 40rpx;
        position: absolute;
        right: 20rpx;
        bottom: 60rpx;
        border: 1rpx solid #d1d1d1;
        font-size: 24rpx;
        color: #808080;
        line-height: 40rpx;
        text-align: center;
    }
    .title-top-icon{
        width: 86rpx;
        height: 28rpx;
        display: inline-block;
        margin:0 10rpx -4rpx 0;
    }
    .bottom-gray-button{
        position: absolute;
        right: 20rpx;
        bottom: 20rpx;
        font-size: 24rpx;
        color:rgba(128,128,128,1);
        text-align: right;
        padding-right: 4rpx;
    }
</style>

