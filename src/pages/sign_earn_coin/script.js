import _ from 'underscore'
import utils from "@/lib/util"
import embed from "@/lib/data_embedding"
import qs from "qs"
import ToIndex from "@/components/common/to_index"
import mixin from "@/mixin/mixin"

import { createNamespacedHelpers } from 'vuex'

const { mapState} = createNamespacedHelpers('disclosure')


let activitySn = ''

export default {
    mixins: [mixin],
    data () {
        return {
            contactMsgPath: '',
        }
    },
    components: {
        ToIndex,
    },

    methods: {
        
    },
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'title', 'price', 'id', 'track_info', 'deal_price', 'audit_switch'),
        }),
        getContactMsgPath() {
            this.contactMsgPath = `/pages/disclosure/main?gdid=${this.disclosure.id}&source=app_recommend`
        }
    },
    onShareAppMessage () {
        const shareCode = utils.uuid()
        const params = {
            share_code: shareCode,
            share_activity_sn: activitySn
        }
        embed.reportShareIncrement({
            type: "signInAndEarnCoin",
            share_code: shareCode
        })
        return {
            title: '每天领金币，下单当钱花，快来参加啊~',
            path: "/pages/sign_earn_coin/main?" + qs.stringify(params),
            imageUrl: 'https://img-ali.xiaohongchun.com.cn/admin/15604996758211e01f12f.png'
        }
    },

}