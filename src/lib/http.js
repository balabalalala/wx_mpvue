import url from 'url'
import qs from 'qs'
import _ from 'underscore'
import {fly} from './fly'
import user from './user'
import crypto from './crypto'
import util from './util'
import nav from '@/common/lib/navigator'

let sessionid = wx.getStorageSync('sessionid')

let logining = false

fly.interceptors.request.use(async function (request) {
    const link = request.baseURL + request.url

    const appInfo = getApp()
    const share_code = appInfo.globalData.share_code
    const from = appInfo.globalData.from
    const source = appInfo.globalData.source || appInfo.globalData.scene

    if((share_code || from || source)) {
        let URL = url.parse(link)
        let query = URL.query
        query = Object.assign(qs.parse(query), _.omit({share_code, from, source}, _.isUndefined))
        //repeat 首页爆料数据接口需要 不然就是mall[0]=淘宝&mall[1]=天猫
        //加上参数后为 mall=淘宝&mall=天猫
        request.url = URL.pathname + '?' + qs.stringify(query, { arrayFormat: 'repeat' })
    }

    if(!sessionid) {
        sessionid = wx.getStorageSync('sessionid') || util.uuid()
    }

    request.headers['session-id'] = sessionid
    request.headers['request-id'] = crypto()
    let token = user.getTokenCache()

    if (token.timeout > Date.now()) {
        request.headers['token'] = token.token
        return request
    }

    return request

})

fly.interceptors.response.use( (response) =>{
    // console.log(`重新请求：path:${response.request.url}，baseURL:${response.request.baseURL}`)
}, async function(err){
    //发生网络错误后会走到这里
    if(err.status === 401) {
        user.removeStorage()

        fly.lock()

        if(!logining) {
            logining = true
            await user.login()
            nav.reload()

            fly.unlock()
        }
    }
    if(err.status == 500) {
        throw {
            code: err.status,
            msg: err.msg || "请求错误"
        }
    }
    if(err.status == 404) {
        throw {
            code: 404,
            msg: "接口不存在"
        }
    }

    throw err

})

export default fly