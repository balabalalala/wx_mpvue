import _ from 'underscore'
import qs from 'qs'
import util from '@/lib/util'
import embed from '@/lib/data_embedding'
import mixin from "@/mixin/mixin"
import fly from "@/lib/http"
import jump from "@/common/lib/jump"
import user from "@/lib/user"
import moment from 'moment'
import searchBar from '@/components/index/search_bar'
import banner from '@/components/index/banner'
import rankingList from '@/components/index/ranking_list'
import collectToast from '@/components/index/collect_toast'
import channel from '@/components/index/channel'
import goods from '@/components/index/goods'
import noGoods from '@/components/index/noMoreData'
import loading from '@/components/common/loading'
import float from '@/components/common/floating_window'
import popupWindows from '@/components/index/popup_windows'
import toTop from '@/components/common/to_top'
import Auth from '@/components/common/auth'
import selectLabel from '@/components/index/select_label'
let pageMark =  0
let pageSize = 20
let channelTop = 0
import {mapGetters, mapMutations} from 'vuex'
export default {
    data () {
        return {
            currentChannelIndex: 0,
            noMoreData: false,
            isLoading: true,
            // channels: [],
            newChannels:[],
            homeMalls:[],
            rankGoodsList: [],
            goodsList: null,
            searchText: '',
            floatList: [],
            fadeOut: false,
            alertData: null,
            modalShow: false,
            rankTitle: {},
            topBanner: [],
            bottomBanner: [],
            scrollTop: 0,
            isTabListFixed: false,
            windowHeight: 0,
            isAndroid: false,
            avoidSecondLoad: false,
            isCollcetToastShow: false,
            isCollcetToastText: '',
            selectPlaceholderHeight: 0,
            currentNewChannel:{},
            currentMalls: [],
            hideSelectedBox: false,
            audit_switch: '1',
            newsNum:'',//消息数
            isShowFloatWindow: true
        }
    },

    components: {
        searchBar, banner, rankingList, channel, goods, noGoods, loading, float, popupWindows, toTop, Auth, collectToast, selectLabel
    },

    mixins: [mixin],

    methods: {
        ...mapMutations(['setShowIndexSelectBox']),
        toSubscribe() {
            jump.navigateTo('my_subscribe')
        },

        modalShowHandle () {
            this.modalShow = false
        },
        
        search(...arg) {
            this.currentNewChannel = arg[0]
            this.currentMalls = arg[1]
            pageMark = 0;
            this.noMoreData = false;
            this.isLoading = true;
            this.goodsList = [];
            this.avoidSecondLoad = true
            if (this.isTabListFixed) {
                wx.pageScrollTo({
                    scrollTop: 0
                })
            }
            this.getGoods(true)
        },

        async getIndexData () {
            // banner 审核临时数据
            let tmpHeadBarsOne = [
                {
                    "id": 270,
                    "name": "Grow Gorgeous二免一",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/156629043945712480594.png-big3x.jpg",
                    "url": "/pages/disclosure/main?gdid=180132",
                    "track_info": "b@head_bars;p@0;e@Grow Gorgeous二免一;e1@article;e2@642;",
                    "rate": 0.99
                },
                {
                    "id": 271,
                    "name": "THE HUT攻略",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/15662088952322cce071c.png-big3x.jpg",
                    "url": "/pages/disclosure/main?gdid=179104",
                    "track_info": "b@head_bars;p@1;e@THE HUT攻略;e1@article;e2@622;",
                    "rate": 0.99
                },
                {
                    "id": 272,
                    "name": "值疯了0820",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/156861553587729a5c338.png-big3x.jpg",
                    "url": "/pages/disclosure/main?gdid=180104",
                    "track_info": "b@head_bars;p@2;e@值疯了0820;e1@activity;e2@437;",
                    "rate": 0.99
                }
            ]

            let tmpHeadBarsTwo = [
                {
                    "id": 273,
                    "name": "今日特价",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/156629034144512679477.png-big3x.jpg",
                    "url": "/pages/disclosure/main?gdid=180123",
                    "track_info": "b@head_bars;p@3;e@今日白菜0820;",
                    "rate": 0.72
                },
                {
                    "id": 274,
                    "name": "优惠券",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/15651934211582090969b.png-big3x.jpg",
                    "url": "/pages/disclosure/main?gdid=180125",
                    "track_info": "b@head_bars;p@4;e@优惠券;",
                    "rate": 0.71
                },
                {
                    "id": 283,
                    "name": "新人专区",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/1565193432637db44076.png-big3x.jpg",
                    "url": "/pages/disclosure/main?gdid=180143",
                    "track_info": "b@head_bars;p@5;e@新人专区;",
                    "rate": 0.71
                },
                {
                    "id": 284,
                    "name": "我的订阅",
                    "icon": "https://img-ali.xiaohongchun.com.cn/admin/15651934430203586c73c.png-big3x.jpg",
                    "url": "/pages/my_subscribe/main",
                    "track_info": "b@head_bars;p@6;e@我的订阅;",
                    "rate": 0.72
                }
            ]

            let res = await fly.get('/lsj/v3/home/platform');
            res = res.data;
            this.rankGoodsList = this.audit_switch == '1' ? res.goods_ranks : res.goods_ranks.filter(item => item.type == 0);
            let paramsMall = []
            for(let key in this.params) {
                if(key.indexOf('mall') != -1 || key.indexOf('area') != -1) {
                    paramsMall.push(this.params[key])
                }
            }

            this.homeMalls = res.home_malls.map((item, index) => {
                if(this.params.mall || this.params.area) {
                    item.checked = paramsMall.some(paramItem => paramItem == item.title)
                } else {
                    item.checked = index ? false : true
                }
                return item
            })

            if(this.audit_switch == '0') this.homeMalls = this.homeMalls.filter(item => item.title != '天猫')

            this.newChannels = res.new_channels.map((item, index) => {
                if(this.params.category || this.params.price_tag) {
                    item.checked = item.title == (this.params.category || this.params.price_tag) 
                } else {
                    item.checked = index ? false : true
                }
                return item
            })
            
            this.currentNewChannel = this.newChannels.filter(item => item.checked)[0]
            this.currentMalls = this.homeMalls.filter(item => item.checked)
            this.searchText = res.placeholder;
            this.rankTitle = res.today_rank_words;
            if(this.audit_switch == '1') {
                this.topBanner = res.head_bars_one;
                if(this.currentMalls.length == 1 && this.currentMalls[0].type == 'all') {
                    wx.getStorageSync('select_mall') && wx.removeStorageSync('select_mall')
                } else {
                    wx.setStorage({
                        key: 'select_mall',
                        data: this.currentMalls
                    })
                }
                res.head_bars_two.forEach(item => {
                    if(item.url.indexOf('web_view') != -1) {
                        item.url = item.url + `&trank_info=`+ item.track_info
                    }
                })
                this.bottomBanner = res.head_bars_two;
            }else {
                this.topBanner = tmpHeadBarsOne
                this.bottomBanner = tmpHeadBarsTwo
            }

            await this.activityModalShow(res.new_user, res.alert_data);
            this.setActivityModal()
            
        },

        getGoodsUrl () {
            let url, channel , mallParams = '' 
            if(this.currentNewChannel.id)  channel = `${this.currentNewChannel.type}=${this.currentNewChannel.id}` 
            this.currentMalls.forEach(item => {
                if(item.type == 'all') return  
                mallParams = mallParams ? mallParams + '&' + `${item.type}=${encodeURI(item.title)}` : `${item.type}=${encodeURI(item.title)}`
            })
            if (!channel && mallParams) return url = `/lsj/v3/search/${this.audit_switch == '1' ? 'home_list' : 'home_lists'}?${mallParams}&page_mark=${pageMark}`
            if (channel && !mallParams) return url = `/lsj/v3/search/${this.audit_switch == '1' ? 'home_list' : 'home_lists'}?${channel}&page_mark=${pageMark}`
            if (!channel && !mallParams) return url = `/lsj/v3/search/${this.audit_switch == '1' ? 'home_list' : 'home_lists'}?page_mark=${pageMark}`
            return url = `/lsj/v3/search/${this.audit_switch == '1' ? 'home_list' : 'home_lists'}?${channel}&${mallParams}&page_mark=${pageMark}`
        },

        async getGoods (reset) {
            this.isLoading = true
            let url = await this.getGoodsUrl() 
            let res = await fly.get(url);
            res = res.data
            pageMark = res.page_mark
            if(reset) {
                this.goodsList = res.result
            } else {
                this.goodsList.push(...res.result)
            }
            if(this.avoidSecondLoad) this.avoidSecondLoad = false
            if(res.result.length < 20) {
                this.isLoading = false
                this.noMoreData = true
            }
        },

        setFadeOut: _.debounce(function(e) {
            this.fadeOut = false
        }, 2000),

        //首页弹窗是否显示
        activityModalShow(newUser, alertData) {
            if (newUser) {
                this.alertData = {
                    index_img: "https://img-ali.xiaohongchun.com.cn/admin/15516899860381eb5f011.gif",
                    url: "/pages/new_red_envelope/main",
                    track_info: alertData && alertData.track_info
                }
            } else {
                this.alertData = alertData;
            }

            let timeOut
            try{
                timeOut = Number(wx.getStorageSync('activity_timeout_new'));
                if(!timeOut || Date.now() > timeOut) {
                    this.modalShow = this.alertData && this.alertData.url ? true : false
                }
            } catch(e) {
                console.log(e)
            }
        },

        async loadCallback() {
            pageMark = 0;
            await this.getIndexData()
            await this.getGoods(true)
            //获取设备型号，吸顶两端兼容
            const res = wx.getSystemInfoSync()
            this.isAndroid = res.system.indexOf('Android') > -1
            let scrollExtraHeight = 96 / ( 750 / res.windowWidth )
            setTimeout(()=> {
                const query = wx.createSelectorQuery();
                query.select("#channelBox").boundingClientRect(rect => {
                    channelTop = Math.ceil(rect.top - scrollExtraHeight)
                    this.selectPlaceholderHeight = rect.height
                }).exec();
            }, 200)
        },

        // channel吸顶判断
        
        getRect(scrollTop) {
            if (scrollTop >= channelTop) {
                this.isTabListFixed = true
            } else if(scrollTop < channelTop) {
                this.isTabListFixed = false
            }
        },
        
        scrollCallback : _.throttle(function(e){
            this.scrollTop = e.scrollTop
            if(this.showIndexSelectBox) this.hideSelectedBox = true
            if(!this.fadeOut) {
                this.fadeOut = true
            } else {
                this.setFadeOut()
            }
        }, 150),

        async pullNewData () {
            if(this.noMoreData) return
            this.isLoading = true
            this.noMoreData = false
            pageMark = 0 
            this.goodsList = []
            this.getGoods(true)
        },

        //设置首页弹窗
        setActivityModal () {
            wx.setStorage({
                key: 'activity_timeout_new',
                data: moment().endOf('day').valueOf().toString()
            })
        },

        setCollectToast() {
            // 收藏小程序按钮逻辑
            let cachedCollectValue = wx.getStorageSync('collect_toast_cache')
            var todayNum = new Date().getDate()
            if(!cachedCollectValue || (cachedCollectValue && todayNum == 1 && cachedCollectValue != todayNum)){
                this.isCollcetToastShow = true
                this.isCollcetToastText = '收藏我，好价随时看'
                return
            }
            if(
                (todayNum == 2 && cachedCollectValue != todayNum) || 
                (cachedCollectValue != todayNum && moment().isBefore('2019-08-01'))
            ){
                this.isCollcetToastShow = true
                this.isCollcetToastText = '设置“浮窗”，快速获取好价~'
            }
        },

        setShareParams() {
            let params = ''
            if(this.currentNewChannel['type'] != 'all') params += `${this.currentNewChannel.type}=${this.currentNewChannel.title}` 
            let type, index = 0
            this.currentMalls.forEach(item => {
                if(item.type == 'all') return
                type == item.type ? index++ : index = 0
                type = item.type
                params = params ? params + `&${item.type}${index ? index : ''}=${item.title}` : `${item.type}${index ? index : ''}=${item.title}`
            })
            return params
        },
        
        setShareTitle() {
            if(this.currentMalls[0].type == 'all' && this.currentNewChannel['type'] != 'all') 
                return '天天跟我买——' + `${this.currentNewChannel['title']}` + '频道'
            if(this.currentNewChannel['type'] == 'all' && this.currentMalls.length == 1 && this.currentMalls[0].type != 'all') 
                return '天天跟我买——' + `${this.currentMalls[0].title}` + '频道'
            return ''
        },

        changeHideEvent() {
            this.hideSelectedBox = false
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
        },
        filterBoxChange(params) {
            this.isShowFloatWindow = ! params.status
            console.log(this.isShowFloatWindow);
        }
    },
    computed: {
        ...mapGetters(['showIndexSelectBox']),
        currentChannel() {
            if (!this.channels) return "";
            return this.channels[this.currentChannelIndex] || {};
        }
    },

    onPageScroll (e) {
        if(!this.isAndroid) {
            this.getRect(e.scrollTop)
        }
        this.scrollCallback(e) 
    },
    async onTabItemTap(item) {
        let resp = await fly.get(`/lsj/v3/user/server_config`)
        resp = resp.data
        this.newsNum = resp.message_num
        if (item.index == 0 && this.newsNum != 0) {
            this.setMsgRedDot()
        }
    },
    
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
        this.pullNewData();
    },
    
    onReachBottom() {
        if(this.noMoreData) return;
        if(this.avoidSecondLoad) return
        this.getGoods(false)
    },

    onShareAppMessage() {
        const shareCode = util.uuid();
        let params = this.setShareParams() 
        params = params ? params + `&share_code=${shareCode}` : `share_code=${shareCode}`
        let shareTitle = this.setShareTitle()
        embed.reportShareIncrement({
            type: "home",
            share_code: shareCode
        })
        return {
            title: shareTitle,
            path: `pages/index/main?${params}`
        }
    },

    async onLoad(params) {
        // 动态更换tabbar
        let resp = await fly.get(`/lsj/v3/user/server_config`)
        resp = resp.data
        this.newsNum = resp.message_num
        let activityImg = resp.tabbar_image
        if (activityImg.tabbar_image_app_enable == 1) {
            wx.setTabBarItem({
                index: 0,
                iconPath: activityImg.tabbar_home,
                selectedIconPath: activityImg.tabbar_home_select,
            })
            wx.setTabBarItem({
                index: 1,
                iconPath: activityImg.tabbar_member,
                selectedIconPath: activityImg.tabbar_member_select,
            })
            wx.setTabBarItem({
                index: 2,
                iconPath: activityImg.tabbar_mine,
                selectedIconPath: activityImg.tabbar_mine_select,
            })
        }
        if (this.newsNum != 0){
            this.setMsgRedDot()
        } else {
            this.removeTabBarBadge()
        }
        // 首页审核开关逻辑
        const misc = await fly.get(`/lsj/v3/misc?key=audit_switch_0926`)
        this.audit_switch = misc.data ? misc.data.prop_value : '1'

        this.params = params
        let token = wx.getStorageSync('lsj_userToken').token
        if(!token) {
            getApp().globalData.events.trigger('login')
        }
        if(user.isLogin()) {
            this.loadCallback()
            this.setCollectToast()
        } else {
            getApp().globalData.events.on('login', () => {
                this.loadCallback()
                this.setCollectToast()
            })
        }
    },

    onUnload() {
        pageMark =  0
        pageSize = 20
        channelTop = 0
        if(wx.getStorageSync('select_mall')) wx.removeStorageSync('select_mall')
        Object.assign(this.$data, this.$options.data())
    }
}