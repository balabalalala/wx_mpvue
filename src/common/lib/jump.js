import qs from 'qs'
import _ from 'underscore'
import nav from './navigator'
import {getUrlByKey} from './pages'

export default {
    geneUrl(key, params, e) {

        params = params || {}

        let url = getUrlByKey(key)

        if(!url) {
            console.error(`${key} 没有对应的页面`)
            return ''
        }

        let track_info = (e && e.currentTarget.dataset.track_info) || nav.page().options.track_info

        if(track_info) {
            params.track_info = track_info
        }

        if(params.track_info) {
            params.track_info = decodeURIComponent(params.track_info)
        }

        if(!_.isEmpty(params)) {
            url += '?' + qs.stringify(params)
        }

        return url

    },
    /**
     * 跳转
     * @param  key    url的key
     * @param  params 参数
     * @param  e      事件对象
     */
    navigateTo(key, params, e) {
        wx.navigateTo({url: this.geneUrl(key, params, e)});
    },

    redirectTo(key, params={}, e) {
        wx.redirectTo({url: this.geneUrl(key, params, e)});
    },

    switchTab(key) {
        wx.switchTab({
            url: getUrlByKey(key)
        })
    }
}
