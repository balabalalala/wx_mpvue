<template>
    <div class="search-container fixed"> 
        <!-- <div :class="['sign-in-container', isSigned ? 'signed' : 'sign']" @click="jump('sign_earn_coin')" data-name="searchbar_sign_in"></div> -->
        <div :class="['sign-in-container', 'signed']" @click="jump('sign_earn_coin')" data-name="searchbar_sign_in"></div>
        <div class="input-container" @click="jump('search')" data-name="search">{{searchText}}</div>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'
import moment from 'moment'
export default {
    props: {
        searchText: {
            type: String,
            default:''
        }
    },
    data () {
        return {
            isSigned: false
        }
    },
    mounted () {
        /*
        if(Date.now() > wx.getStorageSync('searchbar_sigin_timeout')){
            this.isSigned = false
        }else {
            this.isSigned = true
        }
        */
    },
    methods: {
        jump(page) {
            let params = {}
            if(page === 'search') params = {keyword: this.searchText}
            //} else {
            //    wx.setStorageSync('searchbar_sigin_timeout', moment().endOf("day").valueOf())
            //}
            jump.navigateTo(page, params)
        }
    }
}
</script>

<style scoped>
.search-container {
    box-sizing: border-box;
    width: 100%;
    padding: 10rpx 30rpx 20rpx 30rpx;
}
.input-container {
    box-sizing: border-box;
    height: 68rpx;
    line-height: 68rpx;
    padding-left: 80rpx; 
    margin-right: 75rpx;
    background: rgba(255, 255, 255, .7) url(https://img-ali.xiaohongchun.com.cn/admin/15659391158591bf54f8.png) 20rpx center no-repeat;
    background-size: 36rpx 36rpx;
    background-color: #F1F1F1;
    font-size: 26rpx;
    color:#808080;
}
.sign-in-container {
    float: right;
    width: 65rpx;
    height: 65rpx;
    border-radius: 8rpx;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 42rpx 42rpx;
}
.sign {
    background-image: url(https://img-ali.xiaohongchun.com.cn/admin/15659393677501e91123.png)
}
.signed {
    background-image: url(https://img-ali.xiaohongchun.com.cn/admin/15659393677501e91123.png)
}
.fixed {
    position: fixed;
    top: -1rpx;
    left: 0;
    background-color: rgba(255,255,255,1);
    z-index: 8;
}
</style>
