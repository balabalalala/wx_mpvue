<template>
<div class="container">
    距活动{{ starting ? '结束' : '开始'  }}还有
    <div class="countdown">
        <span>{{ hour }}</span>
        :
        <span>{{ minute }}</span>
        :
        <span>{{ second }}</span>
    </div>

    <button v-if="!starting" :data-name="btnName" @click="toggleRemind">{{ remind ? '取消' : '开始' }}提醒</button>
</div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'

import user from '@/lib/user'

import { createNamespacedHelpers } from 'vuex'
const {mapState, mapActions, mapMutations, mapGetters} = createNamespacedHelpers('disclosure')

const threeMinutesMsg = '订阅成功！\n\n活动马上开始哟，准备好姿势开抢吧！'
const noThreeMinutesMsg = '订阅成功！\n\n将在活动开始前3分钟提醒您，您也可以关注“天天跟我买”公众号，获取更多好价信息。'

const interval = 1e3 // 倒计时间隔

function pad(val) {
    return val.toString().padStart(2, 0);
}

export default {
    data() {
        return {
            hour: '00',
            minute: '00',
            second: '00',
        }
    },
    computed: {
        ...mapState(['now']),
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'seckill', 'starttime_for_buyable', 'endtime_for_buyable'),
            // 是否订阅
            remind: state => state.user.remind
        }),
        ...mapGetters({
            show: 'showSecondKill',
            starting: 'secondKillStarting'
        }),
        btnName() {
            return 'second_kill_subscribe_' + (this.remind ? 'off' : 'on')
        },
        in3Minutes() {
            return this.disclosure.starttime_for_buyable - this.now  < 3 * 60 * 1e3
        },
    },
    methods: {
        ...mapMutations(['updateNow']),
        ...mapActions({toggle: 'toggleUserRemind'}),
        countdown() {
            this.updateNow()

            if(!_.isEmpty(this.disclosure)) {
                const eventTime = this.starting ? this.disclosure.endtime_for_buyable : this.disclosure.starttime_for_buyable
                const duration = moment.duration(Math.abs(eventTime - Date.now()), 'milliseconds')

                this.hour = pad(duration.days() * 24 + duration.hours())
                this.minute = pad(duration.minutes())
                this.second = pad(duration.seconds())

                // 如果已隐藏，停止倒计时
                if(!this.show) {
                    return
                }
            }

            setTimeout(this.countdown.bind(this), interval)
        },

        async toggleRemind() {
            if(!user.isLogin()) {
                return this.$store.commit('toggleAuth')
            }

            if(this.remind) {
                const resp = await this.wx.showModal({
                    title: '取消提醒',
                    content: '您将不能及时看到活动开始哦',
                    cancelText: '取消提醒',
                    confirmText: '保持提醒',
                })

                return resp.cancel && this.toggle()
            }
            
            this.toggle()
            const msg = this.in3Minutes ? threeMinutesMsg : noThreeMinutesMsg
            console.log(msg)
            this.$root.toast(msg)
        }
    },
    // TODO: 此处有问题，即使页面pop了，setTiemout也会一直存在
    mounted() {
        this.countdown()
    }
}
</script>

<style scoped>
.container {
    line-height: 100rpx;
    background: #FFE7EB;
    padding: 0 40rpx;
    font-size: 26rpx;
    color: #222;
}

.countdown {
    display: inline-block;
    margin-left: 26rpx;
    color:#dc3538;
}

.countdown span {
    display: inline-block;
    min-width: 42rpx;
    line-height: 38rpx;
    text-align: center;
    font-size: 24rpx;
    padding: 0 6rpx;
    box-sizing: border-box;
    color: white;
    background:#dc3538;
}

button {
    float: right;
    width: 140rpx;
    margin-top: 30rpx;
    line-height: 40rpx;
    text-align: center;
    background: rgb(255, 61, 61);
    border: 2rpx solid rgb(255, 61, 61);
    border-radius: 6rpx;
    font-size: 26rpx;
    color: white;
    vertical-align: middle;
    padding: 0;
}
</style>