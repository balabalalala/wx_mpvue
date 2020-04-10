import _ from 'underscore'
import qs from 'qs'
import mixin from '@/mixin/mixin'
import util from '@/lib/util'
import embed from '@/lib/data_embedding'
import jump from '@/common/lib/jump'
import user from '@/lib/user'
import fly from "@/lib/http"

import Slide from '@/components/disclosure/slide'
import Info from '@/components/disclosure/info'
import Creator from '@/components/disclosure/creator'
import Desc from '@/components/disclosure/desc'
import DescHow from '@/components/disclosure/desc_how'
import InnerGroup from '@/components/disclosure/inner_group'
import Links from '@/components/disclosure/links'
import Images from '@/components/disclosure/images'
import Recommends from '@/components/disclosure/recommends'
import Subscribe from '@/components/disclosure/subscribe'
import SecondKill from '@/components/disclosure/second_kill'
import DisclosureFooter from '@/components/disclosure/footer'
import Sku from '@/components/disclosure/sku'
import LinksModal from '@/components/disclosure/links_modal'
import GuideModal from '@/components/disclosure/guide_modal'
import RelatedArticle from '@/components/disclosure/related_article'

import Index from '@/components/common/to_index'
import Auth from '@/components/common/auth'
import Toast from '@/components/common/toast'
import FloatWindow from '@/components/common/floating_window'
import SubscribeModal from '@/components/common/subscribe_modal'
import Comment from '@/components/common/comment'

import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('disclosure')

export default {
    mixins: [mixin],
    data() {
        return {
            preview: '',
            fadeOut: false,
            fetched: false,
            contactMsgPath: '',
            appModalTitle: '',
            appModalPath: '',
            pageTrackInfo: '',
        }
    },
    components: {
        Slide, Info, Creator, Desc, Images,
         Recommends,
        RelatedArticle,
        Subscribe, SecondKill, DisclosureFooter, Links,
        Sku, LinksModal, GuideModal, FloatWindow,
        Auth, Index, Toast, DescHow, InnerGroup, SubscribeModal,Comment
    },
    computed: {
        ...mapGetters(['showSecondKill', 'copyLinkNote']),
        ...mapState(['modalKey', 'fragment', 'tbkRemind', 'isShowSubscribeAlert']),
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'title', 'price', 'id', 'track_info', 'deal_price','audit_switch'),
            image: state => !_.isEmpty(state.disclosure) ? state.disclosure.goods_imgs[0] : '',
            audit_switch: state => _.pick(state.audit_switch, 'prop_value'),
        }),
        getContactMsgPath () {
           this.contactMsgPath =  `/pages/disclosure/main?gdid=${this.disclosure.id}&source=app_recommend`
        }
    },
    methods: {
        ...mapMutations(['hideModal', 'showModal', 'toggleAuth','setTbkRemind','hideSubscribeModal']),
        show_app_alert(burst_num) {
            this.appModalTitle = 1 >= burst_num ? '天天跟我买官方福利群' : '天天跟我买官方拼单群'
            this.appModalPath = `/pages/disclosure/main?gdid=${this.disclosure.id}&source=${1 >= burst_num ? 'good_price_group' : 'mono_group'}` 
            this.showModal('from_app_alert')
        },
        setFadeOut: _.debounce(function(e) {
            this.fadeOut = false
        }, 2000),
        toMember(e) {
            wx.switchTab({
                url: '/pages/member/main'
              })
        },
        buyerBuy() {
            if(!user.isLogin()) {
                return this.toggleAuth()
            }
            this.showModal(this.fragment.buyer_modal_key)
        },
        async showActivity(query) {
            const asn = this.fragment.asn

            if(!asn || query.isActivity == '1') {
                return
            }
            const resp = await this.wx.showModal({
                content: '您有活动正处于助力中，是否前往？',
                contentColor: '#4c4c4c',
                confirmText: '前往活动',
                showCancel: true,
                confirmColor: '#4c4c4c'
            })

            resp.confirm && jump.redirectTo('one_cent_rob', { activitySn: asn})
        }
    },

    onLoad() {
        const query = this.$root.$mp.query
        this.pageTrackInfo = query.track_info
        if(query.preview_img) {
            this.preview = decodeURIComponent(query.preview_img)
        }

        this.$store.dispatch('disclosure/detail', query.gdid).then(() => {
            this.fetched = true
            this.showActivity(query)
        })
        this.$store.dispatch('disclosure/recommend', query.gdid)
    },

    onReady() {
        // this.scene = wx.getStorageSync('scene')
        // app 爆料详情点击入群引导逻辑
        // if(this.$root.$mp.query.burst_num && this.scene === 1069) {
        if(this.$root.$mp.query.burst_num) {
            this.show_app_alert(this.$root.$mp.query.burst_num)
        }
    },

    onPageScroll: _.throttle(function(e){
        if(!this.fadeOut) {
            return this.fadeOut = true
        }

        this.setFadeOut()
    }, 150),

    onShareAppMessage() {
        const shareCode = util.uuid(), id = this.disclosure.id

        embed.reportShareIncrement({
            type: 'disclosure',
            entity_id: id,
            share_code: shareCode
        })

        const params = {share_code: shareCode, gdid: id }
        
        return {
            title: `¥ ${this.disclosure.deal_price} ${this.disclosure.title}`,
            path: `/pages/disclosure/main?${qs.stringify(params)}`
        }
    },

    onUnload() {
        Object.assign(this.$data, this.$options.data())
        this.$store.commit('disclosure/reset')
        // this.$refs.commentComponent.clearContent()
    }
}