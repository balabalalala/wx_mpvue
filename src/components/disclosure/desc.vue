<template>
<div>
    <section class="container">
        <div @click="showGoodsDetail" data-name="view_goods_detail" v-if="disclosure.content_imgs.length > 0" class="view-content">
            <div class="view-goods-detail">
                <span>{{goodsDetail}}</span>
                <div class="arrow-box">
                    <div :class="['arrow', showRecDesc ? 'arrow-top' : 'arrow-bottom']"></div>
                </div>
            </div>
            <p class="refere">详情来源于商家，仅供参考</p>
        </div>
        <div v-else class="view-content no-view-content">
            <div class="view-goods-detail no-goods-detail">
                <span>该商品未抓取到商品详情</span>
            </div>
            <div>
                <p v-if="fragment.url_status" class="refere to-view">请点击“去电商购买”自行查看</p>
                <p v-else class="refere to-view buy_link">请点击“直达链接”自行查看</p>
            </div>
        </div>
        <div v-if="showRecDesc" style="padding-bottom:20rpx"> 
            <img class="goods-img" :lazy-load="true" mode="widthFix" v-for="(img, index) in disclosure.content_imgs" :src="img" :key="index" @click.stop="imgClick(img)">
        </div>
         
    </section>
    <div class="price-change">
       <div>天天跟我买是一家中立的电商折扣信息推荐平台。</div>
       <div>好价信息有很强的时效性，价格及商品信息以商家页面为准，购买前请注意核实。</div>
    </div>
</div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('disclosure')

export default {
    data () {
        return {
            showRecDesc: false, 
        }
    },
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'buy_status','editor_rec_descs', 'rec_desc', 'purchase_way', 'exclude_area','reminder','content_imgs'),
            fragment: state => state.fragment,
        }),

        areas() {
            return (this.disclosure.exclude_area || []).join('、');
        },
        goodsDetail() {
            return this.showRecDesc ? '点击收起商品详情' : '点击查看商品详情'
        }
    },
    methods: {
        imgClick(img) {
            wx.previewImage({
                urls: this.disclosure.content_imgs,
                current: img
            })
        },
        showGoodsDetail () {
            this.showRecDesc = !this.showRecDesc
        }
    },
}
</script>

<style scoped>

.container {
    position: relative;
    /* padding: 50rpx 40rpx; */
    line-height: 1;
    border-top: 1rpx solid #f1f1f1;
    font-size: 28rpx;
    background:rgba(245,245,245,1);
}

h2 {
    font-size: 34rpx;
    font-weight: bold;
    color: #1a1a1a;
    text-align: center;
}

em {
    color: #dc3538;
    margin-top: 30rpx;
    font-weight:500;
    line-height: 42rpx;
}

p {
    line-height: 42rpx;
    margin-top: 40rpx;
    color: #4C4C4C;
    white-space: pre-wrap;
}
.view-content {
    width: 100%;
    height: 176rpx;
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:500;
    line-height:1;
    color:rgba(0,0,0,1);
    padding-top: 59rpx;
    padding-left: 232rpx;
    box-sizing: border-box;
    background:rgba(245,245,245,1);
}
.view-goods-detail {
    padding-left: 10rpx;
}
.no-view-content {
    padding-left: 185rpx;
}
.no-goods-detail {
    padding-left: 35rpx;
}
.refere {
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(165,165,165,1);
    margin-top: 19rpx;
    line-height:1;
}
.goods-desc {
    line-height: 42rpx;
    margin-top: 40rpx;
    color: #4C4C4C;
    white-space: pre-wrap;
    background: #fff;
    margin: 0 30rpx;
}
.to-view {
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(0,0,0,1);
}
.buy_link{
    margin-left: 13rpx;
}
.arrow-box {
    position: absolute;
    right: 210rpx;
    top: 50rpx; 
    height: 44rpx;
    width: 48rpx;
    z-index: 2;
}
.arrow {
    position: absolute;
    top: 50%;
    /* right: 20rpx; */
    width: 0;
    height: 0;
    border-width: 11rpx;
}
.arrow-bottom {
    transform: translateY(-4rpx);
    border-color: #1D1B19 transparent transparent transparent;
    border-style: solid dashed dashed dashed;
}
.arrow-top {
    transform: translateY(-12rpx);
    border-color: transparent transparent #1D1B19 transparent;
    border-style: dashed dashed solid dashed;
}
.goods-img {
    width: 690rpx;
    margin: 0 30rpx;
}
img {
    display: block;
}
.price-change {
    padding: 39rpx 71rpx 59rpx 57rpx;
    box-sizing: border-box;
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(128,128,128,1);
    line-height:42rpx;
    border-bottom: 20rpx solid #f5f5f5;
}
</style>