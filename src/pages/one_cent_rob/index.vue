<template>
    <form report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div v-if="!isLoad" class="loading-box" >
                <loading ></loading>
            </div>

            <div v-if="isLoad" class="one-cent-rob">
                <div class="rob-info">
                    <div class="help-content">
                        <div v-if="isLogin && oneCents.identity === 1 && oneCents.states === 1 && oneCents.surplus_num > 0 && (nowTime < oneCents.end_time)" class="help-people">还需要 <span>{{oneCents.surplus_num}}</span> 位好友助力</div>
                        <div v-if="isLogin && oneCents.identity === 1 && oneCents.states === 1 && (nowTime < oneCents.end_time)" class="rest-time">还剩 <span>{{hours}}</span> 时 <span>{{minutes}}</span> 分 <span>{{seconds}}</span> 秒</div>
                        <div v-if="isLogin && oneCents.identity === 1 && oneCents.states === 2" class="help-complete">助力完成， 恭喜您获得抽奖资格！</div>
                        <div v-if="isLogin && oneCents.identity === 1 && oneCents.states === 4 && (nowTime > oneCents.end_time)" class="help-failed">规定时间内助力不成功</div>
                        <div v-if="isHelpBtn && isLogin && oneCents.identity === 2 && oneCents.states === 1 && oneCents.is_help && (nowTime < oneCents.end_time)" class="help-success">助力好友成功！</div>
                        <div v-if="isHelpBtn && isLogin && oneCents.identity ===2 && oneCents.states === 2 &&  ( (oneCents.is_help && (nowTime > oneCents.end_time)) ||  (nowTime < oneCents.end_time) )" class="help-finish">本次助力已完成</div>
                        <div v-if="isLogin && ((oneCents.identity === 2 && (nowTime > oneCents.end_time) && !oneCents.is_help) || (oneCents.identity === 2 && (nowTime > oneCents.end_time) && oneCents.is_help && (oneCents.states === 4)))" class="help-end">本期助力活动已结束</div>
                        <div v-if="(!oneCents.is_help) && oneCents.identity === 2 && oneCents.states === 1"  class="help-btn">
                            <userinfo-auth @authed="toHelpFriend" note="点击助力好友"></userinfo-auth>
                        </div>
                        <div v-if="(isLogin && oneCents.identity === 1 && (( oneCents.states ===1 && (nowTime < oneCents.end_time) )|| oneCents.states === 2 || oneCents.states === 4)) || (oneCents.identity ===2 && isLogin && oneCents.identity === 2 && oneCents.states === 1 && oneCents.is_help)  || (isLogin && oneCents.identity ===2 && oneCents.states === 2)" class="user-list">
                            <img class="help-user" v-for="item in oneCents.user_images" :key="item" :src="item"/>
                            <span class="help-user" v-for="number in oneCents.surplus_num" :key="number">等待</span>
                        </div>
                        <button v-if="isLogin && oneCents.identity === 1 && oneCents.states === 1 && (nowTime < oneCents.end_time) && oneCents.surplus_num > 0" open-type="share" class="invite-friends">邀请好友助力</button>
                    </div>
                    <div class="rob-goods" :style="((!oneCents.is_help) && oneCents.identity === 2 && oneCents.states === 1) ? 'position: absolute; top: 0; left: 50%; margin-left: -349rpx'  : '' ">
                        <goods-item :data-track_info="oneCentGoodConfig.track_info" @toGo="toGoHandle(oneCents.one_point, $event, 1)" :toGo="oneCentGoodConfig.toGo" :goodsImg="oneCentGoodConfig.goodsImg" :expire="oneCentGoodConfig.expire" :icon="oneCentGoodConfig.icon" :keynoteBg="oneCentGoodConfig.keynoteBg" :keySecondary="oneCentGoodConfig.keySecondary" :bottomKey="oneCentGoodConfig.bottomKey"  :bottomSecondary="oneCentGoodConfig.bottomSecondary"></goods-item>
                    </div>
                </div>
                <div class="goods-list">
                    <img class="goods-title" src="https://img-ali.xiaohongchun.com.cn/admin/1533694872692251215d6.png"/>
                    <div class="goods-info" v-for="(item, index) in oneCentGoodsConfig" :key="item" >
                        <goods-item :data-track_info="item.track_info" @toGo="toGoHandle(item, $event, 2)" :toGo="item.toGo" :goodsImg="item.goodsImg" :radius="item.radius" :expire="item.expire" :icon="item.icon" :keynoteBg="item.keynoteBg" :keySecondary="item.keySecondary" :centerKeynote="item.centerKeynote" :bottomKeyButton="item.bottomKeyButton"></goods-item>
                        <div class="border-line" v-if="index !== (oneCentGoodsConfig.length-1)"></div>
                    </div>
                </div>
                <div class="goods-list">
                    <img class="goods-title" src="https://img-ali.xiaohongchun.com.cn/admin/153369526588275bb6a4.png"/>
                    <div class="goods-info" v-for="(item, index) in disGoodsConfig" :key="item">
                        <goods-item :data-track_info="item.track_info" @toGo="toGoHandle(item, $event)" :toGo="item.toGo" :goodsImg="item.goodsImg" :expire="item.expire" :icon="item.icon" :title="item.title" :keynote="item.keynote" :secondary="item.secondary" :bottomSecondary="item.bottomSecondary"></goods-item>
                        <div class="border-line" v-if="index !== (disGoodsConfig.length-1)"></div>
                    </div>
                </div>
                <to-index></to-index>
            </div>
        </button>
    </form>
