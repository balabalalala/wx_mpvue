import fly from '@/lib/http'

export default {
    methods: {
    // 支付
        async pay(sn, formId, options){
            let resp = {},
                success_link = `/pages/pay_success/main?sn=${sn}`,
                fail_link = '/pages/pay_fail?sn=' + sn //success_link = '/pages/orderDetail?sn=' + sn + '&fromPage=orderConfirm',
            if(options) {
                success_link = options.success_link
                fail_link = options.fail_link
            }
        
            try {
                resp = await fly.get(`/lsj/v2/pay/wechat?sn=${sn}&formId=${formId}`)// 获取支付信息
            } catch(e) {
                return wx.redirectTo({url: fail_link })
            }

            resp = resp.data
            
            if (resp.already_paid === 'OK') {
                await fly.post(`/lsj/v1/order/pay_succeed?sn=${sn}`)
                if(options && options.oneCentType) {
                    let payInfo = await fly.post(`/lsj/v3/boost/bargain`, options.oneCentType)
                    let asn = payInfo.data.result
                    success_link += `?activitySn=${asn}`
                }
                return wx.redirectTo({url: success_link })// 积分支付的情况
            }
        

            try {
                // 调起微信支付
                resp = await this.wx.requestPayment({
                    timeStamp: resp.timeStamp,
                    nonceStr: resp.nonceStr,
                    package: resp.package,
                    signType: resp.signType,
                    paySign: resp.paySign
                })
            } catch(e) {
                return wx.redirectTo({url: fail_link})
            }
            
            // 调起支付成功
            if (resp.errMsg == 'requestPayment:ok') {
                await fly.post(`/lsj/v1/order/pay_succeed?sn=${sn}`)
                if (options && options.oneCentType) {
                    let payInfo = await fly.post(`/lsj/v3/boost/bargain`, options.oneCentType)
                    let asn = payInfo.data.result

                    success_link += `?activitySn=${asn}`
                }
            }
            
            wx.redirectTo({url: success_link })
        }
    }
}
