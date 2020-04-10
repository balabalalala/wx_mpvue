<template>
    <div class="venue-content-title" :style="contentColor">
        <p>{{fieldItem.title}}</p>
        <i :style="titleColor">{{hourField}}</i>
        <span v-if="fieldItem.status !== 2">{{timeText}}</span>
    </div>
</template>

<script>
export default {
    props: ['fieldItem', 'isCurrent', 'isFirst', 'currentTime'],
    data() {
        return {
            timer: null,
            timeText: ""
        }
    },
    computed: {
        hourField() {
            let hourNumber = new Date(this.fieldItem.start_time)
            return `${hourNumber.getHours()}点场`
        },
        contentColor() {
            if((this.fieldItem.status === 2) || (!this.disclosureCanBuy() && !this.isFirst) ) {
                return 'background:#EAEAEA; color:#a6a6a6;'
            }else {
                if(this.isCurrent && this.isFirst) {
                    return 'color:#fff;background:#ff7f7a;'
                }else {
                    return ''
                }
            }
            
        },
        titleColor() {
            if((this.fieldItem.status === 2) || (!this.disclosureCanBuy() && !this.isFirst) ) {
                return 'background:#EAEAEA; color:#a6a6a6; border-left: 1rpx solid #a6a6a6;'
            }else {
                    if(this.isCurrent && this.isFirst) {
                        return 'color:#fff;'
                    }else {
                        return ''
                    }
            }
            
        }

    },
    watch: {
        'fieldItem.status': function (newVal) {
            if(newVal != 2){
                this.startInterval()
            }
        }
    },
    methods: {
        disclosureCanBuy() {
            for(let discolue of this.fieldItem.hour_items) {
                if(discolue.buy_status === 1){
                    return true
                }
            }
        },
        startInterval () {
            this.timer = setInterval(this.countTime, 1000)
        },
        countTime() {
            function checkTime(i) {
                if(i < 10) {
                    i = "0" + i
                }
                return i
            }

            let leftTime = 0
            let now = Date.now()
            if(this.fieldItem.status === 0){
                //即将开始
                leftTime = (this.fieldItem.start_time - now) / 1000
                this.timeText = "距开始 "
            }else if(this.fieldItem.status === 1){
                //秒杀中
                leftTime = (this.fieldItem.end_time - now) / 1000
                this.timeText = "距结束 "
            }
            let hours = parseInt(leftTime / (60 * 60))
            let minutes = parseInt((leftTime / 60) % 60)
            let seconds = parseInt(leftTime % 60)
            if(hours <= 0 && minutes <= 0 && seconds <= 0 && this.fieldItem.status !== 2) {
                hours = '00'
                minutes = '00'
                seconds = '00'
                this.$emit("fetchVenue")
                setTimeout(()=> {
                    clearInterval(this.timer)
                    this.timer = null
                }, 1000)
                return
            }
            hours = checkTime(hours)
            minutes = checkTime(minutes)
            seconds = checkTime(seconds)

            this.timeText += `${hours}:${minutes}:${seconds}`

        }
    },
    mounted() {
        if(this.fieldItem.status !== 2) {
            this.startInterval()
        }

    }
}
</script>
<style scoped>
.venue-content-title{
    height: 40rpx;
    background: #ff7f7a;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 24rpx;
    text-align: center;
    line-height: 24rpx;
    padding: 0 20rpx;
}
.venue-content-title i{
    margin-left: 10rpx;
    padding-left: 10rpx;
    border-left: 1rpx solid #fff;
}
.venue-content-title span{
    margin-left: auto;
}
</style>