</template>

<script>
    import fly from "@/lib/http"
    import utils from "@/lib/util"
    import user from "@/lib/user"
    import mixin from "@/mixin/mixin"
    import embed from "@/lib/data_embedding"
    import qs from "qs"
    import ToIndex from "@/components/common/to_index"
    import Loading from "@/components/common/loading"
    import GoodsItem from "@/components/common/goods_item"
    import UserinfoAuth from "@/components/common/userinfo_auth"
    import jump from "@/common/lib/jump"
    import nav from "@/lib/navigator"

    export default {
        mixins: [mixin],
        data() {
            return {
                isLoad: false,
                activitySn: '', //活动编号
                oneCents: {},
                disclosures: {},
                oneCentGoodConfig: {},
                oneCentGoodsConfig: [],
                disGoodsConfig: [],
                timer: null,
                nowTime: 0,
                hours: '00',
                minutes: '00',
                seconds: '00',
                isHelpBtn: true,
                isLogin: false,
                isAuth: false, //是否授权过
                isHelp: false, //是否点击了助力好友
                shareTitles: [
                    {
                        type: 1,
                        title: '帮我点点，一起1分赢'
                    },
                    {
                        type: 2,
                        title: '点进来一起赢'
                    },
                    {
                        type: 3,
                        title: '帮我点点，一起1分赢大奖'
                    },
                    {
                        type: 4,
                        title: '点进来一起赢大奖'
                    }
                ],
                currentShare:{
                    type: 0,
                    title: ''
                }
            }
        },
        components: {Loading, ToIndex, GoodsItem, UserinfoAuth},
        methods: {
            countTime() {
                function checkTime(i) {
                    if(i < 10) {
                        i = "0" + i
                    }
                    return i
                }
                let now = Date.now()
                let leftTime = (this.oneCents.end_time - now) / 1000
                let hours = parseInt(leftTime / (60 * 60))
                let minutes = parseInt((leftTime / 60) % 60)
                let seconds = parseInt(leftTime % 60)

                if(hours <= 0 && minutes <= 0 && seconds <= 0) {
                    clearInterval(this.timer)
                    this.timer = null
                    this.hours = '00'
                    this.minutes = '00'
                    this.seconds = '00'
                    return false
                }
                this.hours = checkTime(hours)
                this.minutes = checkTime(minutes)
                this.seconds = checkTime(seconds)

            },
            dealOneCentJson(detail) {
                let item = {}
                item.toGo = true
                item.goodsImg = detail.image_url
                item.expire = (detail.status === -1) ? true : false
                item.icon = (detail.status !==  -1 && (detail.iconSign || detail.icon_sign)) ? true : false
                item.keynoteBg = detail.editor_rec_desc || ""
                item.keySecondary = detail.title || ""
                item.bottomKey = `¥${(detail.price / 100).toFixed(2)}`
                item.bottomSecondary = `来自 ${detail.mall}`

                return item
            },
            dealOneCentJsons(detailList) {
                let list = detailList.map(item=>{
                    item.toGo = true
                    item.goodsImg = item.image_url
                    item.radius = false
                    item.expire = (item.status === -1) ? true : false
                    item.icon = (item.status !==  -1 && (item.iconSign || item.icon_sign)) ? true : false
                    item.keynoteBg = item.editor_rec_desc || ""
                    item.keySecondary = item.title || ""
                    item.centerKeynote = `¥${(item.price / 100).toFixed(2)}`
                    item.bottomKeyButton = "马上抢"

                    return item
                })

                return list
            },
            dealDisclosuresJson(detailList) {
                let list = detailList.map(item=>{
                    item.toGo = true
                    item.goodsImg = item.image_url
                    item.expire = (item.status === -1) ? true : false
                    item.icon = (item.status !==  -1 && (item.iconSign || item.icon_sign)) ? true : false
                    item.title = item.title || ""
                    item.keynote = item.v_detail || item.deal_price || ""
                    item.secondary = item.editor_rec_desc
                    item.bottomSecondary = item.mall + " 发货"

                    return item
                })

                return list
            },
            toGoHandle(item, event, isOneCentRob){
                if(isOneCentRob === 1){
                    jump.navigateTo('disclosure', {gdid: item.id, isActivity: isOneCentRob}, event)
                }else if(isOneCentRob === 2) {
                    jump.navigateTo('disclosure', {gdid: item.id, isActivity: isOneCentRob}, event)
                }else{
                    jump.navigateTo('disclosure', {gdid: item.did}, event)
                }
            },
            async toHelpFriend() {
                this.isHelpBtn = false
                this.isLogin = true
                let activityHelp = await fly.post(`/lsj/v3/boost/lottery/activity_help?activity_sn=${this.activitySn}`)
                this.getJson()
                this.oneCents.is_help = 1
                setTimeout(()=>{
                    this.isHelpBtn = true
                },500)

            },
            async getJson() {
                let [oneCentData, disclosuresData] = await fly.all([
                    fly.get(`/lsj/v3/boost/lottery/help_details?activity_sn=${this.activitySn}`),
                    fly.get(`/lsj/v1/home/rec?page_mark=0&page_size=20`)
                ])
                this.oneCents = oneCentData.data
                this.oneCentGoodConfig = this.dealOneCentJson(this.oneCents.one_point)
                this.oneCentGoodsConfig = this.dealOneCentJsons(this.oneCents.one_point_list)
                this.disclosures = disclosuresData.data.data
                this.disGoodsConfig = this.dealDisclosuresJson(this.disclosures)

                if(user.isLogin()){
                    this.isLogin = true
                }else{
                    this.oneCents.identity = 2
                    this.oneCents.is_help = 0
                    this.oneCents.states = 1
                }

                this.nowTime = Date.now()
                if(this.isLogin && this.oneCents.identity === 1 && this.oneCents.states === 1 && (this.nowTime < this.oneCents.end_time)){
                    this.timer = setInterval(this.countTime, 1000)
                }

                this.isLoad = true
            },
            async fetch() {
                clearInterval(this.timer)
                this.timer = null
                this.getJson()
            },
            randomNumber(m, n){
                let random = Math.floor(Math.random()*(m-n+1)+n)
                return random
            },
            getShareTitle(){
                let title = this.oneCentGoodConfig.keySecondary
                if(title.split("元的").length > 1){
                    this.currentShare.type = this.randomNumber(2, 1)
                    this.currentShare.title = this.shareTitles[this.currentShare.type-1].title + title.split("元的")[1]
                }else{
                    this.currentShare.type = this.randomNumber(4, 3)
                    this.currentShare.title = this.shareTitles[this.currentShare.type-1].title
                }
            }
        },
        onShow(){
            this.activitySn = nav.page().options.activitySn
            this.fetch()
        },
        onHide(){
            this.isLoad = false
        },
        onShareAppMessage(res) {
            const shareCode = utils.uuid()

            //随机生成分享标题
            this.getShareTitle()
            let page = nav.page()
            page.options = Object.assign(page.options, {c_type: this.currentShare.type})


            const helpParams = {
                share_code: shareCode,
                activitySn: this.activitySn,
                c_type: this.currentShare.type
            }

            embed.reportShareIncrement({
                share_code: shareCode,
                type: 'one_cent_rob'
            })

            return {
                title: this.currentShare.title,
                imageUrl: this.oneCentGoodConfig.goodsImg,
                path: "/pages/one_cent_rob/main?" + qs.stringify(helpParams)

            }
        }

    }
