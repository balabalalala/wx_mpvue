<template>
<div>
    <div :class="isIPX ? 'container' : 'container no-ipx'">
        <span>剩余支付时间：</span>
        <span>{{formatTime}}</span>
        <span class="dif-price">差价：￥{{diff_price}}</span>
    </div>
</div> 
</template>
<script>
import mixin from '../../mixin/mixin'
export default {
    mixins: [mixin],
    data () {
        return {
            remaining:{
                h:0,
                m:0,
                s:0,
            },
            formatTime: "",
            timer:null
        }
    },
    props:{
        stoptime: {
            type:Number,
            value: 0,
            observer: function(newVal, oldVal){
                this.timer = setInterval(()=>this.stoptimer(),1000)
            }
        },
        
        diff_price:{
            type:Number,
            value:0
        }
    },
    methods: {
        stoptimer(){
            let minus_ms = (this.stoptime - Date.now())/1000
            if(minus_ms <=0){
                this.formatTime = `${this.remaining.h}:${this.remaining.m}:${this.remaining.s}`
                return 
            }
            this.remaining.h  = parseInt(minus_ms/3600)
            this.remaining.m  = parseInt(minus_ms/60%60)
            this.remaining.s  = parseInt(minus_ms%60)
    
            if (this.remaining.h <= 0 && this.remaining.m <= 0 && this.remaining.s <= 0 ) {
                this.remaining.s = 0
                clearInterval(this.timer)
            }
            this.formatTime = `${this.remaining.h}:${this.remaining.m}:${this.remaining.s}`
        }
    },
    mounted() {
        this.timer = setInterval(()=>this.stoptimer(),1000)
    },
}
</script>
<style scoped>
.container{
    position: fixed;
    width: 100%;
    height: 80rpx;
    bottom: 106rpx;
    margin-bottom: 55rpx;
    background-color: #FFD8D8;
    font-size: 28rpx;
    line-height: 80rpx;
    padding: 0 35rpx;
    font-weight: bold;
    box-sizing: border-box;
    z-index: 2;
}
.no-ipx {
    margin-bottom: -6rpx;
}
.dif-price{
    float: right;
    color: #dc3538;
}
.static-pon{
    height: 80rpx;
}
</style>
