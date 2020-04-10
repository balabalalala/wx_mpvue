
import fly from '../lib/http'

export default {
	methods: {
    	// 支付
		async differBuy(sn, o_sn){
			try {
				var resp = await fly.get(`/lsj/v3/pay/wechat_pay/pay_sn?sn=${sn}`)// 获取支付信息
			// console.log(resp)
			} catch (e) {
				return wx.redirectTo({url: `/pages/pay_fail?sn=${o_sn}`})
			}
			resp = resp.data
			try {// 调起微信支付
				resp = await this.wx.requestPayment({
					timeStamp: resp.timeStamp,
					nonceStr: resp.nonceStr,
					package: resp.package,
					signType: resp.signType,
					paySign: resp.paySign,
				})
			} catch (e) {
				return wx.redirectTo({url: `/pages/pay_fail?sn=${o_sn}`})
			}
			// 调起支付成功
			if(resp.errMsg == 'requestPayment:ok') { 
				fly.put(`/lsj/v3/order/diff_pay_success?sn=${sn}`)
			}
			wx.redirectTo({url: `/pages/order_detail/main?sn=${o_sn}&payInfo=success`})
		}
	}
}
