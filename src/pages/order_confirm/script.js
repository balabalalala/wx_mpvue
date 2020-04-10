import fly from "@/lib/http"
import _ from 'underscore'
import qs from 'qs'
import jump from '../../common/lib/jump'
import mixin from '../../mixin/mixin'
import pay from '../../mixin/pay'
import saveMoney from '../../components/order_confirm/save_money.vue'
import addressInfo from '../../components/order_confirm/address.vue'
import idCard from '../../components/order_confirm/id_card.vue'
import disclosure from '../../components/order_confirm/disclosure.vue'
import member from '../../components/order_confirm/member.vue'
import discount from '../../components/order_confirm/discount.vue'
import remark from '../../components/order_confirm/remark.vue'
import confirmBottom from '../../components/order_confirm/confirm_bottom.vue'
import memberTip from '../../components/order_confirm/member_tip.vue'
import toast from '../../components/common/toast.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers('orderConfirm')

export default {
    data () {
        return {
            osn: '',
            addressId: '',
            idcardId: '',
            asn: '', //活动sn
            couponCode: '', //使用红包
            showServiceFeeDialog: false,
            memberTipShow: false,
            formId: ''
        }
    },

    mixins: [mixin, pay],

    components: {
        saveMoney, addressInfo, idCard, disclosure, member, discount, remark, confirmBottom, memberTip, toast
    },

    computed: {
        ...mapState(['disclosure', 'address', 'order', 'idcard',
                    'cardIdInput', 'agreement', 'notUploadeTemporary',
                    'useScore', 'useful_coin', 'remark']),
        ...mapGetters(['addressSplice', 'memberComponentShow', 'memberStatus']),

        shareTitle () {
			const texts = []
            if(this.memberStatus === 2) {
				texts.push('【会员】\n')
			}
            texts.push('¥' + this.disclosure.price / 100)
            texts.push(' ' + this.disclosure.title)
            return texts.join('')
        },

        sendMessagePath () {
            return `/pages/disclosure/main?gdid=${this.disclosure.id}&source=contact`
        }
    },
    methods: {
        ...mapMutations(['notUseCoupon', 'notUploadeTemporaryEvent', 'setIdCard', 'setPrice', 'reset', 'setUseScore']),
        ...mapActions({fetch: 'getOrderConfirmDetail'}),

        toBuyMember () {
            jump.redirectTo('member_no_tab',{sn:this.order.sn, asn: this.asn, address_id: this.address.id})
        },

        closeMemberTip () {
            this.memberTipShow = false
            this.toPay()
        },

        noMoreMemberTip () {
            this.memberTipShow = false
            wx.setStorageSync("isMemberTip", true)
			this.toPay()
        },

        async addIdCard () {
           if(_.values(this.cardIdInput).some(item => !item)) return
            let resp = await fly.post('/lsj/v1/idcard/add', 
                {
                    name: this.cardIdInput.full_name,
                    card_id: this.cardIdInput.card_id
                }
            )
            this.idcardId = resp.data.ocr_id
        },

        async setDefaultAddress () {
            if(!this.address.id) return
            await fly.put(`/lsj/v1/user/address/${this.address.id}/set_primary`)
        },

        async toPay () {
            await this.addIdCard()
            await this.setDefaultAddress()
            const query = {
                sn: this.order.sn, // 订单编号
                type: "disclosure" 
            }
            let computedCardId = this.disclosure.need_idcard ? _.result(this.idcard, 'id') || this.idcardId : ''
            let resp = await fly.post(`/lsj/v2/order/submit?${qs.stringify(query)}`, 
                {
                    address_id: this.address.id, // 地址id
                    num: this.order.num, // 订单数量
                    remark: this.remark, // 订单备注
                    useScore: this.useScore ? this.useful_coin : 0, // 支付金额
                    id_card: computedCardId, // 身份证id
                    coupon_code: this.couponCode === -1 ? '' : this.couponCode, // 红包id -1的情况是暂不使用红包
                    service_fee: this.order.service_charge ? this.order.service_charge.price : 0, // 服务费
                    economy_price: this.order.economy_price, // 省钱
                    is_free: this.order.service_charge ? this.order.service_charge.is_free : 0
                }
            )
            if(resp.statusCode == 410) {
                return wx.showModal({
                    title: '天天跟我买',
                    content: '商品抢光啦，下次早点来抢！',
                    showCancel: false
                })
            }
    
            if(resp.data.code)
                return wx.showModal({
                    title: '天天跟我买',
                    content: resp.data.content,
                    showCancel: false
                })
    
            let userInfo = wx.getStorageSync('lsj_userToken').token.split(' ')[0]
    
            let nowTime = Date.now()
    
            if(this.order.type == 11){
                let opt = {
                    oneCentType: {
                        osn: this.order.sn,
                        activity_type: 2,
                        uid: userInfo,
                        start_time: nowTime
                    },
                    success_link: `/pages/one_cent_rob/main`,
                    fail_link: `/pages/pay_fail?sn=${this.order.sn}`
                }
                this.pay(this.order.sn, this.formId, opt) // 1分抢
            } else {
                this.pay(this.order.sn, this.formId) // 支付订单
            }
        },
        
        async payConfirm () {
            let needPay = this.order.real_price > 1
            if(this.useScore && this.useful_coin) {
                let resp = await this.wx.showModal({
                    title: '天天跟我买',
                    content: `确认要花费 ${this.useful_coin}金币抵扣 ${(this.useful_coin / 100).toFixed(2)}元吗？${!needPay ? ' \n 由于本单为金币全额抵扣，点击确定后将直接下单' : ''}`
                })
                if (!resp.confirm) return // 点击了取消
            }
            if(!wx.getStorageSync("isMemberTip")){
                //未开通会员或会员已到期
                if(this.order.type !== 8 && this.memberStatus != 2 && this.disclosure.goods_type !=2 && this.disclosure.alone !=3){
                    this.memberTipShow = true
                    return 
                }
            }
            this.toPay()
        },

        async checkoutInfo (formId) {
            this.formId = formId
            if(!this.address.id) return this.toast('请添加收货地址')
            if(this.disclosure.exclude_area.length) {
                let exclude = this.disclosure.exclude_area.some(item => this.address.province_name.indexOf(item) != -1)
                if (exclude) return this.toast('抱歉，您所选的地区无货')
            }
            //暂不上传身份证 不进行校验
            if(!this.notUploadeTemporary) {
                //需要身份证信息 不需要照片
                //判断输入的身份信息字段有空
                if(this.disclosure.need_idcard == 1 && _.isEmpty(this.idcard)) {
                    for(let key in this.cardIdInput) {
                        if(key == 'full_name' && !this.cardIdInput[key]) return this.toast('请输入姓名')
                        if(key == 'card_id' && !this.cardIdInput[key]) return this.toast('请输入身份证号')
                        if(key == 'card_id' && !/^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(this.cardIdInput[key])) 
                            return this.toast('请输入有效的身份证号')
                    }
                }
                //需要身份证信息 本人存储过身份证
                if (this.disclosure.need_idcard == 2 && _.isEmpty(this.idcard)) {
                    return wx.showModal({
                        title: '天天跟我买',
                        content: '本订单需要您上传身份证信息，请选择收货人身份证',
                        showCancel: false
                    })
                }
                //上传的身份证没有照片
                if(this.disclosure.need_idcard == 2 && !_.result(this.idcard, 'front_image_url')) {
                    const resp = await this.wx.showModal({
                        title: '天天跟我买',
                        content: `应【${this.disclosure.mall}】要求，本单需提供收货人身份证照片才可下单，请您尽快上传，谢谢配合！`,
                        confirmText: '去上传'
                    })
                    if(resp.confirm) {
                        jump.navigateTo('idcard_edit', {
                            id: this.idcard.id
                        })
                    }
                    return
                }
                //身份证姓名与下单姓名不一致
                let nameIsDifferent 
                if (_.isEmpty(this.idcard)) {
                    nameIsDifferent = _.result(this.cardIdInput, 'full_name', '') !== this.address.user_name
                } else {
                    nameIsDifferent = _.result(this.idcard, 'full_name', '') !== this.address.user_name
                }
                if (this.disclosure.need_idcard && nameIsDifferent) {
                    let resp = await this.wx.showModal({
                        title: '天天跟我买',
                        content: '您的「收货人」与「身份证姓名」不一致，我们将以「身份证姓名」为您下单，你也可以取消更换身份证。'
                    })
                    if (!resp.confirm) return // 点击了取消
                }
            }
            if(!this.agreement)
                return wx.showModal({
                    title: '天天跟我买',
					content: '请先同意代买服务协议',
					showCancel: false
                })
            //秒杀商品是否有库存
            if(this.disclosure.is_seckill == 1) {
                let entityIds = this.order.origin_spec.map(spec => spec.id)
				let resp = await fly.get(`/lsj/v3/disclosure/stock_validate?entity_ids=${entityIds.join(',')}&buy_count=${this.order.num}&did=${this.disclosure.id}`)
				resp = resp.data
				if(resp.result == "false") {
					return wx.showModal({
						title: '天天跟我买',
						content: '商品抢光啦，下次早点来抢！',
						showCancel: false
					})
				}
            }
            this.payConfirm()
        }
    },

    async mounted () {
        this.memberTipShow = false
        this.osn = this.$root.$mp.query.sn
        this.asn = this.$root.$mp.query.asn || ''
        this.addressId = this.$root.$mp.query.address_id || ''
        this.couponCode = this.$root.$mp.query.noCoupon ?  -1 : ''
        if(this.couponCode == -1) this.notUseCoupon(this.couponCode)
        await this.fetch({osn: this.osn, addressId: this.addressId})
        if(this.useScore) this.setPrice(this.useful_coin)

        getApp().globalData.events.on('address:change', async (id) => {
            this.addressId = id
            let computedIdCardId = _.result(this.idcard, 'id', '') || this.idcardId
            await this.fetch({osn: this.osn, addressId: id, idCardId: computedIdCardId})
            if(this.useScore) this.setPrice(this.useful_coin)
        })
        
        getApp().globalData.events.on('idcard:change', async (id) => {
            this.idcardId = id
            id == 0 ? this.notUploadeTemporaryEvent(true) : this.notUploadeTemporaryEvent(false)
            await this.fetch({osn: this.osn, idCardId: id, addressId: this.addressId || this.address.id})
            if(this.useScore) this.setPrice(this.useful_coin)
        })

        getApp().globalData.events.on('coupon:change', async (id) => {
            if(this.useScore) this.setUseScore(false)
            this.couponCode = id
            this.notUseCoupon(this.couponCode)
            let computedIdCardId = _.result(this.idcard, 'id', '') || this.idcardId
            let computedAddressId = this.addressId || this.address.id
            await this.fetch({osn: this.osn, idCardId: computedIdCardId, addressId: computedAddressId, couponCode: this.couponCode})
        })
    },
    
    onUnload() {
        Object.assign(this.$data, this.$options.data())
        this.reset()
        getApp().globalData.events.off('address:change')
        getApp().globalData.events.off('idcard:change')
    }
}