import fly from "@/lib/http"
import qs from "qs"
import embed from "@/lib/data_embedding"
import pages from "@/lib/pages_config"
import mixin from "@/mixin/mixin"
import jump from "@/common/lib/jump"
import utils from "@/lib/util"
import user from "@/lib/user"
import nav from "@/lib/navigator"
import Loading from "@/components/common/loading"
import ToIndex from "@/components/common/to_index"
import ToTop from "@/components/common/to_top"
import GoodsItem from "@/components/activity_venue/goods_item"
import KillGoods from "@/components/activity_venue/kill_goods"
import DisclosureAlert from "@/components/activity_venue/disclosure_alert"
import DisclosureToast from "@/components/activity_venue/disclosure_toast"
import FieldTitle from "@/components/activity_venue/field_title"

export default {
    mixins: [mixin],
    data() {
        return {
            activityId: 0,
            pagemark: 0,
            needLoad: false,
            noData: false,
            scrollTop: 0,
            selllingGoods: [],
            venues: [],
            currentVenue:0,
            isEnd: false,
            startTip: false,
            threeTip: false,
            disclosureTipShow: false,
            disclosureTipParams: {},
            currentTime: 0
        }
    },
    components: {ToIndex, ToTop, Loading, GoodsItem, KillGoods, DisclosureAlert, DisclosureToast, FieldTitle},
    computed: {
        bannerTime (){
            //根据时间切换显示效果
            //if(Date.now() > new Date("2018/11/11").getTime()){
            if(this.currentTime > new Date("2018/11/11").getTime()){
                return true
            }
        }
    },
    methods: {
        closeDisclosureTip() {
            this.disclosureTipShow = false
        },
        async topBtnHandle(prams) {
            let resp = await fly.post(`/lsj/v3/activity/switch_notify`,{
                "enable":0,
                "eid":prams.did,
                "e_type":1
            })
            this.disclosureTipShow = false

            for(let i=0; i<this.venues.length; i++) {
                let day = this.venues[i]
                if(day.id === prams.fieldItem.parent_id) {
                    for(let j=0; j<day.hour_list.length; j++) {
                        let filed = day.hour_list[j]
                        if(filed.id === prams.fieldItem.id) {
                            for(let h=0; h<filed.hour_items.length; h++) {
                                let dis = filed.hour_items[h]
                                if(dis.d_id === prams.did) {
                                    this.venues[i].hour_list[j].hour_items[h].remind = !this.venues[i].hour_list[j].hour_items[h].remind
                                }
                            }
                        }
                    }
                }
            }

            this.toast("秒杀提醒已取消")
        },
        bottomBtnHandle() {
            this.disclosureTipShow = false
        },
        async startTipHandle(prams) {
            this.startTip = true
            this.threeTip = prams.threeTip

            let resp = await fly.post(`/lsj/v3/activity/switch_notify`,{
                "enable":1,
                "eid":prams.did,
                "e_type":1
            })
            setTimeout (() => {
                this.startTip = false
            }, 3000)

        },
        disclosureTipHandle(prams) {
            this.disclosureTipShow = true
            this.disclosureTipParams = prams
        },
        findDayBuy(day) {
            //查找某天的所有场次下的所有爆料是否可买
            for(let hour of day.hour_list) {
                for(let discolue of hour.hour_items) {
                    if(discolue.buy_status === 1){
                        return true
                    }
                }
            }
        },
        async fetchSellling() {
            //查询热卖商品列表
            this.needLoad = true
            let resp = await fly.get(`/lsj/v3/disclosure/hot_sell?page_mark=${this.pagemark}`)
            this.needLoad = false

            if(resp.data.result && resp.data.result.length > 0){
                this.pagemark = resp.data.page_mark
                this.selllingGoods = this.selllingGoods.concat(resp.data.result)
            }else{
                this.noData = true
            }
        },
        switchTab(index) {
            //点击切换选项卡
            this.currentVenue = index
        },
        async fetchVenue() {
            let resp = await fly.get(`/lsj/v3/activity/sec_kill?id=${this.activityId}`)
            this.venues = resp.data.days
            this.currentTime = resp.data.now_time
            //处理数据显示
            this.venues = this.venues.map(item=>{
                let date = new Date(item.start_time)
                item.day_date = `${(date.getMonth()+1)}月${date.getDate()}日`

                //if(Date.now() >= item.start_time && (Date.now() <= item.end_time)) {
                if(this.currentTime >= item.start_time && (this.currentTime <= item.end_time)) {
                    item.day_title = item.title
                    item.day_status = 1
                //}else if(Date.now() < item.start_time) {
                
                }else if(this.currentTime < item.start_time) {
                    item.day_title = "即将开始"
                    item.day_status = 0
                //}else if(Date.now() > item.end_time) {
                }else if(this.currentTime > item.end_time) {
                    item.day_title = "已结束"
                    item.day_status = 2
                }

                item.hour_list = item.hour_list.map(childItem=>{
                    childItem.timeTitle = `${new Date(childItem.start_time).getHours()}点场`

                    //if(Date.now() >= childItem.start_time && (Date.now() <= childItem.end_time)) {
                    if(this.currentTime >= childItem.start_time && (this.currentTime <= childItem.end_time)) {
                        childItem.title = "秒杀中"
                        childItem.status = 1
                    //}else if(Date.now() < childItem.start_time) {
                    }else if(this.currentTime < childItem.start_time) {
                        childItem.title = "即将开始"
                        childItem.status = 0
                    //}else if(Date.now() > childItem.end_time) {
                    }else if(this.currentTime > childItem.end_time) {
                        childItem.title = "已结束"
                        childItem.status = 2
                    }

                    return childItem
                })

                return item
            })

            // 是否下掉秒杀模块
            let lastDay = this.venues[this.venues.length - 1]
            //if(Date.now() > lastDay.end_time){
            if(this.currentTime > lastDay.end_time){
                this.isEnd = true
            }



            //显示当天或下一天
            for(let i=0; i<this.venues.length; i++) {
                let day = new Date(this.venues[i].start_time)
                let now = new Date()
                if((day.getMonth() === now.getMonth()) && (day.getDate() >= now.getDate()) && (this.venues[i].day_status !== 2)){
                    this.currentVenue = i
                    break
                }
            }


        },
        toSign() {
            jump.navigateTo("sign_in")
        },
        
        async fetch() {
            this.fetchVenue()
            this.fetchSellling()

        }

    },
    onLoad() {

        this.pagemark = 0
        this.selllingGoods = []
        this.needLoad = false
        this.noData = false
        this.scrollTop = 0
        this.activityId = 0
        this.venues = []
        this.currentVenue = 0
        this.isEnd = false
        this.startTip = false
        this.threeTip = false
        this.disclosureTipShow = false
        this.disclosureTipParams = {}
        this.activityId = nav.page().options.id
        this.fetch()
    },
    onShareAppMessage(res) {
        const shareCode = utils.uuid()
        const helpParams = {
            share_code: shareCode,
            id: this.activityId
        }
        embed.reportShareIncrement({
            share_code: shareCode,
            type: 'activity_venue'
        })
        return {
            title: "天天跟我买桃花节4.24-25日限时秒杀，luna mini2仅599元！",
            imageUrl: 'https://img-ali.xiaohongchun.com.cn/admin/15548820360692a763a03.png',
            path: "/pages/activity_venue/main?" + qs.stringify(helpParams)
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop
    },
    onReachBottom() {
        this.fetchSellling()
    }
}
