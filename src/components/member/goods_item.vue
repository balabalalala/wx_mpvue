<template>
    <div class="content-box" @click="boxHandle">
        <img v-if="!!goodsImg" :class="{'goods-image':goodsImage, 'image-radius':imgRadius}" :src="goodsImg"/>
        <img v-if="!!smallImage" :class="{'small-image':smallImage, 'small-image-radius':smallImgRadius}" :src="smallImage"/>
        <div v-if="!!title" class="goods-title" :style="expire ? 'opacity: 0.5;-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' "><img v-if="!!titleTopIcon" class="title-top-icon" :src="titleTopIcon"/>{{title}}</div>
        <div v-if="!!topTitle" class="top-title" :style="expire ? 'opacity: 0.5;-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' ">{{topTitle}}</div>
        <div v-if="!!topDesc" class="top-desc" :style="expire ? 'opacity: 0.5;-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' ">{{topDesc}}</div>
        <div v-if="!!keynoteBg" class="keynote-bg" :style="expire ? 'opacity: 0.5' : '' ">{{keynoteBg}}</div>
        <div v-if="!!keynote" class="keynote" :style="expire ? 'opacity: 0.5' : '' ">{{keynote}}</div>
        <div v-if="!!topKeynote" class="top-keynote" :style="expire ? 'opacity: 0.5' : '' ">{{topKeynote}}</div>
        <div v-if="!!keySecondary" class="key-secondary" :style="expire ? 'opacity: 0.5;-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' ">{{keySecondary}}</div>
        <div v-if="!!secondary" class="secondary" :style="expire ? 'opacity: 0.5' : '' ">{{secondary}}</div>
        <div v-if="!!underSecondary" class="under-secondary" :style="expire ? 'opacity: 0.5' : '' ">{{underSecondary}}</div>
        <div v-if="!!centerKeynote || !!centerSecondary" class="center-block" :style="expire ? 'opacity: 0.5' : '' ">
            <span v-if="!!centerKeynote" class="center-keynote">{{centerKeynote}}</span>
            <span v-if="!!centerSecondary" class="center-secondary">{{centerSecondary}}</span>
        </div>
        <div v-if="!!bottomKey || !!bottomSecondary" class="bottom-block" :style="expire ? 'opacity: 0.5' : '' ">
            <span v-if="!!bottomKey" class="bottom-key">{{bottomKey}}</span>
            <span v-if="bottomKey && bottomSecondary" class="divider">|</span>
            <span v-if="!!bottomSecondary" class="bottom-secondary">{{bottomSecondary}}</span>
        </div>
        <div v-if="!!bottomButton" @click.stop="bottomButtonHandle" class="bottom-button">{{bottomButton}}</div>
        <div v-if="!!bottomGrayButton" @click.stop="bottomGrayHandle" class="bottom-gray-button">{{bottomGrayButton}}</div>
        <div v-if="!!bottomKeyButton" class="bottom-key-button">{{bottomKeyButton}}</div>
        <div v-if="!!bottomRedButton" class="bottom-red-button" @click="bottomRedHandle" :data-name="bottomRedButton.track">{{bottomRedButton.text}}</div>
        <img v-if="centerIcon" @click.stop="centerIconHandle" class="center-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/delIcon.png"/>
        <img v-if="topIcon" @click.stop="topIconHandle" class="top-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/delIcon.png"/>
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
        props: ["toGo", "goodsImg", "radius", "smallImage", "expire", "icon", "title", "keynoteBg", "keynote", "keySecondary", "secondary", "centerKeynote", "centerSecondary", "bottomKey", "bottomSecondary", "centerIcon", "topIcon", "bottomButton", "bottomKeyButton", "titleTopIcon", "bottomRedButton", "underSecondary", "topTitle", "topDesc","topKeynote"],
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

        }

    }
</script>

<style scoped>
    .content-box{
        height: 100%;
        position: relative;
    }
    .goods-image{
        position:absolute;
        left:30rpx;
        top:30rpx;
        width: 200rpx;
        height: 200rpx;
    }
    .image-radius{
        /* border-radius: 10rpx; */
    }
    .small-image{
        position:absolute;
        left:30rpx;
        top:26rpx;
        width: 160rpx;
        height: 160rpx;
    }
    .small-image-radius{
        border-radius: 10rpx;
    }
    .goods-title{
        position: absolute;
        left: 250rpx;
        top: 34rpx;
        max-width: 430rpx;
        height: 80rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        font-weight: 600;
        color: #4c4c4c;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
        margin-right:32rpx;
    }
    .top-title{
        position: absolute;
        left: 240rpx;
        top: 44rpx;
        max-width: 430rpx;
        height: 80rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        font-weight: 600;
        color: #4c4c4c;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
    }
    .top-desc{
        position: absolute;
        left: 240rpx;
        top: 94rpx;
        max-width: 430rpx;
        height: 80rpx;
        line-height: 40rpx;
        font-size: 22rpx;
        color: #a3a3a3;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:1;
        overflow: hidden;
    }
    .keynote-bg{
        position: absolute;
        left: 240rpx;
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
        top: 116rpx;
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
        left: 240rpx;
        top: 136rpx;
        max-width: 380rpx;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 28rpx;
        color:#dc3538;
    }
    .key-secondary{
        position: absolute;
        left: 240rpx;
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
        top: 160rpx;
        max-width: 390rpx;
        font-size: 28rpx;
        line-height: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a3a3a3;
    }
    .under-secondary{
        position: absolute;
        left: 240rpx;
        bottom: 42rpx;
        max-width: 390rpx;
        font-size: 24rpx;
        line-height: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a3a3a3;
    }
    .center-block{
        position: absolute;
        bottom: 22rpx;
        left: 240rpx;
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
        right: 20rpx;
        bottom: 25rpx;
        font-size: 24rpx;
        line-height: 30rpx;
        display: flex;
        margin-right: 20rpx;
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
        color: #a3a3a3;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: right;
        padding-right: 4rpx;
    }
    .bottom-key-button{
        position: absolute;
        bottom: 26rpx;
        right: 33rpx;
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
        bottom: 30rpx;
        right: 33rpx;
        z-index: 2;
        width:114rpx;
        height: 54rpx;
        text-align: center;
        line-height:54rpx;
        background:#f5f5f5;
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
        bottom: 30rpx;
        font-size: 24rpx;
        color:rgba(128,128,128,1);
        text-align: right;
        padding-right: 4rpx;
    }
</style>

