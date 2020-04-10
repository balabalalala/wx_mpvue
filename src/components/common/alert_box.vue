<template>
    <div class="alert-box-content">
        <div class="shadow-layer"></div>
        <div class="alert-box">
            <div class="title-content">
                <div v-if="!!alertConfig.title" class="title">{{alertConfig.title}}</div>
                <div v-if="!!alertConfig.content" class="content">{{alertConfig.content}}</div>
            </div>
            <div v-if="!!alertConfig.leftBtnText && !!alertConfig.rightBtnText" class="button-area">
                <div @click="leftHandle" class="left-button">{{alertConfig.leftBtnText}}</div>
                <div @click="rightHandle" class="right-button">{{alertConfig.rightBtnText}}</div>
            </div>
            <div v-if="!!alertConfig.centerBtnText" @click="centerHandle" class="center-button-area">{{alertConfig.centerBtnText}}</div>
        </div>
    </div>
</template>
<script>

    export default {
        props: ["alertConfig"],
        methods: {
            leftHandle() {
                this.$emit("leftHandle")
            },
            rightHandle() {
                this.$emit("rightHandle")
            },
            centerHandle() {
                this.$emit("centerHandle")
            }
        }

    }
</script>

<style scoped>
    .shadow-layer{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: #a7a7a7;
        opacity:0.3;
        background-color: #000;
        opacity: 0.6;
        z-index: 20;
    }
    .alert-box{
        width: 600rpx;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 21;
    }
    .title-content{
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        background: #fff;
        padding: 20rpx 0;
    }
    .title{
        margin-top: 20rpx;
        width: 100%;
        color: #4c4c4c;
        font-size: 32rpx;
        font-weight: bold;
        text-align: center;
    }
    .content{
        margin-top: 20rpx;
        width: 100%;
        color: #808080;
        font-size: 32rpx;
        text-align: center;
    }
    .button-area{
        border-top: 1rpx solid #e5e5e5;
        line-height: 88rpx;
        border-bottom-left-radius: 20rpx;
        border-bottom-right-radius: 20rpx;
        display: flex;
        background: #fff;
    }
    .left-button{
        width: 298rpx;
        text-align: center;
        font-size: 34rpx;
        color: #808080;
        border-right: 1rpx solid #e5e5e5;
    }
    .right-button{
        width: 302rpx;
        text-align: center;
        font-weight: 500;
        color: #4c4c4c;
        font-size: 34rpx;
    }
    .center-button-area{
        border-top: 1rpx solid #e5e5e5;
        line-height: 72rpx;
        text-align: center;
        border-bottom-left-radius: 20rpx;
        border-bottom-right-radius: 20rpx;
        background: #fff;
    }
</style>

