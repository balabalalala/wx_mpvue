import {mapGetters} from 'vuex'

import mixin from "@/mixin/mixin"
import fly from "@/lib/http"
import utils from "@/common/lib/utils"
import _ from 'underscore'

import labels from './labels'
import Labels from '@/components/address/labels'

import Toast from '@/components/common/toast'

export default {
    data() {
        return {
            addressInfo: {
                user_name: '', // 收货人
                tel_number: '', // 手机号码
                province_name: '', // 区
                city_name: '',  // 市
                county_name: '', // 县
                detail_info: '', // 详细地址
                postal_code: '',  // 邮政编码
                is_primary: 0,
            },

            isDefault: true,

            labels,

            current: -1,
        }
    },

    mixins: [mixin],

    components: {Labels, Toast},

    methods: {
        async save() {

            if(!this.completed) {
                return this.toast('请完善各项信息')
            }

            if(!/^\d{11}$/.test(this.addressInfo.tel_number)) {
                return this.toast('无效的手机号码')
            }

            const params = Object.assign({}, this.addressInfo, {
                tag: this.labels[this.current]
            })

            const id = await this.$store.dispatch('addresses/addOrUpdate', params)

            this.$store.dispatch('addresses/fetchList')

            getApp().globalData.events.trigger('address:change', id || this.addressInfo.id)

            this.wx.navigateBack({delta: this.$root.$mp.query.source == 'mine' ? 1 : 2 })
        }
    },

    computed: {
        ...mapGetters(['address']),
        region: {
            get() {
                return [
                    this.addressInfo.province_name,
                    this.addressInfo.city_name,
                    this.addressInfo.county_name,
                ]
            },
            set(val) {
                [
                    this.addressInfo.province_name,
                    this.addressInfo.city_name,
                    this.addressInfo.county_name,
                ] = val
            }
        },

        regionStr() {
            return this.region.join(' ').trim() || '地区信息'
        },

        // 检验表单是否填写完成
        completed() {
            return _.chain(this.addressInfo)
                    .pick('user_name', 'tel_number', 'province_name', 'city_name', 'county_name', 'detail_info')
                    .values()
                    .every(val => val)
                    .value()
        },
        lastIndex() {
            return this.labels.length - 1
        }

    },

    mounted() {
        // 从全局store中带过来的address
        if(!this.address) return

        this.addressInfo = Object.assign({}, this.address)

        if(this.labels.indexOf(this.addressInfo.tag) == -1) {
            this.labels.splice(this.lastIndex, 1, this.addressInfo.tag)
        }

        this.current = _.indexOf(labels, this.address.tag)
    },

    onUnload() {
        Object.assign(this.$data, this.$options.data())
        this.labels.splice(this.lastIndex, 1, '')
        this.$store.commit('reset')
    }
}