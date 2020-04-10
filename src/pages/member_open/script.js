import _ from 'underscore'
import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import jump from '@/common/lib/jump'
import nav from "@/lib/navigator"
import MemberRight from '@/components/member/member_right'
import SuccessModal from '@/components/member/open_success_modal'

export default {
    mixins: [mixin],
    components: {SuccessModal, MemberRight},

    data() {
        return {
            member: {},
            cards: [],
            selectId: 0,
            paying: false, // 是否支付中, 防止重复提交
            showSuccessModal: false,
            orderParams: {},
        }
    },

    onShow () {
        if(nav.page().options.sn) {
            this.orderParams = {sn:nav.page().options.sn, asn:nav.page().options.asn, address_id: nav.page().options.address_id}
        } else{
            this.orderParams = null
        }
    },

    onLoad() {
        this.showSuccessModal = false
    },

    async mounted() {
        // 获取会员卡类型
        let resp = await fly.get('/lsj/v3/member/get_member_meal')
        this.member = resp.data.member
        let allCard = resp.data.member_cards
        // 如果开过会员 只能开年卡
        if (this.member.member_buy == 1) {
            allCard = allCard.filter(card => card.type !== 7)
        }
        this.cards = allCard
        this.selectId = this.defaultSelectId
    },

    methods: {
        async toPay (e) {
            if(this.paying) return;
            this.paying = true
            this.wx.showLoading({title: '支付中...'})

            let resp;
            try {
                resp = await fly.post('/lsj/v3/pay/member', {
                    card_id: this.selectId,
                    form_id: e.mp.detail.formId
                })

                resp = resp.data
                resp = await this.wx.requestPayment({
                    timeStamp: resp.timeStamp,
                    nonceStr: resp.nonceStr,
                    package: resp.package,
                    signType: resp.signType,
                    paySign: resp.paySign,
                })
            } catch(e) {
                console.error(e)
            } finally {
                this.paying = false
                this.wx.hideLoading()
            }

            if(!resp || resp.errMsg !== 'requestPayment:ok') {
                return this.wx.showToast({
                    title: '支付失败, 请重新支付 ...',
                    icon: 'none',
                    duration: 3000
                })
            }
            else {
                this.showSuccessModal = true
            }
        },

        toIntro() {
            jump.navigateTo('web_view', {
                url: '/member/intro',
                webPage: true,
            })
        },
    },

    computed: {
        notMemberPeopleCard() {
            return this.cards.find(card => card.type === 7) || {}
        },

        hadMemberPeopleCard() {
            return this.cards.find(card => card.type !== 7) || {}
        },

        selectedCard() {
            return this.cards.find(card => card.id === this.selectId) || {}
        },

        defaultSelectId() {
            // 默认选中的 card_id  设计为 有体验卡 选它!!!
            if(!_.isEmpty(this.notMemberPeopleCard)) {
                return this.notMemberPeopleCard.id
            }

            return this.hadMemberPeopleCard.id
        },

        successImg() {
            // 会员卡类型: 1 体验卡  2 月卡  3 季卡  4 半年卡  5 年卡  7 体验月卡  8 拼团卡
            let imgUrl = "https://img-ali.xiaohongchun.com.cn/admin/"
            if (this.orderParams) {
                // 订单过来的 有'继续购物'
                imgUrl += (this.selectedCard.type === 5 || this.selectedCard.type === 9) ? '15476350975282d24e859.png' : '15476350975201bbc5516.png'
            } else {
                imgUrl += (this.selectedCard.type === 5 || this.selectedCard.type === 9) ? '154763509752726664891.png' : '154763509751932da41ea.png'
            }

            return imgUrl
        },
    }
};
