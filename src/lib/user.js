import { flyToken } from './fly'
import crypto from './crypto'
import _wx from './_wx'
import _ from "underscore"
import qs from 'qs'

const KEY = 'lsj_userToken'
let token

export default {
    // 获取token
    getTokenCache() {
        if (token) return token
        token = wx.getStorageSync(KEY)
        return token
    },
    // 设置token
    setTokenCache({ token, timeout }) {
        try {
            wx.setStorageSync(KEY, { token, timeout })
        } catch (e) {
            console.log(e)
        }
    },
    // 删除token
    removeStorage() {
        try {
            wx.removeStorageSync(KEY)
        } catch (e) {
            console.log(e)
        }
    },
    // 登录
    async login() {
        let loginData = await _wx.login()
        flyToken.config.headers['request-id'] = crypto()
        
        let query = this.getParams()
        let userinfo = await flyToken.get(`/lsj/v3/weixin/mini_app/${loginData.code}?${qs.stringify(query)}`)

        if (userinfo.data.auth_token) {
            token = userinfo.data.auth_token
            return this.setTokenCache(userinfo.data.auth_token)
        }
    },
    // 获取share_code等参数
    getParams() {
        const appInfo = getApp()
        const share_code = appInfo.globalData.share_code
        const from = appInfo.globalData.from
        const source = appInfo.globalData.source || appInfo.globalData.scene
        let query
        if((share_code || from || source)) {
            query = Object.assign({}, _.omit({share_code, from, source}, _.isUndefined))
        }
        return query
    },
    // 获取用户授权登录
    async userInfoLogin(code, userinfo) {
        if(!code) {
            code = await _wx.login()
            code = code.code
        }

        let query = this.getParams()

        let resp = await flyToken.post(`/lsj/v1/weixin/app/${code}?${qs.stringify(query)}`, {
            rawData: userinfo.rawData,
            encryptData: userinfo.encryptedData,
            iv: userinfo.iv,
            signature: userinfo.signature,
            system: {},
            location: {}
        }).catch(e => console.error(e))

        if(resp.data.token) {
            await this.setTokenCache(resp.data)
        }
    },

    isLogin() {
        try {
            const token = wx.getStorageSync('lsj_userToken');
            return !!token && token.timeout > Date.now()
        } catch (e) {
            return false
        }
    },

}

