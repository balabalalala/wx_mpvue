<template>
    <form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <auth @authed="authRedirect"/>
            <div class="guide-power">
                <div class="content">
                    <div class="welcome">
                        <p class="guide-title">Hi，新朋友</p >
                        <p class="guide-intro">欢迎来到天天跟我买~聪明小姐姐的薅羊毛神器！</p >
                    </div>
                    <img src="https://img-ali.xiaohongchun.com.cn/admin/155858225346339f2771b.png" class="welcome-img"/>
                    <button data-name="auth-landing-btn" formType="submit" @click="toAuth" class="guide-btn" hover-class="none">欢迎加入天天跟我买</button>
                </div>
            </div>
        </button>
    </form>
</template>

<script>
import jump from '@/common/lib/jump'
import mixin from "@/mixin/mixin"
import user from '@/lib/user'
import Auth from '@/components/common/auth'

import { mapMutations, mapState } from 'vuex'

export default {
    mixins: [mixin],
    components: {Auth},
    methods: {
        ...mapMutations(['toggleAuth', 'setAuthName']),
        toAuth(e) {
            if(!user.isLogin()) {
                let name = e.target.dataset.name 
                this.setAuthName(name)
                return this.toggleAuth()
            }
        },
        async authRedirect() {
            const query = this.$root.$mp.query
            if(query.h5_url) {
                if(user.isLogin()) {
                    jump.redirectTo('web_view', {
                        url: decodeURIComponent(query.h5_url)
                    })
                }
            }else {
                wx.switchTab({url: '/pages/index/main'})
            }
        }
    },
    onLoad() {
        this.authRedirect()
    },
}
</script>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
<style src="@/style/btns.css"></style>

<style scoped>
.guide-power{
    width: 100%;
    min-height: 100vh;
}
.content{
    width: 100%;
    padding: 0 60rpx;
}
.welcome{
    margin-top: 165rpx;
}
.guide-title{
    font-size: 36rpx;
    font-weight:500;
    color:rgba(34,34,34,1);
}
.guide-intro{
    margin-top: 17rpx;
    font-size:30rpx;
    color:rgba(34,34,34,1);
    line-height:31rpx;
}
.welcome-img{
    margin-top:70rpx;
    width:631rpx;
    height:330rpx;
}
.guide-btn{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 362rpx;
    width:480rpx;
    height:76rpx;
    background:#dc3538;
    border-radius:38rpx;
    font-size:30rpx;
    color:rgba(255,255,255,1);
}
</style>
