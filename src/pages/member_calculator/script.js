import qs from "qs"
import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import utils from "@/lib/util"
import jump from "@/common/lib/jump"
import embed from "@/lib/data_embedding"
import ToIndex from "@/components/common/to_index"
import nav from "@/lib/navigator"

export default {
    mixins: [mixin],
    components: {ToIndex},
    data() {
        return {
            commonListData: {}
        }
    },
    methods: {
        async fetch() {
            let is_from_share = 0
            if(nav.page().options.is_from_share != 0){
                is_from_share = 1
            } 
            let resp = await fly.get(`/lsj/v3/member/economical_info?is_from_share=${is_from_share}`)
            this.commonListData = resp.data
        },
        toMember(){
            wx.switchTab({
                url: '/pages/member/main'
              })
        },
        toMemberOpen(){
            jump.navigateTo('member_open')
        }
    },
    onShareAppMessage(res){
        const shareCode = utils.uuid()
        const helpParams = {
            share_code: shareCode,
        }
        embed.reportShareIncrement({
            share_code: shareCode,
            type: 'member_calculator'
        })
        return {
            title: "代购都用这张卡！多用多省，我已经省了"+ (this.commonListData.total/100) +"元......",
            imageUrl: "https://img-ali.xiaohongchun.com.cn/admin/1548748362843f2f1b46.png",
            path: "/pages/member_calculator/main?" + qs.stringify(helpParams)
        }
    },
    computed: {
        totalPrice() {
            return (this.commonListData.total / 100).toFixed(2)
        },
        economizePrice() {
            return (this.commonListData.economize / 100).toFixed(2)
        },
        serviceChargePrice() {
            return (this.commonListData.service_charge / 100).toFixed(2)
        },
        freeCardPrice() {
            return (this.commonListData.free_card / 100).toFixed(2)
        },
        subsidyPrice() {
            return (this.commonListData.subsidy / 100).toFixed(2)
        },
        economizeMemberPrice() {
            return (this.commonListData.economize_member / 100).toFixed(2)
        }
    },
    onLoad() {
        this.fetch()
    },
    onUnload() {
        this.commonListData = {}
        Object.assign(this.$data, this.$options.data())
    }
}