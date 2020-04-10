<template>
<div>
    <div class="container" v-if="show">
        <p class="view-order-img" data-name="view_order_img" @click.stop="viewOrderImg">点击查看订单截图 >></p>
        <div v-if="showOrderImg" style="padding-bottom:50rpx">
            <img :lazy-load="true" mode="widthFix" v-for="(img, index) in imgs" :src="img" :key="index" @click.stop="imgClick(img)">
        </div>
    </div>
    <div v-if="alone == 2" class="preferential">
        本商品为天天独家优惠，去电商自行购买可能无法以此价格买到哦。
    </div>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('disclosure')

export default {
    data () {
        return {
            showOrderImg: false, 
        }
    },
    computed: {
        ...mapState({
            alone: state => state.disclosure.alone,
            imgs: state => state.disclosure.order_screenshots
        }),
        show() {
            return this.imgs && this.imgs.length
        }
    },

    methods: {
        imgClick(img) {
            wx.previewImage({
                urls: this.imgs,
                current: img
            })
        },
        viewOrderImg () {
            this.showOrderImg = true
        }
    },
    created () {
        console.log(this.imgs)
    }
}
</script>

<style scoped>
.container {
    /* padding-bottom: 1em; */
}
.view-order-img {
    width: 380rpx;
    padding: 0 40rpx 30rpx 40rpx;
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:#5B92E1;
    line-height:1;
    box-sizing: border-box;
}
img {
    display: block;
    width: 690rpx;
    height: auto;
    padding: 0 30rpx;
}
.preferential {
    padding: 0 73rpx 55rpx 40rpx;
    box-sizing: border-box;
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(0,0,0,1);
    line-height:48rpx;
}
li {
    display: list-item;
    align-items: baseline;
    text-align: match-parent;
}
</style>

