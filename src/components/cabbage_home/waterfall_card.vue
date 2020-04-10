<template>
    <div :data-name="'cabbage-card-' + data.id" class="fall-container" :style="'width:'+ width + 'px;'" @click="toDetail">
        <image v-if="data.type != 2" :src="data.icon_sign" class="icon-sign" />
        <image
        :data-name="'cabbage-card-' + data.id"
        class="fall-card-img"
        :style="'width:'+ imgWidth + 'px;height:'+ imgWidth +'px'"
        :src='data.image' 
        :lazy-load="true" />
        <div class="fall-content" :data-name="'cabbage-card-' + data.id">
            <p class="fall-title" style="-webkit-box-orient: vertical;" :data-name="'cabbage-card-' + data.id">{{data.title}}</p>
            <p class="fall-info" style="-webkit-box-orient: vertical;" :data-name="'cabbage-card-' + data.id">{{data.editor_rec_desc}}</p>
            <div class="fall-coupon"><span v-if="data.coupon">{{data.coupon/100}}元券</span><span v-if="data.free_post">包邮</span></div>
            <div class="fall-price"><span>{{data.v_detail}}</span><span v-show="data.mall">{{data.mall}}</span></div>
        </div>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'
export default {
    props:['data','width'],
    computed: {
        imgWidth() {
            return this.width - 2
        }  
    },
    methods: {
        //0爆料 1文章 2好货
        toDetail (e) {
            if (!this.data.type) {
                jump.navigateTo('disclosure', {gdid: this.data.id}, e)
            } else {
                jump.navigateTo('web_view', {
                    url: this.data.url_string,
                    notShare: false,
                    webPage: true,
                    shareTitle: `${this.data.v_detail} ${this.data.title}`
                }, e)
            }
        }
    }
}
</script>

<style scoped>
.fall-content {
    box-sizing: border-box;
    padding: 27rpx 20rpx;
}
.fall-container {
    box-sizing: border-box;
    margin-bottom:20rpx;
    position: relative;
    border: 2rpx solid  #f5f5f5;
}
.icon-sign {
    position: absolute;
    left: 0;
    top: 20rpx;
    width: 68rpx;
    height: 33rpx;
    z-index: 1;
    border-radius: 0;
}
image {
    display: block;
    /* border-radius: 10rpx 10rpx 0 0; */
}
.fall-title {
    height: 76rpx;
    font-size: 26rpx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(26,26,26,1);
    line-height: 38rpx;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    overflow: hidden;
}
.fall-info {
    height: 68rpx;
    line-height: 34rpx;
    margin-top: 8rpx;
    font-size: 22rpx;
    font-family: PingFang-SC-Light;
    font-weight: 300;
    color: rgba(128,128,128,1);
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    overflow: hidden;
}
.fall-coupon {
    height: 24rpx;
    margin-top: 22rpx;
    display: flex;
}
.fall-coupon span {
    display: inline-block;
    display: flex;
    align-items: center;
    height: 24rpx;
    padding: 0 9rpx;
    margin-right: 11rpx;
    background:rgba(255,233,212,1);
    border-radius: 2rpx;
    font-size: 17rpx;
    font-family:PingFang-SC-Regular;
    color: rgba(209,107,69,1);
    text-align: center;
}
.fall-price {
    margin-top: 18rpx;
    display: flex;
    justify-content: space-between;
    line-height: 1;
    align-items:flex-end;
}
.fall-price span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.fall-price span:first-of-type {
    flex: 2;
    font-size: 24rpx;
    color: #dc3538;
}
.fall-price span:last-of-type {
    flex: 1;
    font-size: 20rpx;
    font-weight:300;
    color:rgba(128,128,128,1);
    text-align: right;
}
</style>
