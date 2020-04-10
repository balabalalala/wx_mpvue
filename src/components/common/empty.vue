<template>
    <div class="empty-data">
        <div class="container">
            <img v-if="image" :src="image" class="empty-image"/>
            <span class="empty-text">{{text}}</span>
        </div>
        <div class="bottom-button" @click="toIndex">
            <button class="button-detail">{{buttonText || '返回首页'}}</button>
        </div>
    </div>
</template>

<script>
import jump from '../../common/lib/jump'
export default {
    props: ["image", "text", "buttonText"],
    methods: {
        toIndex() {
             jump.switchTab('home')
        }
    }
};
</script>

<style scoped>
    .container{
        margin-top: 300rpx;
        text-align: center;
    }
    .empty-image {
        width: 150rpx;
        height: 150rpx;
    }
    .empty-text {
        margin-top: 100rpx;
        font-size: 35rpx;
        color: #191919;
        line-height: 50rpx;
        text-align: center;
    }
    .bottom-button{
        width: 100%;
        position: fixed;
        background-color: #ffffff;
        bottom: 0;
        text-align: right;
    }
    .button-detail{
        width: 220rpx;
        height: 80rpx;
        font-size: 32rpx;
        display: inline-block;
        color: #fff;
        background-color:#dc3538;
        vertical-align: bottom;
        border-radius: 0;
    }
</style>
