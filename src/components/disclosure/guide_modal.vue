<template>
<div @click="hide" class="mask">
    <img src="https://img-ali.xiaohongchun.com.cn/admin/15378435083913a4d6579.png">
    <img src="https://img-ali.xiaohongchun.com.cn/admin/154391240187412c08200.png">
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('disclosure')

export default {
    methods: {
        ...mapMutations(['hideModal']),
        hide() {
            wx.setStorage({
                key:"showBuyStatus",
                data: true
            })

            this.hideModal()
        }
    }
}
</script>

<style scoped>
.mask img:first-child {
    position: absolute;
    width: 500rpx;
    height: 300rpx;
    bottom: 120rpx;
    right: 25rpx;
}

.mask img:last-child {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 400rpx;
    height: 100rpx;
}

.ipx .mask img:last-child {
    bottom: 60rpx;
}
</style>