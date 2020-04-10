import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '所有评论',
        usingComponents: {
            'modal': '../../../static/components/modal'
        }
    }
}