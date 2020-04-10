<template>
    <div :data-track_info="disclosure.track_info" class="content-box" @click="toDetail">
        <img v-if="(disclosure.buy_status ? (disclosure.buy_status === 0) : (disclosure.status===-1))" class="overtime-img" src="https://img-ali.xiaohongchun.com.cn/admin/15665431734372a4a2ef8.png"/>
        <img v-if="disclosure.icon_sign && !top" class="icon-img" src="https://img-ali.xiaohongchun.com.cn/admin/1543580901684180905b3.png"/>

        <i v-if="top" class="top-icon">TOP {{top}}</i>

        <img class="goods-image" :src="disclosure.image_url"/>
        <div class="right-content">
            <div class="goods-title" :style="((disclosure.buy_status ? (disclosure.buy_status === 0) : (disclosure.status===-1))) ? 'opacity: 0.5;-webkit-box-orient: vertical;' : '-webkit-box-orient: vertical;' "><img v-if="disclosure.goods_icon" class="title-top-icon" :src="disclosure.goods_icon"/>{{disclosure.title}}</div>
            <div class="keynote" :style="((disclosure.buy_status ? (disclosure.buy_status === 0) : (disclosure.status===-1))) ? 'opacity: 0.5' : '' ">{{disclosure.deal_price}}</div>
            <div class="secondary" :style="((disclosure.buy_status ? (disclosure.buy_status === 0) : (disclosure.status===-1))) ? 'opacity: 0.5' : '' ">{{disclosure.editor_rec_desc}}</div>
            <div class="bottom-secondary" :style="((disclosure.buy_status ? (disclosure.buy_status === 0) : (disclosure.status===-1))) ? 'opacity: 0.5' : '' ">{{disclosure.mall}} 发货</div>
        </div>
    </div>
</template>
<script>
import jump from "@/common/lib/jump"
export default {
    props: ['disclosure', 'top'],
    methods: {
        toDetail(event) {
            jump.navigateTo("disclosure", {gdid: this.disclosure.id}, event)
        }
    }

}
</script>

<style scoped>
.content-box{
    position: relative;
    height: 100%;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
}
.goods-image{
    width: 200rpx;
    height: 200rpx;
    border-radius: 10rpx;
    float: left;
}
.right-content{
    margin-left: auto;
}
.goods-title{
    margin: 6rpx 0 0 220rpx;
    max-width: 480rpx;
    height: 78rpx;
    line-height: 38rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #4c4c4c;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.title-top-icon{
    width: 86rpx;
    height: 28rpx;
    display: inline-block;
    margin: 0 2rpx -4rpx 0;
}
.keynote{
    margin: 4rpx 0 0 220rpx;
    max-width: 480rpx;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 28rpx;
    color: #dc3538;
}
.secondary{
    margin: 4rpx 0 0 220rpx;
    max-width: 480rpx;
    font-size: 28rpx;
    line-height: 36rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #a3a3a3;
}
.bottom-secondary{
    margin: 4rpx 10rpx 0 auto;
    font-size: 24rpx;
    line-height: 30rpx;
    color: #a3a3a3;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
}
.overtime-img{
    position: absolute;
    top: 30rpx;
    left: 20rpx;
    height: 34rpx;
    width: 84rpx;
}
.icon-img{
    width: 70rpx;
    height: 70rpx;
    position: absolute;
    left: 20rpx;
    top: 30rpx;
}
.top-icon{
    width: 70rpx;
    color: #fff;
    text-align: center;
    height: 30rpx;
    line-height: 32rpx;
    font-size: 18rpx;
    background:rgba(255,67,28,1);
    border-radius: 8rpx 0 8rpx 0;
    position: absolute;
    left: 20rpx;
    top: 30rpx;
}
</style>

