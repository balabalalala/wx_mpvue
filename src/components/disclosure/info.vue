<template>
    <div class="container" :class="!disclosure.detail_rec ? 'title-border': ''">
        <div class="d-title">
            <div class="d-title-l">
                <h2 :class="!disclosure.buy_status ? 'gray' : ''"><img v-if="disclosure.title_icon"
                        :src="disclosure.title_icon" /> {{ titleFormat }}</h2>
            </div>
        </div>
        <div class="d-deal-price">
            <div :class="!disclosure.buy_status ? 'em-gray' : 'em-red'">
                <span v-if="!disclosure.buy_status">已过期 </span>
                <span>{{dealPriceFormat}}</span>
            </div>
        </div>
        <div class="d-create-info">
            <p><span class="d-mall">{{ disclosure.mall }}</span><span class="line">|</span>
                <span>{{disclosure.release_time}}</span></p>
        </div>
        <!-- 值与不值-->
        <div class="value-box">
            <div class="value" @click="value('worth',0)" data-name="worth">
                <img class="value-img" data-name="worth" :src="valueBg">
                <span class="value-num" :style="valueColor" data-name="worth">{{value_of_not.value}}</span>
            </div>
            <div class="value-line"></div>
            <div class="no-value" @click="value('noWorth',1)" data-name="notWorth">
                <img class="no-value-img" data-name="notWorth" :style="noValueColor" :src="noValueBg">
                <span class="value-num no-value-num" :style="noValueColor"
                    data-name="notWorth">{{value_of_not.no_value}}</span>
            </div>
        </div>
        <auth />
    </div>
</template>

<script>
    import _ from 'underscore'
    import util from "@/lib/util"
    import icons from '@/pages/disclosure/icons'
    import Auth from '@/components/common/auth'
    import fly from "@/lib/http"
    import user from "@/lib/user"
    import jump from '@/common/lib/jump'

    import { createNamespacedHelpers, mapMutations } from 'vuex'
    const { mapState } = createNamespacedHelpers('disclosure', 'value_of_not')

    export default {
        data() {
            return {
                isClick: true, //是否点击过值或不值
                eType: null,
                valueData: {},
                worth: false, //值的背景图片的替换
                noWorth: false,//不值
                worthId: null, //取消值传的id
                shareImg: icons.bg('share')
            }
        },
        components: { Auth },
        computed: {
            ...mapState({
                disclosure: state => _.pick(state.disclosure, 'title', 'title_icon', 'deal_price', 'mall', 'release_time', 'buy_status', 'detail_rec'),
                value_of_not: state => _.pick(state.value_of_not, 'id', 'eid', 'result', 'value', 'no_value', 'value_of_not', 'e_type'),
                audit_switch: state => _.pick(state.audit_switch, 'prop_value')
            }),
            titleFormat() {
                return this.disclosure.title ? util.beautySub(this.disclosure.title, 33) : ''
            },
            dealPriceFormat() {
                if (this.audit_switch.prop_value == '1') {
                    return this.disclosure.deal_price ? util.beautySub(this.disclosure.deal_price, 20) : ''
                } else {
                    return this.disclosure.deal_price ? util.beautySub(this.disclosure.deal_price, 20).replace('包邮', '') : ''
                }

            },
            valueBg() {
                return this.worth && this.valueData.value_of_not == 0 ? 'https://img-ali.xiaohongchun.com.cn/admin/15668949315681fb3d2c1.png' : 'https://img-ali.xiaohongchun.com.cn/admin/156508390156932a2c380.png'
            },
            noValueBg() {
                return this.noWorth && this.valueData.value_of_not == 1 ? 'https://img-ali.xiaohongchun.com.cn/admin/1566894939015505f7aa.png' : 'https://img-ali.xiaohongchun.com.cn/admin/15650836881402b4160b.png'
            },
            valueColor() {
                if (this.worth && this.valueData.value_of_not == 0) {
                    return 'color:#DC3538'
                } else {
                    return 'color:#808080'
                }
            },
            noValueColor() {
                if (this.noWorth && this.valueData.value_of_not == 1) {
                    return 'color:#DC3538'
                } else {
                    return 'color:#808080'
                }
            }
        },
        methods: {
            ...mapMutations(['toggleAuth', 'setAuthName']),
            // 点击值与不值
            async value(name, num) {
                if (!user.isLogin()) {
                    this.setAuthName(name)
                    return this.toggleAuth()
                }
                this.eType = this.valueData.e_type
                this.valueData.value_of_not = num
                // 值
                if (this.valueData.value_of_not == 0) {
                    let resp = await fly.post(`/lsj/v3/disclosure/add_value_of_not`, {
                        eid: this.valueData.eid,
                        value_of_not: num,
                        e_type: this.eType,
                    })
                    resp = resp.data
                    this.worthId = resp.id
                    if (this.worth) {
                        if (this.valueData.value > 0) {
                            let resp = await fly.delete('/lsj/v3/disclosure/del_value_of_not?id=' + this.worthId)
                            this.valueData.value--
                            wx.showToast({
                                title: '您已取消点值',
                                icon: 'none',
                                duration: 1500
                            })
                        }
                        this.worth = false
                    } else {
                        if (this.noWorth) {
                            this.noWorth = false
                            this.valueData.value++
                            this.valueData.no_value--
                        } else {
                            this.valueData.value++
                        }
                        this.worth = true
                    }

                }
                // 不值
                if (this.valueData.value_of_not == 1) {
                    let resp = await fly.post(`/lsj/v3/disclosure/add_value_of_not`, {
                        eid: this.valueData.eid,
                        value_of_not: num,
                        e_type: this.eType,
                    })
                    resp = resp.data
                    this.worthId = resp.id
                    if (this.noWorth) {
                        if (this.valueData.no_value > 0) {
                            let resp = await fly.delete('/lsj/v3/disclosure/del_value_of_not?id=' + this.worthId)
                            this.valueData.no_value--
                            wx.showToast({
                                title: '您已取消点不值',
                                icon: 'none',
                                duration: 1500
                            })
                        }
                        this.noWorth = false
                    } else {
                        if (this.worth) {
                            this.worth = false
                            this.valueData.no_value++
                            this.valueData.value--
                        } else {
                            this.valueData.no_value++
                        }
                        this.noWorth = true
                    }
                }
            },
        },
        mounted() {
            this.worthId = this.valueData.id
            if (this.valueData.result && this.valueData.value_of_not == 0) {
                this.noWorth = false
                this.worth = true
            }
            if (this.valueData.result && this.valueData.value_of_not == 1) {
                this.worth = false
                this.noWorth = true
            }
        },
        created() {
            this.valueData = this.value_of_not
        }
    }
