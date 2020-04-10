<template>
    <div class="cotainer">
        <div class="content">
            <img class="category-img" :src="goodsImg"/>
            <div class="title">{{title}}</div>
            <div :data-name="bottomRedButton.text.length >2? 'c_unsub' : 'c_sub'" class="category-btn" @click="bottomRedHandle">{{bottomRedButton.text}}</div>
        </div>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'

export default {
    props: ['goodsImg', 'title', 'bottomRedButton'],
    methods: {
        bottomRedHandle() {
            if(this.bottomRedButton){
                this.$emit("bottomRedButton")
            }
        }
    }
}
</script>

<style scoped>
.cotainer{
    padding: 20rpx 10rpx 0rpx;
    width: 200rpx;
    height: 280rpx;
    background-color: #f5f5f5;
    /* background: url(https://img-ali.xiaohongchun.com.cn/admin/15367409193462d5b8815.png);
    background-size: cover; */
}
.content {
     width: 204rpx;
    height: 344rpx;
    background-color: #fff;
}
.category-img{
    width: 204rpx;
    height: 204rpx;
    display: block;
    margin: 0 auto;
}
.title{
    margin: 24rpx 0 20rpx;
    line-height: 100%;
    text-align: center;
    font-size: 28rpx;
    font-weight: 500;
    color:rgba(26,26,26,1);
}
.category-btn{
    width: 112rpx;
    text-align: center;
    height: 42rpx;
    line-height: 42rpx;
    margin: 10rpx auto 0;
    background:#f5f5f5;
    font-size: 24rpx;
    font-weight: 500;
    color:#dc3538;
}
</style>
