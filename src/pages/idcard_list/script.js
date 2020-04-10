import { createNamespacedHelpers } from 'vuex'
import _ from 'underscore'

import utils from "@/common/lib/utils"
import mixin from "@/mixin/mixin"
import jump from '@/common/lib/jump'
import nav from '@/common/lib/navigator'
import {getKeyByUrl} from '@/common/lib/pages'

const {mapState, mapActions} = createNamespacedHelpers('idcards')

export default {
    data() {
        return {
            current: -1,
            later: false,
            refer: '',
            ipx:false
        }
    },

    computed: {
        ...mapState(['idcards']),
        footerClass() {
            const a = ['tac']
            if(this.idcards.length) {
                a.push('footer-fixed')
            }
            if (this.ipx && this.idcards.length) {
                a.push('ipx')
            }

            if(!this.idcards.length && (this.refer == 'mine')) {
                a.push('mt')
            }

            return a.join(' ')
        }
    },

    mixins: [mixin],

    methods: {
        async del(id) {
            let res = await this.wx.showModal({
                title: '天天跟我买',
                content: '确定删除这张身份证信息?'
            })

            if(res.cancel) return

            this.$store.dispatch('idcards/delete', id)
        },
        edit(idcard) {
            jump.navigateTo('idcard_edit', {id: idcard.id})
        },
        change(id) {
            if(this.current !== id) {
                this.current = id
                const refer = this.refer
                const events = getApp().globalData.events

                if(refer === 'my_list' || refer === 'coupon_order' || refer === 'order_detail') {
                    setTimeout(() => events.trigger('idcard:order:change', id), 600)
                } else if(this.refer === 'order_confirm') {
                    events.trigger('idcard:change', id)
                }
                
            }
            this.wx.navigateBack({delta: 1})
        },

        toAdd() {
            jump.navigateTo('idcard_edit')
        },

        async laterUpload() {
            this.later = !this.later
            if(this.later) {
                let resp = await this.wx.showModal({
                    title: '天天跟我买',
                    content: "下单成功后请尽快在'我的订单'中上传身份证,在此之前买手将不能为您代买此单商品.",
                    showCancel: false
                })

                if(resp.confirm) {
                    this.wx.navigateBack({delta: 1})
                    getApp().globalData.events.trigger('idcard:change', 0)
                }
            }
        }
    },

    mounted() {
        let that = this
        wx.getSystemInfo({
            success(res) {
                that.ipx = res.model.indexOf('iPhone X') != -1
            }
        })
        this.current = this.$mp.query.id || -1
        this.refer = getKeyByUrl(_.result(nav.prev(), 'route', ''))
        this.$store.dispatch('idcards/list')
    },

    onUnload() {
        Object.assign(this.$data, this.$options.data())
    }
}