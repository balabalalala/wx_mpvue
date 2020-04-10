import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import qs from "qs"
import jump from "@/common/lib/jump"
import GoodsItem from "@/components/common/goods_item"
import Tab from "@/components/subcribe/tab"
import ToIndex from "@/components/common/to_index"
import Toast from '@/components/common/toast'
import SubscribeModal from '@/components/common/subscribe_modal'

export default {
    data() {
        return {
            current: 1, // 1 全部 2 品类 3 商品 4 标签
            allClass: "",
            categorysClass: "",
            goodsClass: "",
            labelsClass: "",
            allNumber: 0,
            categorysNumber: 0,
            goodsNumber: 0,
            goods: [],
            categorys: [],
            labelsNumber: 0,
            labels: [],
            all:[],
            isShowSubscribeAlert: false,
        }
    },
    mixins: [mixin],
    components: {ToIndex, GoodsItem, Tab, Toast, SubscribeModal},
    methods: {
        toGoHandle(item, event){
            const name = event.target.dataset.name
            if(name && name.indexOf('g_') !== -1) return
            jump.navigateTo("disclosure", {gdid: item.id}, event)
        },
        hideSubscribeModal() {
            this.isShowSubscribeAlert = false
        },
        clearClass() {
            this.allClass = ""
            this.categorysClass = ""
            this.goodsClass = ""
            this.labelsClass = ""
        },
        async bottomRedHandle(pram){
            let dom = pram.e_type === 1 ? this.$refs[pram.did][0] : this.$refs[pram.eid][0]
            let isSubId = dom.$attrs.isSubId
            let tab = this.$refs.tab
            let isSubscribe = dom.$attrs.isSubscribe

            if(!isSubscribe){
                dom.$attrs.isSubscribe = true
                if(isSubId){
                    let delResp = await fly.delete(`/lsj/v3/favorite?id=${isSubId}`)
                    dom.$attrs.isSubId = ""
                    dom.bottomRedButton = {text:"订阅", track:""}

                    tab.all = tab.all - 1

                    if(pram.e_type === 1){
                        dom.bottomRedButton.track = "g_sub"
                        tab.goods = tab.goods - 1
                    }else if(pram.e_type === 2){
                        dom.bottomRedButton.track = "c_sub"
                        tab.categorys = tab.categorys - 1
                    }else{
                        dom.bottomRedButton.track = "l_sub"
                        tab.labels = tab.labels - 1
                    }
                    wx.showToast({
                        title: '取消成功',
                        icon: 'none',
                        duration: 1500
                    })
                }else{
                    fly .post('/lsj/v3/favorite', pram)
                    .then(resp => {
                        dom.$attrs.isSubId = resp.data.id
                        dom.bottomRedButton = {text:"已订阅", track:""}

                        tab.all = tab.all + 1

                        if(pram.e_type === 1){
                            dom.bottomRedButton.track = "g_unsub"
                            tab.goods = tab.goods + 1
                        }else if(pram.e_type === 2){
                            dom.bottomRedButton.track = "c_unsub"
                            tab.categorys = tab.categorys + 1
                        }else{
                            dom.bottomRedButton.track = "l_unsub"
                            tab.labels = tab.labels + 1
                        }
            
                        const today = new Date()
                        const todayModalVal = today.getFullYear()+ "-" + (today.getMonth()+1) + "-" + today.getDate()
                        const todayModalKey = 'subscribed_install_modal'
                        const todayModalstore = wx.getStorageSync(todayModalKey)
                        
                        if(!todayModalstore || (todayModalstore && todayModalstore !== todayModalVal)) {
                            this.isShowSubscribeAlert = true
                            wx.setStorage({key: todayModalKey, data: todayModalVal })
                        }
                        else {
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
        async fetch(prams) {
            // 专门请求 数字的接口
            let numberResp = await fly.get(`/lsj/v3/favorite/favorite_count`)
            this.allNumber = numberResp.data.all_count
            this.categorysNumber = numberResp.data.category_count
            this.goodsNumber = numberResp.data.diclosure_count
            this.labelsNumber = numberResp.data.price_count

            if(prams.id === 1){
                let allResp = await fly.get(`/lsj/v3/favorite/settings`)
                this.all = allResp.data
                this.all = this.all.map(item=>{
                    if(item.type === 1){
                        item.toGo = true
                        item.goodsImg = item.image_url
                        item.radius = false
                        item.expire = (item.buy_status ? (item.buy_status === 0) : (item.status===-1)) ? true : false
                        item.icon = (item.status !==  -1 && (item.iconSign || item.icon_sign)) ? true : false
                        item.topTitle = item.title || ""
                        item.title = ""
                        item.topKeynote = item.deal_price || ""
                        item.underSecondary = item.mall
                        item.editRec = item.editor_rec_desc
                        item.timeString = item.time_string
                        item.bottomRedButton = {text:"已订阅", track:"g_unsub"}
                    } else if(item.type === 2){
                        item.goodsImg = item.icon
                        item.radius = false
                        item.topTitle = item.name || ""
                        item.bottomRedButton = {text:"已订阅", track:"c_unsub"}
                    } else{
                        item.goodsImg = item.tag_image
                        item.radius = false
                        item.topTitle = item.tag_name || ""
                        item.topDesc = item.description || ""
                        item.bottomRedButton = {text:"已订阅", track:"l_unsub"}
                    }

                    return item
                })
            }

            if(prams.id === 2){
                let categoryResp = await fly.get(`/lsj/v3/favorite/settings?type=2`)
                this.categorys = categoryResp.data
                this.categorys = this.categorys.map(item=>{
                    item.goodsImg = item.icon
                    item.radius = false
                    item.topTitle = item.name || ""
                    item.bottomRedButton = {text:"已订阅", track:"c_unsub"}

                    return item
                })
            }

            if(prams.id === 3){
                let goodsResp = await fly.get(`/lsj/v3/favorite/settings?type=1`)
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
                    item.timeString = item.time_string
                    item.bottomRedButton = {text:"已订阅", track:"g_unsub"}

                    return item
                })
            }

            if(prams.id === 4){
                let labelsResp = await fly.get(`/lsj/v3/favorite/settings?type=3`)
                this.labels = labelsResp.data
                this.labels = this.labels.map(item=>{
                    item.goodsImg = item.tag_image
                    item.radius = false
                    item.topTitle = item.tag_name || ""
                    item.topDesc = item.description || ""
                    item.bottomRedButton = {text:"已订阅", track:"l_unsub"}

                    return item
                })
            }
            
            this.clearClass()

            if(prams){
                this[prams.classtype] = "current"
                this.current = prams.id
            }else{
                this.allClass = "current"
                this.current = 1
            }
        }

    },
    onShow() {
        let id = this.current
        let classtypeArray = ["allClass", "categorysClass", "goodsClass", "labelsClass"]
        let classtype = classtypeArray[id - 1]
        this.fetch({id: id, classtype: classtype})
    },
    onUnload() {
        this.current = 1
    },
    async onPullDownRefresh() {
        //下拉刷新
        this.fetch()
        wx.stopPullDownRefresh();
    }
}
