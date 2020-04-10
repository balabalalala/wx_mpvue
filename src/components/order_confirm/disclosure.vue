<template>
    <div class="disclosure-container" @click="toDisclosure">
        <image class="disclosure-image" :src="disclosure.image_url" />
        <div class="disclosure-info">
            <p class="info-title" style="-webkit-box-orient: vertical;">{{orderTitle}}</p>
            <p class="info-spec">{{order.spec}}</p>
            <div class="info-detail">
                <p class="info-price">￥{{order.type == 8 ? order.pay_post/100 + '（快递费）' : (order.price/100)/order.num}}</p>
                <p class="info-number">x {{order.num}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import jump from '../../common/lib/jump'
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'image_url', 'title', 'id'),
            order: state => _.pick(state.order, 'type', 'origin_spec', 'spec', 'pay_post', 'price', 'num'),
            pageType: state => state.pageType
        }),
        orderTitle () {
            if((this.order.type == 3 || this.order.type == 9) && this.order.origin_spec && this.order.origin_spec[0]) return this.order.origin_spec[0].title
            return this.disclosure.title
        }
    },
    methods: {
        toDisclosure () {
            if(this.pageType != 2) return
            jump.navigateTo('disclosure', {gdid: this.disclosure.id})
        }
    }
}
</script>

<style scoped>
.disclosure-container {
    box-sizing: border-box;
    width: 100%;
    padding: 50rpx 35rpx 30rpx 38rpx;
    background-color: #fff;
    display: flex;
}
.disclosure-image {
    display: block;
    width: 160rpx;
    height: 160rpx;
    margin-right: 20rpx;
}
.disclosure-info {
    flex: 1;
}
.info-spec, .info-number, .info-price {line-height: 1;}
.info-title {
    height: 76rpx;
    max-width: 471rpx;
    line-height: 38rpx;
    font-size: 26rpx;
    font-family:PingFang-SC-Regular;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    word-break: break-all;
}
.info-spec {
    margin-top: 14rpx;
    height: 24rpx;
    font-size: 24rpx;
    color: #808080;
}
.info-detail {
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.info-number {
    font-size: 24rpx;
}
.info-price {
    font-size: 28rpx;
    color: #dc3538;
}
</style>
