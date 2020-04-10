import qs from "qs"
import fly from "@/lib/http"
import jump from '@/common/lib/jump'
import user from '@/lib/user'
import utils from "@/lib/util"
import embed from "@/lib/data_embedding"
import mixin from "@/mixin/mixin"
import GoodsItem from "@/components/member/goods_item"
import ToIndex from "@/components/common/to_index"
import MemberOpenBtn from '@/components/member/member_open_btn'
import MemberInfo from '@/components/member/member_info'
import MemberRight from '@/components/member/member_right'
import nav from "@/lib/navigator"
import Auth from '@/components/common/auth'

import { mapState } from 'vuex'

const FUNCTIPSHOW = 'func_tip_show'

export default {
    mixins: [mixin],
    components: {
        GoodsItem,
        ToIndex,
        MemberOpenBtn,
        MemberInfo,
        MemberRight,
        Auth
    },
    data () {
        return {
            user: {}, //当前页用户
            scrollTop: 0, //页面滚动高度
            orders: [], //商品列表,
            note: ['¥0.99试用1个月', '续费','¥119开通年卡'],
            login: '登录',
            orderParams: {},
            rightSwitch: true,
            rightSwitchIcon: 'https://img-ali.xiaohongchun.com.cn/admin/154778577953813dd17f.png',
            showFuncTip: true,
            memberTypeShow: '',
            showShareMask: false,
            friendCardCode: '',
            newsNum:''

        }
    },
    methods: {
        async fetchUser () {
            let res = await fly.get('/lsj/v3/member')
            this.user = res.data
            if(this.user){
                // this.user.economy_money = (this.user.economy_money*1.0).toFixed(2)
                this.user.average_save_money = (this.user.average_save_money*1.0).toFixed(2)
                
                let textArr = ['天天会员','天天体验会员','闺蜜卡会员']
                this.memberTypeShow =  textArr[this.user.member_level] ? textArr[this.user.member_level] : ''
                this.rightSwitch = this.user.member_level > 0 ? true : false

                this.getFriendCardCode()
        
            }
        },
        async fetchList () {
            let res = await fly.get('/lsj/v3/member/recommend')
            this.orders = res.data
            
        },
        //开通续费页
        async openMember () {
            if(this.orderParams && this.orderParams.sn){
                //确认订单
                jump.redirectTo('member_open', this.orderParams)
            }else{
                jump.navigateTo('member_open')
            }
        },
        //商品详情页
        toGoHandle(item, event){
            jump.navigateTo('disclosure', {gdid: item.id}, event)
        },
        //会员在线客服页
        toService () {
            jump.navigateTo('contact_service')
        },
        //会员开通记录页
        toOpenList () {
            if (this.user.member) {
                let token = wx.getStorageSync('lsj_userToken')
                jump.navigateTo('web_view', {
                    url: '/member/open_record?token=' + token.token,
                    webPage: true,
                    notShare: true
                })
            }
            return
        },
        //会员常见问题页
        toQuestion () {
            jump.navigateTo('web_view', {
                url: '/member/intro',
                webPage: true,
            })
        },
        //会员权益页
        toMemberRights () {
            jump.navigateTo('web_view', {
                url: '/member/member_rights',
                webPage: true,
            })
        },
        // 隐藏tabbarreddot
        async hideTabBarRedDot() {
            const TABBARREDDOT = 'tabbar_reddot'
            wx.setStorage({
                key: TABBARREDDOT,
                data: true,
                success: function (res){
                    wx.hideTabBarRedDot({index:1})
                }
            })
        },
        // 会员权益开关
        setRightSwitch() {
            if (this.rightSwitch) {
                this.rightSwitch = false
                this.rightSwitchIcon = 'https://img-ali.xiaohongchun.com.cn/admin/154778577953813dd17f.png'
            } else {
                this.rightSwitch = true
                this.rightSwitchIcon = 'https://img-ali.xiaohongchun.com.cn/admin/154778572453124c20403.png'
            }
        },
        // 调起电话拨打
        toPhoneCall() {
            wx.makePhoneCall({
                phoneNumber: '02363414320'
            })
        },
        toMemberCalculator() {
            wx.setStorage({
                key: FUNCTIPSHOW,
                data: false,
            })
            jump.navigateTo('member_calculator', {is_from_share: 0})
        },
        funcTipShow () {
            const value = wx.getStorageSync(FUNCTIPSHOW)
            return value === '' ? true : false
        },
        cardShare() {
            if(this.user.gave_count == 0) return
            this.showShareMask = true
        },
        friendCardRecord() {
            jump.navigateTo('web_view', {
                url: '/member/friend_card/record',
                webPage: true,
                notShare: false
            })
        },
        async getFriendCardCode() {
            if(this.user.member && !this.user.member_overdue && this.user.member_level == 0 && this.user.gave_count > 0) {
                let resp = await fly.post('/lsj/v3/member/give_lady_bro')
                if(resp.data) {
                    this.friendCardCode = resp.data.random_id
                    console.log(this.friendCardCode);
                    
                }
            }
        },
        // 显示消息
        setMsgRedDot() {
            wx.setTabBarBadge({
                index: 2,
                text: this.newsNum,
            })
        },
        // 移除消息
        removeTabBarBadge() {
            wx.removeTabBarBadge({
                index: 2,
            });
        }
        
    },
    async onTabItemTap(item) {
        let resp = await fly.get(`/lsj/v3/user/server_config`)
        resp = resp.data
        this.newsNum = resp.message_num
        if (item.index == 1 && this.newsNum != 0) {
            this.setMsgRedDot()
        }
    },
    onPageScroll(e){
        this.scrollTop = e.scrollTop
    },
    async onLoad () {
        let resp = await fly.get(`/lsj/v3/user/server_config`)
        resp = resp.data
        this.newsNum = resp.message_num
        if (this.newsNum != 0) {
            this.setMsgRedDot()
        } else {
            this.removeTabBarBadge()
        }
    },
    onShow () {

        this.orderParams = {sn:nav.page().options.sn, asn:nav.page().options.asn, address_id: nav.page().options.address_id}
        this.fetchUser()
        this.fetchList()
        this.hideTabBarRedDot()
        this.showFuncTip = this.funcTipShow()
    },
    computed: {
        activityTime () {
            return this.user.activity_endtime > Date.parse(new Date())
        },
        memberEndTime () {
            
            return ! this.user.member_overdue  
        },
        restTime () {
            let date = new Date(this.user.member_endtime)
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} 到期`
        }
    }, 
    onShareAppMessage (res) {
        const shareCode = utils.uuid()
        const params = {
            share_code: shareCode
        }
        embed.reportShareIncrement({
            type: 'member',
            share_code: shareCode
        })
        // 闺蜜卡分享信息设置
        if(this.user.member && !this.user.member_overdue && this.user.member_level == 0 && this.user.gave_count > 0) {
            if(this.friendCardCode) {
                params.url = `https://${process.env.NODE_ENV == 'development' ? 'dev' : 'www'}.xiaohongchun.com.cn/member/friend_card/receive/${this.friendCardCode}`
            }
            return {
                title: `你的土豪朋友@${this.user.nick} 送给你一张“天天跟我买”闺蜜卡！`,
                imageUrl: 'https://img-ali.xiaohongchun.com.cn/admin/1562055329765140309fe.png',
                path: 'pages/web_view?'+ qs.stringify(params)
            }
            
        }else {
            return {
                title: '开通天天会员，立享9大专属特权',
                path:'pages/member/main?'+ qs.stringify(params)
            }
        }
        
    }
}