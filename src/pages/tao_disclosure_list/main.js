import Vue from 'vue'
import App from './index'

const  app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '逛好货',
        usingComponents: {
            'modal': '../../../static/components/modal'
        }
    }
}