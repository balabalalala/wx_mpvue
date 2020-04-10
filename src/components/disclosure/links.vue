<template>
<div class="container" v-if="coupons.length || pieces.length">
    <ul v-if="coupons.length">
        <li v-for="(coupon, index) in coupons" :key="index">
            <span class="links-title"><strong>优惠券：</strong>{{ coupon.name }}</span>
            <button data-name="copy_coupon" @click="copy(coupon.fanli_url, 'copy_coupon')" class="copy-btn">领取</button>
        </li>
    </ul>
    <ul v-if="pieces.length">
        <li v-for="(piece, index) in pieces" :key="index">
            <span class="links-title"><strong>凑单品：</strong>{{ piece.name }}</span>
            <button data-name="copy_piece" @click="copy(piece.fanli_url, 'copy_piece')" class="copy-btn">直达链接</button>
        </li>
    </ul>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import util from "@/lib/util"
import jump from '@/common/lib/jump'
const { mapState, mapMutations } = createNamespacedHelpers('disclosure')

export default {
    computed: {
        ...mapState({
            pieces: state => state.disclosure.piece_info || [],
            coupons: state => state.disclosure.coupon_info || []
        })
    },

    methods: {
        ...mapMutations(['showModal']),
        copy(url, key) {
            jump.navigateTo('web_view', {
                url: '/mall_link?link='+ encodeURIComponent(url),
                notShare: true,
                webPage: true,
            })
            // this.showModal(key)
            // this.wx.setClipboardData({data: url }).then(() => wx.hideToast())
        }
    }

}
</script>

<style scoped>
.container {
    margin: 0 40rpx 25rpx 40rpx;
}

li {
    color: #1a1a1a;
    font-size: 28rpx;
    margin-bottom: 16rpx;
}

.links-title {
    width:510rpx;
    line-height: 42rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    float:left;
    box-sizing: border-box;
}
.links-title strong {
    display: inline;
    font-size: 28rpx;
    font-weight: bold;
    color: #000;
}
b {
    color: #222;
    display: inline;
    font-weight: bold;
}

.copy-btn {
    /* float: right; */
    width:156rpx;
    height:44rpx;
    background:rgba(255,255,255,1);
    border:2rpx solid rgba(220, 53, 56, 1);
    font-size:26rpx;
    font-family:PingFang;
    font-weight:400;
    color:rgba(220,53,56,1);
}
</style>