</script>

<style scoped>
    .container {
        margin-top: 44rpx;
        padding: 0 0 40rpx 40rpx;
        font-size: 30rpx;
        line-height: 1.4;
        font-weight: 500;
        position: relative;
        overflow: hidden;
    }

    h2 {
        color: #000;
        max-height: 2.8em;
        /* overflow: hidden; */
        line-height: 44rpx;
        font-weight: 500;
        /* display: -webkit-box;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; */
    }

    h2 img {
        display: inline-block;
        width: 100rpx;
        height: 32rpx;
        /* margin-right: .5em; */
        vertical-align: -5rpx;
    }

    .em-red {
        line-height: 1;
        font-size: 32rpx;
        font-weight: 600;
        color: #DC3538;

    }

    .gray {
        color: #808080;
    }

    .em-gray {
        font-size: 32rpx;
        color: #A5A5A5;
    }

    .d-create-info {
        display: flex;
        align-content: center;
        /* float: left; */
    }

    .d-create-info p {
        width: 385rpx;
        font-weight: 400;
        line-height: 1;
        font-size: 26rpx;
        color: #A5A5A5;
        margin-top: 26rpx;
    }

    .d-create-info .d-mall {
        float: left;
        line-height: 26rpx;
        max-width: 145rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }


    /* .d-create-info p {
    max-width: 385rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 400;
    line-height: 1;
    font-size: 26rpx;
    color: #808080;
    margin-top: 26rpx;
} */
    /* .share {
    float: right;
} */
    .line {
        display: inline-block;
        margin: 0 10rpx;
    }

    .d-title {
        overflow: hidden;
    }

    .d-title-l {
        width: 641rpx;
        float: left;
        font-size: 32rpx;
        line-height: 42rpx;

    }

    .d-deal-price {
        margin-top: 32rpx;
        font-weight: 600;
    }

    .value-box {
        position: absolute;
        left: 468rpx;
        bottom: 34rpx;
        display: flex;
        flex-wrap: nowrap;
        align-content: space-between;
        height: 40rpx;
        padding: 11rpx 20rpx;
        box-sizing: border-box;
        margin-top: 5rpx;
        border: 1rpx solid rgba(204, 204, 204, 1);
    }

    .value {
        display: flex;
        align-items: center;
        height: 100%;
        line-height: 36rpx;
    }

    .value-img {
        width: 34rpx;
        height: 34rpx;
    }

    .value-num {
        font-size: 24rpx;
        font-weight: 600;
        color: #808080;
        line-height: 35rpx;
        margin-left: 10rpx;
    }

    .value-line {
        display: flex;
        width: 2rpx;
        height: 14rpx;
        margin: 2rpx 20rpx;
        background: rgba(204, 204, 204, 1);
    }

    .no-value {
        display: flex;
        align-items: center;
        height: 100%;
        line-height: 36rpx;
    }

    .no-value-img {
        width: 50rpx;
        height: 34rpx;
    }

    .no-value-num {
        margin-left: 10rpx;
    }
</style>