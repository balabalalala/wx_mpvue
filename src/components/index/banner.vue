<template>
    <div class="banner-container">
        <div class="top-banner">
            <image
                mode="widthFix"
                v-for="(item, index) in topImgs"
                :key="index"
                :src="item.icon"
                :data-name="'h_icon_'+ item.name"
                :data-track_info="item.track_info"
                @click="toDetail(item.url, $event)" />
        </div>
        <div class="bottom-banner">
            <template v-if="!model">
                <image
                    mode="widthFix"
                    v-for="(item, index) in bottomImgs"
                    :key="index"
                    :src="item.icon"
                    :data-name="'h_icon_'+ item.name"
                    :data-track_info="item.track_info"
                    @click="authAction(item, $event)"
                />
            </template>
            <template v-else>
                <div 
                    class="bottom-banner"
                    v-for="(item, index) in bottomImgs"
                    :key="index"
                    :style="'background-image:url(' + item.icon + ');height:' + item.rate * formatWidth + 'rpx;background-size:'+ formatWidth + 'rpx ' + formatWidth * item.rate + 'rpx' "
                    :data-name="'h_icon_'+ item.name"
                    :data-track_info="item.track_info"
                    @click="authAction(item, $event)"
                ></div>
            </template>
        </div>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'
import user from '@/lib/user'
import { getKeyByUrl, getQuery } from '@/common/lib/pages'
import { mapMutations } from 'vuex'
export default {
    props:{
        topImgs: {
            type: Array,
            default: []
        },
        bottomImgs: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            width: 0,
            model: false  //适配iphonex
        }
    },
    computed: {
        formatWidth () {
            return Math.ceil(this.width * 0.25)
        }  
    },
    methods: {
        ...mapMutations(['toggleAuth', 'setAuthName']),
        toDetail (url, e) {
            //不是h5直接 直接跳转
            let params = getQuery(url)
            if(url.indexOf('web_view') < 0) return jump.navigateTo(getKeyByUrl(url), params, e)
            let token = wx.getStorageSync('lsj_userToken')
            if(token && url.indexOf('/article/' !== -1)){
                params.url = params.url + '?token=' + token.token
            }
            jump.navigateTo(getKeyByUrl(url), params, e)
        },
        authAction(item, e) {
            let needauth = item.id == 202 || item.id == 201
            if(!user.isLogin() && needauth) {
                this.setAuthName(item.name)
                return this.toggleAuth()
            }
            this.toDetail(item.url, e)
        }
    },
    mounted () {
        let that  = this
        wx.getSystemInfo({
            success(res) {
                that.width = res.windowWidth * 2
                that.model = res.model.indexOf('iPhone X ') != -1 
            }
        })
    }
}
</script>

<style scoped>
.banner-container {
    width: 100%;
    margin: 94rpx 0 0 0;
}
.top-banner, .bottom-banner {
    width: 100%;
    overflow: hidden;
}
.top-banner image {
    width: 33.3%;
    float: left;
}
.bottom-banner div{
    width: 25%;
    float: left;
    background-repeat: no-repeat;
}
.bottom-banner image {
    width: 25%;
    float: left;
    background-repeat: no-repeat;
}
</style>
