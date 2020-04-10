import fly from "@/lib/http";
import nav from '@/lib/navigator'
import _ from 'underscore'
import qs from 'qs'
import _wx from '@/lib/_wx'
import user from '@/lib/user'
import Vue from 'vue'
import embed from "@/lib/data_embedding";
import jump from "@/common/lib/jump"

import {getKeyByUrl} from '@/common/lib/pages'
import store from '@/store'

import events from '../common/lib/events'

Vue.prototype.$store = store
Vue.prototype.wx = _wx

const app = getApp()
app.globalData = app.globalData || {events}

let timeoutId;

export default {
    data() {
        return {
            isIPX: false,
            tbkRemind: {'tb_mark': '商品', 'tbm_mark':'商家APP','tkl_mark':'链接'},
            is618Time: false
        }
    },

    onShow() {
        const currentTimeStamp = new Date().getTime();
        // this.is618Time = (currentTimeStamp >= 1559836800000 && currentTimeStamp < 1560182400000) //线上
        this.is618Time = (currentTimeStamp >= 1556640000000 && currentTimeStamp < 1560182400000) //测试
        this.sendTrackReq({fun: 'onshow'})
    },

    onHide() {
        this.sendTrackReq({fun: 'onhide'})
    },

    onLoad(options) {
        if(_.isEmpty(options)) return

        app.globalData.query = options

        // 设置share code
        if(options.share_code) {
            app.globalData.share_code = options.share_code
        }

        if(options.source) {
            app.globalData.source = options.source
        }

        this.sendTrackReq({ fun: 'onLoad' })
        this.wx.getSystemInfo()
            .then(resp => this.isIPX = ['iPhone X', 'unknown'].some(key => resp.model.indexOf(key) !== -1))
    },

    async onReady() {
        const page = nav.page()
        if(!page.route) return

        if(page.options.share_code) {
            embed.reportShareBack({
                share_code: page.options.share_code
            })
        }
    },
    methods: {
        // async toMobilePhone() {
        //     let res = await fly.get('/lsj/v3/register/get_phone')
        //     res = res.data
        //     if(!res.result) {
        //         await this.wx.checkSession().catch(e => {
        //             console.error(e)
        //             user.login()
        //         })
        //         jump.navigateTo('add_mobile_number')
        //     }
        // },
        onclick(e){
            const params = _.pick(e, 'x', 'y')
            for(let key in e.target.dataset) {
                if(key != 'eventid' && key != 'comkey') {
                    params[key] = e.target.dataset[key]
                }
            }
            params.btn = e.target.dataset.name
            params.fun = 'onclick'

            this.sendTrackReq(params)
        },

        formSubmit(e) {
            let params = {
                formId: e.mp.detail.formId,
                fun: "onclick"
            }

            this.sendTrackReq(params)
        },

        sendTrackReq(params = {}) {
            console.log(page, params)
            let page = nav.page()
            fly.post(`/lsj/v2/client/event_track`, _.extend({
                base_url: page.route,
                page_type: getKeyByUrl(page.route),
                prev_page_type: nav.prev() && nav.prev().route ? getKeyByUrl(nav.prev().route) : undefined
            }, params, page.options))
        },
        toast(msg, duration=2e3) {
            this.$store.commit('setToast', true)
            this.$store.commit('setToastMsg', msg)

            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => this.$store.commit('setToast', false), duration)
        }
    }
}
