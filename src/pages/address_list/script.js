import { createNamespacedHelpers } from 'vuex'

import _ from 'underscore'

import utils from "@/common/lib/utils"
import mixin from "@/mixin/mixin"
import jump from '@/common/lib/jump'
import nav from '@/common/lib/navigator'
import {getKeyByUrl} from '@/common/lib/pages'

import Toast from '@/components/common/toast'

const {mapState, mapActions} = createNamespacedHelpers('addresses')
export default {
    data() {
        return {
            current: -1, // 当前选中的地址id
            refer: '', // 前一个页面
            ipx: false  //适配iphonex
        }
    },

    mixins: [mixin],

    computed: {
        ...mapState(['addresses'])
    },

    components: {
        Toast
    },

    methods: {
        async chooseAddress() {
            let res = await this.wx.chooseAddress().catch(e => {
                this.toast('获取微信地址失败')
            })

            if(!res) return

            const address = {}
            _.allKeys(res).forEach(key => address[utils.snakeCase(key)] = res[key])

            const aid = await this.$store.dispatch('addresses/addOrUpdate', address)

            if(this.refer !== 'mine') {
                getApp().globalData.events.trigger('address:change', aid || address.id)
                this.wx.navigateBack({delta: 1 })
            } else {
                this.$store.dispatch('addresses/fetchList')
            }
        },

        async del(id) {
            const resp = await this.wx.showModal({
              title: '天天跟我买',
              content: '确定要删除这个地址吗？'
            })

            if(resp.confirm) {
                this.$store.dispatch('addresses/delAddress', id)
            }
        },

        edit(address) {
            this.$store.commit('setAddress', address)
            jump.navigateTo('address_edit', {source: this.refer })
        },

        add() {
            jump.navigateTo('address_edit', {source: this.refer })
        },

        change(id) {
            if(this.refer === 'mine') return

            if(this.current !== id) {
                this.current = id
                getApp().globalData.events.trigger('address:change', id)
            }
            this.wx.navigateBack({delta: 1})
        }
    },

    mounted() {
        let that = this
        wx.getSystemInfo({
            success(res) {
                that.ipx = res.model.indexOf('iPhone X') != -1
            }
        })
        this.refer = getKeyByUrl(_.result(nav.prev(), 'route', ''))
        this.$store.dispatch('addresses/fetchList')

        // 通过query设置默认选中的地址
        this.current = parseInt(this.$root.$mp.query.id) || -1
    }
}