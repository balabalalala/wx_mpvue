import nav from "@/lib/navigator"
import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import jump from "@/common/lib/jump"

export default {
    data() {
        return {
            sn: "",
            newPeople: false, //是否是新用户首单
            money: 0,
            chopper: 0
        }
    },
    mixins: [mixin],
    methods: {
        async fetch() {
            const resp = await fly.get(`/lsj/v3/order/new_old_people?sn=${this.sn}`)
            this.sn = resp.data.o_sn
            this.newPeople = resp.data.new_people
            this.money = (resp.data.pay_total / 100).toFixed(2)
            this.chopper = resp.data.num
        },
        backIndex() {
            jump.switchTab("home")
        },
        toOrder() {
            jump.redirectTo("order_detail", {sn: this.sn})
        }

    },
    onShow() {
        this.sn = nav.page().options.sn
        this.fetch()
    }
}
