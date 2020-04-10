<template>
<div class="mask" @click="hideModal">
    <div class="container" @click.stop>
        <section v-if="disclosure.tkl_url">
            <ul>
                <li> 商品{{tbkRemind.tkl_mark}} <button data-name="copy_link" @click.stop="copy(disclosure.tkl_url, 'copy_tkl')" class="copy-btn">复制链接</button> </li>
                <li v-for="(coupon, index) in disclosure.coupon_info" :key="index"> {{coupon.name}} <button data-name="copy_link" @click="copy(coupon.fanli_url, 'copy_coupon')" class="copy-btn">复制链接</button> </li>
                <li v-for="(piece, index) in disclosure.piece_info" :key="index"> {{piece.name}} <button data-name="copy_link" @click="copy(piece.fanli_url, 'copy_piece')" class="copy-btn">复制链接</button> </li>
            </ul>
        </section>
    </div>

</div>
</template>

<script>
import _ from 'underscore'
import jump from '@/common/lib/jump'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, } = createNamespacedHelpers('disclosure')

export default {
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'piece_info', 'coupon_info', 'fanli_url', 'tkl_url')
        }),
        ...mapState(['tbkRemind'])
    },
    methods: {
        ...mapMutations(['showModal', 'hideModal']),
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
.mask {
    z-index: 4;
}

.container {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 10rpx 40rpx 50rpx;
    background: #fff;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

section {
    margin-top: 20rpx;
}

h3 {
    font-size: 28rpx;
    font-weight: bold;
    line-height: 2.5em;
    border-bottom: 1rpx solid #efefef;
}

li {
    color: #4c4c4c;
    font-size: 26rpx;
    padding: 20rpx 0;
    font-weight: 400;
}

.copy-btn {
    font-size: 24rpx;
    float: right;
}
</style>