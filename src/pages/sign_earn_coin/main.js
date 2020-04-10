import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '天天签到',
        usingComponents: {
            'modal': '../../../static/components/modal'
        }
    }
}