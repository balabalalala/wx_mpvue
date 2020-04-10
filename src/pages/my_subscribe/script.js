import fly from "@/lib/http"
import qs from "qs"
import mixin from "@/mixin/mixin"
import jump from "@/common/lib/jump"
import GoodsItem from "@/components/common/goods_item"
// import Disclosure from '@/components/search/disclosure'
import Goods from '@/components/index/goods'
import Category from "@/components/subcribe/category"
import Loading from "@/components/common/loading"
import ToIndex from "@/components/common/to_index"
import SubscribeModal from '@/components/common/subscribe_modal'

export default {
    data() {
        return {
            isAttention: true,
            goods: [],
            categorys: [],
            pageMark: 0,
            needLoad: false,
            noData: false,
            isShowSubscribeAlert: false,
        }
    },
    mixins: [mixin],
    components: {ToIndex, Loading, Goods, Category, GoodsItem, SubscribeModal},
    methods: {
        toManage() {
            jump.navigateTo('subscribe_list')
        },
        hideSubscribeModal() {
            this.isShowSubscribeAlert = false
        },
        showSubscribeModal() {
            this.isShowSubscribeAlert = true
        },
        toGoHandle(item, event){
            const name = event.target.dataset.name
            if(name && name.indexOf('g_') !== -1) return
            jump.navigateTo("disclosure", {gdid: item.id}, event)
        },
        async bottomRedHandle(pram) {
            // let _that = this
            let dom = pram.e_type === 1 ? this.$refs[pram.did][0] : this.$refs[pram.eid][0]
            let isSubId = dom.$attrs.isSubId
            let isSubscribe = dom.$attrs.isSubscribe

            if(!isSubscribe){
                dom.$attrs.isSubscribe = true
                if(isSubId){
                    let delResp = await fly.delete(`/lsj/v3/favorite?id=${isSubId}`)
                    dom.$attrs.isSubId = ""
                    dom.bottomRedButton = {text:"订阅", track:""}
                    if(pram.e_type === 1){
                        dom.bottomRedButton.track = "g_sub"
                    }else{
                        dom.bottomRedButton.track = "c_sub"
                    }
                    wx.showToast({
                        title: '取消成功',
                        icon: 'none',
                        duration: 1500
                    })

                }else{
                    fly.post(`/lsj/v3/favorite`, pram)
                    .then(addResp => {
                        const today = new Date()
                        const todayModalVal = today.getFullYear()+ "-" + (today.getMonth()+1) + "-" + today.getDate()
                        const todayModalKey = 'subscribed_install_modal'
                        const todayModalstore = wx.getStorageSync(todayModalKey)
                        dom.$attrs.isSubId = addResp.data.id
                        dom.bottomRedButton = {text:"已订阅", track:""}
                        if(pram.e_type === 1){
                            dom.bottomRedButton.track = "g_unsub"
                        }else{
                            dom.bottomRedButton.track = "c_unsub"
                        }
                        
                        if(!todayModalstore || (todayModalstore && todayModalstore !== todayModalVal)) {
                            this.showSubscribeModal()
                            wx.setStorage({key: todayModalKey, data: todayModalVal })
                        }else{
                            wx.showToast({
                                title: '订阅成功',
                                icon: 'none',
                                duration: 1500
                            })
                        }
                    }) 
                }
            }
            dom.$attrs.isSubscribe = false

        },
        fetchAttention(resp) {
            //已关注
            if(resp.data.data && resp.data.data.length > 0){

                this.goods = this.pageMark ? this.goods.concat(resp.data.data) : resp.data.data
                this.goods = this.goods.map(item=>{
                    item.toGo = true
                    item.goodsImg = item.image_url
                    item.radius = false
                    item.expire = (item.buy_status ? (item.buy_status === 0) : (item.status===-1)) ? true : false
                    item.icon = (item.status !==  -1 && (item.iconSign || item.icon_sign)) ? true : false
                    item.topTitle = item.title || ""
                    item.topKeynote = item.deal_price || ""
                    item.underSecondary = item.mall
                    item.editRec = item.editor_rec_desc
                    item.timeString = item.time_string
                    item.value_percentage = item.value_percentage
                    item.comment_count = item.comment_count

                    return item
                })
                if(this.pageMark === 0 && this.goods.length > 3){
                    //this.goods.splice(3, 0, this.categorys)
                }
                this.pageMark = resp.data.page_mark
            }else{
                this.noData = true
            }
        },
        async fetchNotAttention() {
                //未关注过
                let pramData = {
                    type: 'old_to_new',
                    has_relation: true
                }
                let goodsResp = await fly.get(`/lsj/v3/gold_coin/disclosure_list?${qs.stringify(pramData)}`)
                this.goods = goodsResp.data
                this.goods = this.goods.map(item=>{
                    item.toGo = true
                    item.goodsImg = item.image_url
                    item.radius = false
                    item.expire = (item.buy_status ? (item.buy_status === 0) : (item.status===-1)) ? true : false
                    item.icon = (item.status !==  -1 && (item.iconSign || item.icon_sign)) ? true : false
                    item.topTitle = item.title || ""
                    item.topKeynote = item.deal_price || ""
                    item.underSecondary = item.mall
                    item.editRec = item.editor_rec_desc
                    item.timeString = item.release_time
                    item.value_percentage = item.value_percentage
                    item.comment_count = item.comment_count
                    item.bottomRedButton = {text:"订阅", track:"g_sub"}
                    return item
                })
        },
        async fetch() {
            if(this.pageMark == 0){
                this.goods = []
                this.categorys = []
            }
            this.needLoad = true
            let resp = await fly.get(`/lsj/v3/favorite/list?page_mark=${this.pageMark}`)
            this.isAttention = resp.data.flag
            let categoryResp = await fly.get(`/lsj/v3/favorite/hot_sell_category`)
            this.categorys = categoryResp.data
            this.categorys = this.categorys.map(item=>{
                if(this.isAttention){
                    item.goodsImg = item.icon
                }else{
                    item.smallImage = item.icon
                }
                item.radius = false
                item.title = item.name || ""
                item.bottomRedButton = {text:"订阅", track:"c_sub"}

                return item
            })
            if(this.isAttention){
                this.fetchAttention(resp)
            }else{
                this.fetchNotAttention()
            }
            this.needLoad = false
        }

    },
    onLoad() {
        //this.isAttention = false
        //this.goods = []
        this.categorys = []
        this.pageMark = 0
        this.needLoad = false
        this.noData = false
        this.fetch()
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data())
    },
    onReachBottom() {
        if(this.isAttention && !this.noData){
            this.fetch()
        }
    }
}
