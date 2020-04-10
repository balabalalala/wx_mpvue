import _ from 'underscore'
import qs from 'qs'
import fly from "@/lib/http"
import Status from '../../config/status'

const emptyData = {
    disclosure: {},
    address: {},
    order: {},
    member: {},
    idcard: {},
    user: {}
}

const state = Object.assign(emptyData, {
    noCoupon: 0,
    useful_coin: 0,
    total_coin: 0,
    conversion_coin: 0,
    coupon: null,
    agreement: true,
    notUploadeTemporary: false,
    cardIdInput: {
        'full_name': '',
        'card_id': ''
    },
    useScore: false,
    remark: '',
    pageType: 1, //1 确认订单页 2 订单详情页
    orderDetailRecommend: []
})

export default {
    namespaced: true,
    state: state,
    getters: {
        addressSplice (state) {
            return state.address.province_name + state.address.city_name + state.address.country_name + state.address.detail_info
        },
        memberStatus (state) {
            //0: 从未开通过会员  1:会员过期  2:会员未过期
            let now = Date.now()
            if(!state.member && !state.member_endtime) return 0
            if(state.member && state.member_endtime && now > state.member_endtime) return 1
            if(state.member && state.member_endtime && now < state.member_endtime) return 2
        },
        memberComponentShow (state) {
            //goods_type 0 普通爆料 1神价爆款 2一份抢 3会员专卖
            //alone 3 自有爆料
            if(state.disclosure.goods_type !=2 && state.disclosure.alone !=3) return true
            if(state.disclosure.goods_type ==1 && state.disclosure.alone ==3) return true
        },
        orderStatusTitle (state) {
            let title = formatStatus(state.order.combin_status, state.order) // 顶部状态显示
            if(title == '已退款'){
                title =  changeTitle(state.order.refund_service_fee, title)
            }
            return title
        }
    },
    mutations: {
        setData (state, data) {
            if(_.isEmpty(data)) return
            Object.assign(state, data)
        },
        notUseCoupon (state, data) {
            state.noCoupon = data
        },
        setAgreement (state, data) {
            state.agreement = data
        },
        setPrice (state, data) {
            state.order.real_price -= data
        },
        setUseScore (state, data) {
            state.useScore = data
        },
        notUploadeTemporaryEvent (state, data) {
            state.notUploadeTemporary = data
        },
        setIdcardInput (state, idcardInfo) {
            state.cardIdInput = Object.assign(state.cardIdInput, idcardInfo)
            if(Object.values(state.cardIdInput).every(item => !item)) state.cardIdInput = {}
        },
        setIdCard (state, data) {
            state.idcard = Object.assign({}, data)
        },
        setRemark (state, data) {
            state.remark = data
        },
        reset (state) {
            state.address = {}
            state.idcard = {}
            state.disclosure = {}
            state.order = {}
            state.member = {}
            state.cardIdInput = {
                'full_name': '',
                'card_id': ''
            },
            state.noCoupon = 0
            state.useScore = false
            state.remark = ''
            state.coupon = null
            state.notUploadeTemporary = false
        },
        setPageType (state, data) {
            state.pageType = data
        },
        setOrderDetailRecommend(state, data) {
            state.orderDetailRecommend = data
        }
    },
    actions: {
        async getOrderConfirmDetail ({commit}, {osn, addressId, idCardId, couponCode}) {
            const params = {
                sn: osn, // 订单编号
                address_id: addressId, // 地址id
                idcard_id: idCardId, // 身份证id
                coupon_code: couponCode, // 红包id
            }
            let resp = await fly.get(`/lsj/v2/order/confirm?${qs.stringify(params)}`)
            resp = resp.data
            commit('setData', resp)
            commit('setPageType', 1)
            let isAutoAgreement = resp.order.pay_total / 100 >= 300
            if(isAutoAgreement) commit('setAgreement', isAutoAgreement)
        },
        async getOrderDetail ({commit}, {osn}) {
            const params = {
                sn: osn
            }
            let resp = await fly.get(`/lsj/v2/order/detail/new?${qs.stringify(params)}`)
            resp = resp.data
            commit('setData', resp)
            commit('setPageType', 2)
            // 超时未支付 和 未支付的订单 不推荐
            if(resp.order.status > 3 && resp.order.status != 11 && resp.order.status != 7){
                let res = await fly.get(`/lsj/v3/disclosure/recommend/${resp.disclosure.id}`)
                commit('setOrderDetailRecommend', res.data)
            }
        }
    }
}
//订单详情头部 订单状态信息
function formatStatus (s, order) {
    if(Status[s] === '已支付'){
        return '付款成功，等待买手下单'
    }
    if(Status[s] === '买手已接单') {
        if(order.diff_status == 1 && (order.status == 3 || order.status == 4 )) {
            return "买手已接单，待补差价"
        }else if(order.diff_status == 2 || order.diff_status == 3) {
            return "买手已接单，已补差价"
        }
        return '买手已接单'
    }
    if(Status[s] === '买手已下单'){
        return '买手已下单，等待商家发货'
    }
    if(Status[s] === '正在退款')
        return '订单退款中：预计1~3个工作日到账'
    if(Status[s] === '待支付')
        return '待付款'
    if(Status[s] === '正在验证支付')
        return '已支付'
    else
        return Status[s]
}
//更改头部订单状态信息
function changeTitle (s, title) { 
    if(s && s == 1){
        title += '(退还代买费)'
    } else{
        title += '(不退代买费)'
    }
    return title
}