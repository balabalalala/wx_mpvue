import _ from 'underscore'
import fly from "@/lib/http"
import utils from "@/common/lib/utils"
import mixin from "@/mixin/mixin"
import jump from '@/common/lib/jump'
import nav from "@/lib/navigator"

export default {
    mixins: [mixin],

    data() {
        return {
            sn: "",
            isEvaluate: false,
            buyerStar: "",
            orderInfo: {},
            sellerInfo: null,
            goodStarNumber: 5,
            orderEvaluateText: "",
            placeholder: "",
        }
    },

    methods: {
        async requestOrderInfo() {
            // 获取订单信息
            let resp = await fly.get(`/lsj/v1/order/detail_info?sn=${this.sn}`)

            this.orderInfo = resp.data.order;
            // 获取当前页面类型 status == 8 为查看评价
            this.isEvaluate = this.orderInfo.status == 8 ? false : true;
            this.wx.setNavigationBarTitle({title: this.isEvaluate ? "评价订单" : "我的评价"})
            this.placeholder = this.isEvaluate ? "对本单服务的评价" : "";

            // 解析买手数据
            let filterTimeline = resp.data.timeline.filter(e => e.source === "seller");
            if (filterTimeline.length > 0) {
                let sellerUid = filterTimeline[filterTimeline.length - 1].from_uid;
                this.sellerInfo = resp.data.seller[sellerUid];
                this.buyerStarFormat(this.sellerInfo.star);
            }

            // 根据页面类型加载
            if (!this.isEvaluate) {
                this.requestEvaluateInfo();
            }
        },

        evaluateContentSubmit() {
            // 提交评价
            fly.post('/lsj/v1/order/judge', {
                sn: this.sn,
                score: this.goodStarNumber,
                comment: this.orderEvaluateText
            }).then(resp => {
                getApp().globalData.events.trigger('orderEvaluateDidFinish', this.sn);
                this.wx.navigateBack({delta: 1});
            })
        },

        requestEvaluateInfo() {
            // 获取评价信息
            fly.get('/lsj/v3/order/get_order_judge?sn=' + this.sn).then(resp => {
                // 垃圾数据兼容
                if (resp.data.score > 0 && resp.data.score < 6) {
                    this.goodStarNumber = resp.data.score;

                } else {
                    this.goodStarNumber = 5;
                }

                // 评价内容处理
                if (resp.data.comment == null || resp.data.comment.length == 0) {
                    this.orderEvaluateText = "此用户没有填写评价。";
                } else {
                    this.orderEvaluateText = resp.data.comment;
                }
            })
        },

        buyerStarFormat(starNumber) {
            switch (starNumber) {
                case 1:
                    this.buyerStar = "一星买手";
                    break;
                case 2:
                    this.buyerStar = "二星买手";
                    break;
                case 3:
                    this.buyerStar = "三星买手";
                    break;
                case 4:
                    this.buyerStar = "四星买手";
                    break;
                case 5:
                    this.buyerStar = "五星买手";
                    break;
                default:
                    this.buyerStar = "";
                    break;
            }
        },

        phoneCallAction() {
            // 打电话
            this.wx.makePhoneCall({
                phoneNumber: this.sellerInfo.phone + ""
            });
        },

        needHelpAction() {
            // 需要帮助
            jump.navigateTo('contact_service');
        },

        // 点击已选中和未选中的评论图标
        clickDidSelectStar(index) {
            if (this.isEvaluate) this.goodStarNumber = index + 1;
        },

        clickUnSelectStar(index) {
            if (this.isEvaluate) this.goodStarNumber += index + 1;
        },
    },

    onLoad(options) {
        this.orderInfo = {};
        this.sellerInfo = null;
        this.orderEvaluateText = "";
        this.goodStarNumber = 5;
        this.isEvaluate = false;
        this.placeholder = "";

        this.sn = options.sn;
    },

    mounted() {
        this.requestOrderInfo();
    }
}