import qs from 'qs'
import _ from 'underscore'
import nav from '@/lib/navigator'

export default {
    /**
     * 跳转
     * @param  url    调整地址
     * @param  params 参数
     * @param  e      事件对象
     */
    navigateTo(url, params={}, e) {

        let track_info = (e && e.currentTarget.dataset.track_info) || nav.page().options.track_info
        
        if(track_info) {
            params.track_info = track_info
        }

        if(!_.isEmpty(params)) {
            url += '?' + qs.stringify(params)
        }
        wx.navigateTo({url});
    }
}
