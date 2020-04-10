<template>
    <div class="status-container">
        <span>{{orderStatusTitle}}</span>
        <span v-if="showRestTime">，剩余 {{restTime}}</span>
    </div>
</template>

<script>
import moment from 'moment'
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('orderConfirm')
export default {
    data () {
        return {
            restTime: '',
            timer: null
        }
    },
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'status', 'end_time', 'sn')
        }),
        ...mapGetters(['orderStatusTitle']),
        showRestTime() {
            return this.order.status === 7 && this.order.end_time > Date.now()
        }
    },
    watch: {
        restTime (newVal) {
            if(newVal == '00:00') {
                clearInterval(this.timer)
                setTimeout(() => {
                    this.fetch({osn: this.order.sn})
                }, 500)
            }
        }
    },
    methods: {
        ...mapActions({fetch: 'getOrderDetail'}),
        restTimeEvent() {
            if (!this.showRestTime)  return
            this.timer = setInterval(() => {
                let now = Date.now()
                let time = this.order.end_time - Date.now()
                this.restTime = moment(time).format('mm:ss')
                console.log(this.restTime)
            }, 1000)
        }
    },
    mounted () {
        setTimeout(()=> {
            this.restTimeEvent()
        }, 250)
    },
    onShow() {
        if(this.restTime) this.restTime = ''
        this.restTimeEvent()
    },
    onHide() {
        clearInterval(this.timer)
    },
    onUnload() {
        clearInterval(this.timer)
    }
}

</script>

<style scoped>
.status-container {
    width: 100%;
    height: 87rpx;
    line-height: 87rpx;
    text-align: center;
    font-size: 28rpx;
    color: #4C4C4C;
    font-weight: 500;
}
</style>