import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import utils from "@/lib/util"
import jump from "@/common/lib/jump"

export default {
    mixins: [mixin],
    data() {
        return {
            connectionInfo: {}
        }
    },
    methods: {
        callPhone() {
            wx.makePhoneCall({
                phoneNumber: '4000500565'
            })
        },
        async fetch() {
            let resp = await fly.get(`/lsj/v1/user/help`)
            resp = resp.data
            this.connectionInfo = resp.connectionInfo
        },
        jump(url) {
            let params = {
                webPage: true,
                notShare: true,
                url: url
            }
            jump.navigateTo('web_view', params)
        }
    },
    onLoad() {
        this.fetch()
    }
}