</script>

<style scoped>
    .loading-box{
        position: fixed;
        top:50%;
        left:50%;
    }
    .one-cent-rob{
        position: relative;
        z-index: 20;
        margin-top: 35rpx;
    }
    .rob-info{
        position: relative;
        padding-bottom: 33rpx;
    }
    .help-content{
        width: 694rpx;
        min-height: 200rpx;
        background: #fff2ef;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        margin:0 auto;
        padding-top: 68rpx;
        padding-bottom: 64rpx;
        position: relative;
    }
    .help-people{
        font-size: 40rpx;
        text-align: center;
        line-height:100%;
        color:rgba(25,25,25,1);
        font-family:PingFang-SC-Semibold;
        font-weight: bold;
    }
    .help-people span{
        display: inline-block;
        color:##dc3538;
        font-weight: bold;
    }
    .rest-time{
        text-align: center;
        font-size: 26rpx;
        color:rgba(76,76,76,1);
        margin-top: 20rpx;
        font-family:PingFang-SC-Regular;
    }
    .rest-time span{
        display: inline-block;
        width: 40rpx;
        line-height: 30rpx;
        font-size: 32rpx;
        color:##dc3538;
        font-weight: bold;
        background: #fff;
        border-radius: 10rpx;
        padding: 12rpx;
    }
    .user-list{
        margin: 30rpx auto 28rpx;
        display: flex;
        justify-content:center;
    }
    .user-list .help-user:last-child{
        margin-right: 0;
    }
    .user-list img{
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 20rpx;
    }
    .user-list span{
        width: 86rpx;
        text-align: center;
        line-height: 86rpx;
        border-radius: 50%;
        font-size: 24rpx;
        font-weight: 500;
        color: #808080;
        background: #fff;
        margin-right: 20rpx;
    }
    .invite-friends{
        width: 280rpx;
        line-height: 72rpx;
        background:#dc3538;
        text-align: center;
        color: #fff;
        border-radius: 40rpx;
        font-size: 32rpx;
        margin: 30rpx auto 0;
    }
    .help-complete{
        text-align: center;
        font-size: 38rpx;
        color:#dc3538;
        line-height: 100%;
        font-weight: bold;
        font-family:PingFang-SC-Semibold;
        margin-top:60rpx;
    }
    .help-failed{
        text-align: center;
        font-size: 40rpx;
        color: #191919;
        line-height: 100%;
        font-weight: bold;
        font-family:PingFang-SC-Semibold;
        margin-top:60rpx;
    }
    .help-success{
        text-align: center;
        font-size: 38rpx;
        color:#dc3538;
    }
    .help-finish{
        text-align: center;
        font-size: 40rpx;
        color: #191919;
    }
    .help-end{
        text-align: center;
        font-size: 40rpx;
        color: #191919;
    }
    .help-btn{
        width: 284rpx;
        height: 76rpx;
        line-height: 76rpx;
        border-radius: 50rpx;
        overflow: hidden;
        text-align: center;
        background:#dc3538;
        color: #fff;
        margin: 240rpx auto 90rpx;
    }
    .rob-goods{
        width: 692rpx;
        height: 260rpx;
        border: 1rpx solid #f8f8f8;
        border-radius: 20rpx;
        margin: 0 auto;
        background: #fff;

        position: relative;
        margin-top: -14rpx;
    }
    .goods-list{
        border-top: 20rpx solid #f1f1f1;
    }
    .goods-title{
        width: 100%;
        height: 70rpx;
    }
    .goods-info{
        width: 750rpx;
        height: 256rpx;
    }
    .border-line{
        height:1rpx;
        background: #e6e6e6;
        margin-left: 20rpx;
    }
</style>
<style src="@/style/form.css"></style>

