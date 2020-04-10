<template>
    <div class="cabbage-label">
        <div class="container">
            <div class="cabbage-intro">
                <img class="intro-img" :src="tagInfo.tag_image">
                <div class="cabbage-detail">
                    <div class="cabbage-title">{{tagInfo.tag_name}}</div>
                    <div class="cabbage-describe">
                            {{tagInfo.desc}}
                    </div>
                </div>
            </div>
            <div @click="onclick" :data-name="tagInfo.result ? 'cabbage_unsub' : 'cabbage_sub'"  :class="['subscribe-container', tagInfo.result ? 'subscribed-btn' : 'subscribe-btn']">
            </div>
        </div>
        <div class="division"></div>
        <auth />
    </div>
</template>
<script>
import jump from '@/common/lib/jump'
import fly from "@/lib/http"
import user from "@/lib/user"
import Auth from '@/components/common/auth'
import { mapMutations } from 'vuex'

export default {
    props:['tagInfo'],
    components:{Auth},
    methods:{
        ...mapMutations(['toggleAuth', 'setAuthName']),
        onclick() {
            if(!user.isLogin()) {
                this.setAuthName('cabbage_subscribe')
                return this.toggleAuth()
            }
            this.tagInfo.result ? this.unsub() : this.sub()
        },

        unsub() {
            fly.delete("/lsj/v3/favorite?id=" + this.tagInfo.id)
                .then(() => this.tagInfo.result = false)
                wx.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 1500
                })            
        },

        sub() {
            fly.post('/lsj/v3/favorite', {
                eid: this.tagInfo.eid,
                e_type: 4
            })
            .then(resp => {
                this.tagInfo.result = true
                this.tagInfo.id = resp.data.id
            })
            wx.showToast({
                title: '订阅成功',
                icon: 'none',
                duration: 1500
            })   

        }
    }
}
</script>
<style scoped>
.cabbage-label{
    position: relative;
    z-index: 1;
}
.container{
    position: relative;
    width: 100%;
    /* height: 290rpx; */
    box-sizing: border-box;
    padding: 44rpx 40rpx 44rpx 40rpx;
    background:rgba(255,255,255,1);
    border-top: 1rpx solid #F5F5F5;
    box-shadow:0rpx 4rpx 9rpx 0rpx rgba(93,0,5,0.03);
    overflow: hidden;
}
.cabbage-intro{
    overflow: hidden;
}
.intro-img{
    float: left;
    display: inline-block;
    width: 120rpx;
    height: 120rpx;
}
.cabbage-detail{
    padding-left: 21rpx;
    overflow: hidden;
}
.cabbage-detail .cabbage-title{
    font-size:28rpx;
    font-weight:500;
    color:rgba(26,26,26,1);
    margin-top: 10rpx;
    line-height:1;
}
.cabbage-detail .cabbage-describe{
    font-size:24rpx;
    font-weight:300;
    color:rgba(76,76,76,1);
    margin-top: 10rpx;
    line-height:34rpx;
}
.subscribe-container{
    width:130rpx;
    height:54rpx;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 34rpx;
}
.subscribed-btn{
    background-image: url(https://img-ali.xiaohongchun.com.cn/admin/1571304735083d4842c3.png)
}
.subscribe-btn{
    background-image: url(https://img-ali.xiaohongchun.com.cn/admin/15713047275311ff31536.png)
}
/* .division{
    width: 100%;
    height: 10rpx;
    background:rgba(255,255,255,1);
} */
</style>


