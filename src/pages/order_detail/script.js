import mixin from '../../mixin/mixin'
import idCard from '../../mixin/idCard'
import saveMoney from '../../components/order_confirm/save_money.vue'
import orderNumber from '../../components/order_detail/order_number.vue'
import logistics from '../../components/order_detail/logistics.vue'
import orderStatus from '../../components/order_detail/order_status.vue'
import addressInfo from '../../components/order_confirm/address.vue'
import disclosure from '../../components/order_confirm/disclosure.vue'
import orderRemark from '../../components/order_detail/order_remark.vue'
import discount from '../../components/order_confirm/discount.vue'
import remark from '../../components/order_confirm/remark.vue'
import orderBottom from '../../components/order_detail/order_bottom.vue'
import prelongTime from '../../components/order_detail/prelong_time.vue'
import differPrice from '../../components/order_detail/differ_price.vue'
import differPriceTip from '../../components/order_detail/differ_price_tip.vue'
import guessLike from '../../components/order_detail/like.vue'
import coinIntro from '../../components/order_detail/coin_intro.vue'
import toIndex from '../../components/common/to_index.vue'
import fishGroup from '../../components/common/fish_group.vue'
import fishGroupAlert from '../../components/order_detail/fish_group_alert.vue'
import stopTimer from '../../components/order_detail/stop_timer.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('orderConfirm')
export default {
    mixins: [mixin, idCard],
    data () {
        return {
            osn: '',
            showServiceFeeDialog: false,
            isShowPrelongModal: false,
            coinIntroShow: false,
            showFishGroupAlert: false,
            showPaySuccessModal: false,
            fromPage: '',
            couponShow: true, // 用于判断分享回调后防止刷新页面
            payModalType: true,
        }
    },
    computed: {
        ...mapState(['disclosure','order']),

        diffPrice() {
            return this.order.plate_form_diff_price 
        },
        isFishOrder() {
            return this.order.new_old_people && this.order.is_show_float_win//新用户首单，直到订单结束（已退款&已完成）后浮窗消失。|| 已支付、买手已接单、买手已下单、商家已发货、正在退款 显示
        },
        showDifferPriceTip() {
            return ( ((this.order.combin_status === 402 || this.order.combin_status === 403) && this.order.plate_form_diff_price_status === 1) || ((this.order.combin_status === 503 || this.order.combin_status === 507 || this.order.combin_status === 509 || this.order.combin_status === 803 || this.order.combin_status === 807 || this.order.combin_status === 809) && this.order.plate_form_diff_price_status === 2) ) && this.order.plate_form_diff_price < 0 && !this.order.settlement_price
        },
        showStopTime() {
            return this.order.diff_status == 1 && (this.order.status == 3 || this.order.status == 4)
        },
        showRefundCoinTip() {
            return (this.order.combin_status === 402 || this.order.combin_status === 403) && this.order.plate_form_diff_price_status === 1 && this.diffPrice < 0 & !this.order.settlement_price
        },
        sntime() {
            let  submittime = this.order.submit_time
            let str = '2017/12/27'
            let date = new Date(str)
            let starttime = date.getTime()
            return submittime >= starttime
        },
        stopDiffTime() {
            return this.order.user_diff_apply_time
        },
        diff_price() {
            return parseFloat(this.order.user_diff_price / 100)
        }
    },
    components: {
        saveMoney, 
        logistics, 
        addressInfo, 
        orderStatus, 
        disclosure, 
        orderRemark, 
        discount, 
        remark,
        orderNumber,
        orderBottom,
        prelongTime,
        differPriceTip,
        guessLike,
        coinIntro,
        toIndex,
        fishGroup,
        fishGroupAlert,
        differPrice,
        stopTimer
    },
    methods: {
        ...mapActions({fetch: 'getOrderDetail'}),
        hidePrelongModal(status) {
            this.isShowPrelongModal = false
            if(status == "ok") {
                wx.showModal({
                    title: '天天跟我买',
                    content: '延长收货成功',
                    showCancel: false
                })
                this.fetch({osn: this.osn})
            }
        },
        showCoinIntro(status) {
            this.coinIntroShow = status
        },
        showFishAlert(status) {
            this.showFishGroupAlert = status
        },
        showPayModal(status) {
            this.showPaySuccessModal = status
        },
        hideShare() {
            if(!this.order.icon_show)  wx.hideShareMenu()  //超过三天，不能分享
            if(this.order.is_activity && !this.order.is_one_cent)//除一分抢外的其他活动订单
                return wx.hideShareMenu()
            else if(!((this.order.status === 4 || this.order.status === 5 ||
                this.order.status === 8) && this.sntime))//支付失败
                  return wx.hideShareMenu()
            else if(!this.fromPage || !this.couponShow){//不来自确认订单页或已分享
                if(this.order.is_activity)//活动类订单
                return wx.hideShareMenu()
            }else if(this.fromPage && this.fromPage == 'orderConfirm' && this.couponShow){
                if(this.order.is_one_cent) //一分抢活动去掉分享功能
                    wx.hideShareMenu()
            }
        }
    },
    onShow() {
        this.fetch({osn: this.osn})
    },
    onLoad(options) {
        this.osn = this.$root.$mp.query.sn
        this.fromPage = options.fromPage || ''
        if(options.payInfo && options.payInfo == "success") {
            this.showPaySuccessModal = true
        }
        this.hideShare()
        getApp().globalData.events.on('idcard:order:change', async(idcard_id) => {
            if(!this.osn || !idcard_id) return
            await this.fillIdcard(this.osn, idcard_id)
            return this.fetch({osn: this.osn})
        })
        this.fetch({osn: this.osn})
    },
    onUnload() {
        getApp().globalData.events.off('idcard:order:change')
    }
}