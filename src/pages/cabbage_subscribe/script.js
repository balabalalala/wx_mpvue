import fly from "@/lib/http";
import qs from "qs";
import embed from "@/lib/data_embedding";
import mixin from "@/mixin/mixin";
import utils from "@/lib/util";
import cabbageLabel from "@/components/cabbage_subscribe/cabbage_label";
import goods from "@/components/index/goods";
import loading from "@/components/common/loading";
import Index from "@/components/common/to_index";
let pageMark = 0;
let pageSize = 20;
export default {
    mixins: [mixin],
    data() {
        return {
            cabbageList: [],
            tagInfo: [],
            goodPrice: { detail: "1" },
            isDivide: true,
            isLoading: true
        };
    },
    components: { cabbageLabel, goods, Index, loading},
    computed: {},
    methods: {
        async getCabbageData(reset) {
            this.isLoading = true;
            let res = await fly.get(
                `/lsj/v3/cabbage_area/article_recommend?page_mark=${pageMark}&page_size=${pageSize}`
            );
            res = res.data;
            pageMark = res.page_mark;
            if (reset) {
                this.cabbageList = res.result;
            } else {
                this.cabbageList.push(...res.result);
            }
            if (this.isDivide) {
                for (let i = 0; i < this.cabbageList.length; i++) {
                    if (this.cabbageList[i].buy_status == 0) {
                        this.cabbageList.splice(i, 0, this.goodPrice);
                        this.isDivide = false;
                        break;
                    }
                }
            }
            if (res.result.length < 20) {
                this.isLoading = false;
            }
            // console.log("======>白菜列表" + JSON.stringify(this.cabbageList))
        },
        async pullNewData() {
            this.isLoading = true;
            pageMark = 0;
            this.cabbageList = [];
            this.getCabbageData(true);
        },
        async getTagInfo() {
            let resp = await fly.get(`/lsj/v3/cabbage_area/subscription_info`);
            this.tagInfo = resp.data;
        }
    },
    async onLoad() {
        pageMark = 0;
        this.getTagInfo();
        this.getCabbageData(true);
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
        this.pullNewData();
    },

    onReachBottom() {
        this.getCabbageData(false);
    },
    onShareAppMessage(res) {
        const shareCode = utils.uuid();
        const helpParams = {
            share_code: shareCode,
            id: this.tagInfo.id
        };
        embed.reportShareIncrement({
            share_code: shareCode,
            type: "cabbage_subscribe"
        });
        return {
            title:"上 #天天跟我买#，订阅 《今日白菜》，第一时间收到好价信息,发现品质优惠",
            path: "/pages/cabbage_subscribe/main?" + qs.stringify(helpParams)
        };
    },
    onUnload() {
        pageMark = 0;
        pageSize = 20;
        Object.assign(this.$data, this.$options.data());
    }
};
