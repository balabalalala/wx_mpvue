import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '爆料详情',
        usingComponents: {
            'modal': '../../../static/components/modal',
            "share-button": "plugin://goodsSharePlugin/share-button"
        }
    }
}