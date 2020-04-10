<template>
    <div class="bottom-container">
        <div class="contact" >
            <image src="https://img-ali.xiaohongchun.com.cn/admin/155412036014931fc26d1.png" mode="scaleToFill" ></image>
            <p class="contact-text">联系客服</p>
            <button
                open-type="contact"
                class="contact-icon"
                :send-message-title="shareTitle"
                :send-message-path="'/pages/disclosure/main?gdid=' + order.did + '&order_details_osn=' + order.sn + '&source=contact'"
                :send-message-img="order.goods_image_url"
                :show-message-card="true"
            ></button>
        </div>
        <div class="bottom-btn">
          <button class="submit "  v-if="order.status == 4 && order.identity_card !== 0 && !order.id_card" @click="uploadIdCard">上传身份证</button>
          <button class="submit "  v-if="order.status == 4 && order.identity_card !== 0 && order.id_card" @click="changeIdCard">修改身份证</button>
          <button class="submit bg" v-if="order.combin_status == 401 || order.combin_status == 406" @click="cancleorder">取消订单</button>
          <button class="submit" v-if="order.status == 7" @click="payorder">支付订单</button>
          <button class="submit" v-if="order.combin_status == 403 || order.combin_status == 407 || order.combin_status == 409" @click="confirm">确认收货</button>
          <button class="submit bg" v-if="order.combin_status == 403 && ((order.auto_receive_time && !order.delay_reason)|| !order.auto_receive_time )" @click="prelong(order)">延长收货</button>
          <button class="submit bg" v-if="order.combin_status == 403" @click="checktrans">查看物流</button>
          <button class="submit" v-if="order.status == 5" @click="evaluate">去评价</button>
          <button class="submit" v-if="order.diff_status == 1 && (order.status == 3 || order.status == 4)" @click="payDifferPrice">支付差价</button>
          <button class="submit bg" v-if="order.diff_status == 1 && (order.status == 3 || order.status == 4)" @click="cancel(order)">不想要了</button>
        </div>
		<div v-if="isIPX" class="kong"></div>
    </div>
</template>

<script>
import mixin from '../../mixin/mixin'
import pay from '../../mixin/pay'
import differPay from '../../mixin/differPay'
import fly from '../../lib/http'
import jump from '../../common/lib/jump'
import _ from 'underscore' 
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
	// mixins: [mixin],
	mixins:[pay, differPay,mixin],
	computed: {
		...mapState({
			order: state => _.pick(state.order, 
				'did', 'sn', 'status', 'identity_card', 
				'combin_status', 'diff_status', 'auto_receive_time', 
				'delay_reason', 'id_card', 'goods_image_url', 'goods_title',
				'price', 'type'),
			user: state => _.pick(state.user, 'member_endtime', 'member')
		}),
		shareTitle() {
			if(!this.user) return ''

			const texts = []
			if(this.user.member && Date.now() < this.user.member_endtime) {
			texts.push('【会员】')
			}
			texts.push(`【订单号：${this.order.sn}】`)

			texts.push('¥' + this.order.price / 100)
			texts.push(' ' + this.order.goods_title)

			return texts.join('')
		}
	},

	methods: {
		async cancel() {
			jump.navigateTo('order_cancel', {sn: this.order.sn})
		},
		// 支付差价
		async payDifferPrice() {
			let d_sn = await this.getDifferPayInfo()
			this.differBuy(d_sn, this.order.sn)
		},
		// 支付订单
		async payorder() {
			let userInfo = wx.getStorageSync('lsj_userToken').token.split(' ')[0]
			let nowTime = Date.now()
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
			if (this.order.type == 11) {
				this.pay(this.order.sn, null, opt)
			} else {
				this.pay(this.order.sn, null, null)
			}
		},
		// 确认收货
		async confirm() {
			let res = await this.wx.showModal({
				title: '',
				content: '确定该订单已经收货?'
			})
			console.log(res)
			let sn = this.order.sn
			let resp
			if (res.confirm) {
				resp = await fly.post(`/lsj/v1/order/receipt`, {sn})
			if (resp.data.code === 0) {
				wx.showToast({
					title: '收货成功!'
				})
			}
			jump.navigateTo('order_evaluate',{sn})
			}
		},
		// 上传身份证
		uploadIdCard() {
			jump.navigateTo('idcard_list')
		},
		// 修改身份证
		changeIdCard() {
			jump.navigateTo('idcard_list')
		},
		// 取消订单
		cancleorder() {
			jump.navigateTo('order_cancel', {sn: this.order.sn})
		},
		// 订单评价
		evaluate() {        
			jump.navigateTo('order_evaluate',{sn: this.order.sn})
		},
		// 查看物流
		checktrans() {
			wx.navigateTo({
				url: `/pages/orderLogistics?sn=${this.order.sn}`
			})
		},
		//延长收货
		prelong(o) {
			this.$emit("showPrelongModal", o)
		},
		//   获取差价支付单号
		async getDifferPayInfo() {
			let resp = await fly.post(`/lsj/v3/order/diff_pay_trade`,{sn: this.order.sn})
			return resp.data.result
		}
	},
	created () {
		console.log(this.isIPX)
	}
}
</script>

<style scoped>
.bottom-container {
	box-sizing: border-box;
	width: 100%;
	height: 100rpx;
	padding: 0 17rpx 0 30rpx;
	border-top: 1px solid #f1f1f1;
	background: #fff;
	position: fixed;
	bottom: 0rpx;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.ipx .bottom-container {
	bottom: 60rpx;
	/* border-bottom: 60rpx solid #fff; */
}
.bottom-btn {
	display: flex;
	flex-direction: row-reverse;
	justify-content: flex-end;
}
.submit {
	padding: 0 37rpx;
	height: 59rpx;
	margin-right: 13rpx;
	border: 1rpx solid #dc3538;
	background: #dc3538;
	color: #fff;
	font-size: 26rpx;
	text-align: center;
	line-height: 59rpx;
	border-radius:0;
}
.bg{
	border-color: #4c4c4c;
	background: #fff;
	color: #4c4c4c;
}
.contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    color:#4c4c4c;
}

.contact image{
    display: inline-block;
    width: 40rpx;
    height: 40rpx;
}
.contact-text {
    line-height: 1;
    margin-top: 8rpx;
}
.contact-icon {
	background: none;
	position: absolute;
	top: 0;
	left: 0;
	width: 100rpx;
	height: 90rpx;
}
.kong {
  height: 60rpx;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>