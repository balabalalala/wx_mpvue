<template>
<div class="container">    
    <swiper class="swiper" :autoplay="true" :indicator-dots="true" :circular="true">
        <swiper-item v-for="(img, index) in imgs" :key="index">
            <image :lazy-load="true" mode="aspectFit" @click="imgClick(img)" :src="img" />
        </swiper-item>
    </swiper>
</div>
</template>

<script>
import _ from 'underscore'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('disclosure')

export default {
    computed: {
        ...mapState({
            imgs: state => state.disclosure.goods_imgs,
            loaded: state => state.loaded
        })
    },

    methods: {
        imgClick(img) {
            wx.previewImage({
                urls: this.imgs,
                current: img
            })
        }
    }
}
</script>

<style scoped>
/* // 指示点样式 */
.swiper /deep/ .wx-swiper-dot{ 
  height: 4rpx;
  width: 14rpx;
  border-radius: 0;
  background:rgba(0,0,0,1);
  }
/* // 当前指示点样式 */
.swiper /deep/ .wx-swiper-dot-active{
  height: 4rpx;
  width: 14rpx;
  border-radius: 0;
  background:rgba(220,53,56,1);
}

.container {
    position: relative;
    height: 370rpx;
    z-index: 1;
}

.test-load {
    position: absolute;
    left: -100vh;
    top: -100vw;
}

.container::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 20rpx;
    background: linear-gradient(0deg, rgba(0, 0, 0, .1), transparent);
}

swiper-item {
    text-align: center;
}

swiper, image {
    height: 370rpx;
}
</style>