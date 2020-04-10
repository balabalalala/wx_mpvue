import Vue from 'vue'

import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        usingComponents: {
            'modal': '../../../static/components/modal'
        },
        navigationBarTitleText: '订阅管理',
        enablePullDownRefresh: true
    }
}
