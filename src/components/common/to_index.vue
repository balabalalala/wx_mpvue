<template>
    <img @click="jumpIndex" data-name="back_home" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/backIndex.png" />
</template>

<script>
import pages from '@/lib/pages_config';
export default {
    methods:{
        jumpIndex() {
            wx.switchTab({
                url: pages.index,
                success() {
                  setTimeout(() => {
                      getApp().globalData.events.trigger('login')
                  }, 1000)
                }
            });
        }
    }
}
</script>

<style scoped>
img {
    position: fixed;
    bottom: 200rpx;
    right: 50rpx;
    z-index: 3;
    width: 66rpx;
    height: 66rpx;
}
.report-container img {
    z-index: 10;
}
.ipx img {
    bottom: 244rpx;
}
</style>
