import fly from "@/lib/http"
import jump from '@/common/lib/jump'
import mixin from "@/mixin/mixin"
import qs from "qs"
import utils from "@/lib/util"
import embed from "@/lib/data_embedding"
import todayCabbage from '../../components/cabbage_home/today_cabbage'
import fallCard from '../../components/cabbage_home/waterfall_card'
import loading from '@/components/common/loading'
import toTop from '@/components/common/to_top'
import ToIndex from "@/components/common/to_index"
let pageMark = 0
let chosenData = []
let outdateData = []
export default {
    mixins: [mixin],
    components: {
        todayCabbage, fallCard, loading, toTop,ToIndex
    },
    data() {
        return {
            todayData: {},
            chosenDataObj: {},
            outdateDataObj: {},
            noMoreData: false,
            itemWidth: 0,
            isLoading: true,
            scrollTop: 0,
        }
    },
    computed: {
        chosenFetched() {
            return Object.keys(this.chosenDataObj).length
        },
        outdateFetched() {
            return Object.keys(this.outdateDataObj).length
        }
    },
    methods: {
        async getTodayData() {
            let res = await fly.get('/lsj/v3/cabbage_area/cabbage_today')
            res = res.data
            this.todayData = Object.freeze(res)
        },
        async getChosenData(reset = false) {
            this.isLoading = true
            let res = await fly.get(`/lsj/v3/cabbage_area/cabbage_list?page_mark=${pageMark}`)
            res = res.data
            if (res.result.effective_selected_cabbage.length + res.result.overdue_selected_cabbage.length < 20) {
                this.isLoading = false
                this.noMoreData = true
            }
            if (reset) {
                chosenData = res.result.effective_selected_cabbage
                outdateData = res.result.overdue_selected_cabbage
                this.chosenDataObj = this.arrayToObj(chosenData)
                this.outdateDataObj = this.arrayToObj(outdateData)
            } else {
                chosenData.push(...res.result.effective_selected_cabbage)
                outdateData.push(...res.result.overdue_selected_cabbage)
                this.chosenDataObj = this.arrayToObj(chosenData)
                this.outdateDataObj = this.arrayToObj(outdateData)
            }
            pageMark = res.page_mark
        },
        arrayToObj(arr = []) {
            let newObj = {}
            for (let idx in arr) {
                newObj[idx] = arr[idx]
            }
            return newObj
        },
        toHelp(e) {
            jump.navigateTo('web_view', {
                url: '/cabbage_help',
                notShare: false,
                webPage: true
            }, e)
        }
    },
    onShow() {
        wx.getSystemInfo({
            success: (res) => {
                let percentage = 750 / res.windowWidth
                let margin = 60 / percentage
                this.itemWidth = (res.windowWidth - margin) / 2
            }
        })
    },
    onPullDownRefresh() {
        pageMark = 0
        wx.stopPullDownRefresh()
        this.getTodayData()
        this.getChosenData(true)
    },

    onReachBottom() {
        if (this.noMoreData) return
        this.getChosenData()
    },
    onShareAppMessage(res) {
        const shareCode = utils.uuid();
        const helpParams = {
            share_code: shareCode,
        };
        embed.reportShareIncrement({
            share_code: shareCode,
            type: "cabbage_subscribe"
        });
        return {
            title: "好商品白菜价，千款好物通通不到20元！",
            imageUrl: 'https://img-ali.xiaohongchun.com.cn/admin/15695682610144dd3d97.png',
            path: "/pages/cabbage_home/main?" + qs.stringify(helpParams)
        };
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop
    },
    mounted() {
        this.getTodayData()
        this.getChosenData()
    },
    onUnload() {
        pageMark = 0
        chosenData = []
        outdateData = []
        Object.assign(this.$data, this.$options.data())
    }

}