<template>
    <div class="tao-disclosure-container" :data-name="otherBtnName" @click="copy(d)">
        <image :data-name="otherBtnName" lazy-load="true" mode="widthFix" :src="d.image" />
        <div :data-name="otherBtnName" class="tao-content">
            <p class="tao-desc">{{d.recommend_word}}</p>
            <h2 class="tao-title" style="-webkit-box-orient: vertical;">{{d.title}}</h2>
            <div class="tao-label" v-if="d.discounts_price || d.free_post">
                <div v-if="d.discounts_price">{{d.discounts_price/100}}元券</div>
                <div v-if="d.free_post">包邮</div>
            </div>
            <div class="tao-bottom" :data-name="d.id">
                <span>{{d.discounts_price ? '券后价 ' : '¥'}}{{d.price/100}}</span>
                <div :data-name="toLinkBtnName">直达链接</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        d: {
            type: Object,
            default:{}
        } 
    },
    computed: {
        toLinkBtnName () {
            return 'tao_btn_copy_' + this.d.id
        },
        otherBtnName () {
            return 'tao_card_copy_' + this.d.id 
        }
        },
    methods: {
        copy (d) {
            this.wx.setClipboardData({data: d.tkl_pwd }).then(() => wx.hideToast())
            this.$emit('showSuccessModal', {
                img: d.image,
                hadCoupon: Boolean(d.discounts_price)
            })
        }
    }
}
</script>

<style>
.tao-disclosure-container {
    width: 345rpx;
    margin-bottom: 20rpx;
    background:rgba(255,255,255,1);
    border-radius:10rpx;
}
.tao-disclosure-container image {
    display: block;
    width: 100%;
    border-radius: 10rpx 10rpx 0 0;
}
.tao-content {
    box-sizing: border-box;
    padding: 23rpx 30rpx 21rpx 31rpx;
}
.tao-title, .tao-desc {
    line-height: 1;
}
.tao-title {
    margin: 12rpx 0 51rpx 0;
    max-height: 76rpx;
    line-height: 34rpx;
    font-size: 22rpx;
    font-weight: 300;
    color:rgba(128,128,128,1);
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
}
.tao-desc {
    font-size: 26rpx;
    font-weight: bold;
    color:rgba(26,26,26,1);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.tao-label {
    overflow: hidden;
}
.tao-label div {
    float: left;
    width: 61rpx;
    height: 24rpx;
    margin-right: 11rpx;
    background:rgba(255,233,212,1);
    border-radius: 2rpx;
    font-size:17rpx;
    color:rgba(209,107,69,1);
    line-height: 24rpx;
    text-align: center;
}
.tao-bottom {
    margin-top: 9rpx;
    line-height: 42rpx;
    font-size: 24rpx;
    color:#dc3538;
    overflow: hidden;
}
.tao-bottom div {
    float: right;
    width: 116rpx;
    height: 38rpx;
    background:rgba(255,255,255,1);
    border: 1rpx solid rgba(255, 61, 61, 1);
    border-radius: 6rpx;
    line-height: 38rpx;
    font-size: 22rpx;
    color:#dc3538;
    text-align: center;
}
</style>
