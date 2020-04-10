<template>
    <div :data-track_info="disclosure.track_info" data-name="1111_home_flash_buy" class="container" @click="toDetail">
        <img data-name="1111_home_flash_buy" class="goods-image" :src="disclosure.image_url"/>
        <img v-if="disclosure.icon_sign" class="icon-img" src="https://img-ali.xiaohongchun.com.cn/admin/1543580901684180905b3.png"/>
        <p data-name="1111_home_flash_buy" class="goods-title" style="-webkit-box-orient: vertical;">{{disclosure.d_title}}</p>
        <p data-name="1111_home_flash_buy" class="goods-desc">{{disclosure.editor_rec_desc}}</p>
        <p data-name="1111_home_flash_buy" class="goods-price">{{disclosure.deal_price}}</p>
        <div data-name="1111_home_flash_buy" v-if="isPercent" class="sale-content">
            <i data-name="1111_home_flash_buy" class="saled" :style="amountPercent"></i>
        </div>
        <p data-name="1111_home_flash_buy" v-if="isPercent" class="sale-desc">{{saleDesc}}</p>
        <div class="btn-content">
            <div data-name="1111_home_flash_buy" v-if="btnStatus === 1" class="gray-btn">抢光了</div>
            <div data-name="1111_home_flash_buy" v-else-if="btnStatus === 2" class="red-btn">立即抢购</div>
            <div name="sale_tip_on" v-else-if="btnStatus === 3" class="coffee-btn">
                <userinfo-auth name="sale_tip_on" @authed="remind(true)" note="提醒我"></userinfo-auth>
            </div>
            <div name="sale_tip_off" v-else-if="btnStatus === 4" class="coffee-fade-btn">
                <userinfo-auth name="sale_tip_off" @authed="remind(false)" note="已预约"></userinfo-auth>
            </div>
        </div>

        <p data-name="1111_home_flash_buy" v-if="btnStatus ===3 || btnStatus === 4" class="goods-status">{{startRob}}</p>


    </div>
</template>
<script>
import jump from "@/common/lib/jump"
import UserinfoAuth from "@/components/common/userinfo_auth"
export default {
    components: {UserinfoAuth},
    props: ['disclosure', 'fieldItem', 'currentTime'],
    computed: {
        isPercent() {
            //return Date.now() >= this.disclosure.seckill_starttime
            return this.currentTime >= this.disclosure.seckill_starttime
        },
        saleDesc() {
            //if((Date.now() > this.fieldItem.end_time) || this.disclosure.amount_percent === 100 || (Date.now() > this.disclosure.endtime_for_buyable)){
            if((this.currentTime > this.fieldItem.end_time) || this.disclosure.amount_percent === 100 || (this.currentTime > this.disclosure.endtime_for_buyable)){
                return "已售罄"
            }else{
                return `已抢${this.disclosure.amount_percent}%`
            }

        },
        amountPercent() {
            //if((Date.now() > this.fieldItem.end_time) || (Date.now() > this.disclosure.endtime_for_buyable)) {
            if((this.currentTime > this.fieldItem.end_time) || (this.currentTime > this.disclosure.endtime_for_buyable)) {
                return `width:100%`
            }else{
                return `width:${this.disclosure.amount_percent}%`
            }
        },
        btnStatus () {
            //if((Date.now() > this.fieldItem.end_time) || this.disclosure.buy_status !== 1){
            if((this.currentTime > this.fieldItem.end_time) || this.disclosure.buy_status !== 1){
                //抢光了
                return 1
            }else{
                //if(Date.now() < this.disclosure.seckill_starttime){
                if(this.currentTime < this.disclosure.seckill_starttime){
                    if(this.disclosure.remind){
                        return 4
                    }else{
                        return 3
                    }
                }else{
                    return 2
                }
            }
        },
        startRob() {
            function addZero(num){
                if(num < 10){
                    return `0${num}`
                }else{
                    return num
                }
            }
            let date = new Date(this.disclosure.seckill_starttime)
            //return `${date.getDate()}日 ${addZero(date.getHours())}:${addZero(date.getMinutes())}开抢`
            return `${addZero(date.getHours())}:${addZero(date.getMinutes())}开抢`
        }
    },
    methods: {
        toDetail(event) {
            if(event.target.dataset.name !== "sale_tip_on" && event.target.dataset.name !== "sale_tip_off") {
                jump.navigateTo('disclosure', {gdid: this.disclosure.d_id}, event)
            }
        },
        remind(type) {
            if(type){
                //当前是开始提醒
                //if((this.disclosure.seckill_starttime - Date.now()) > 3*60*1000){
                if((this.disclosure.seckill_starttime - this.currentTime) > 3*60*1000){
                    //距离开抢大于3分钟
                    this.$emit("startTipHandle", {threeTip: true, did: this.disclosure.d_id})

                }else{
                    //距离开抢小于等于3分钟
                    this.$emit("startTipHandle", {threeTip: false, did: this.disclosure.d_id})

                }
                this.disclosure.remind = !this.disclosure.remind
                return
            }else{
                //当前是取消提醒
                let params = {fieldItem: this.fieldItem, did: this.disclosure.d_id, title: "取消提醒，您将不能及时看到活动开始哦", topBtn: "取消提醒", bottomBtn: "保持提醒"}
                this.$emit("disclosureTipHandle", params)
            }


        }
    }

}
</script>

<style scoped>
.container{
    position: relative;
    height: 100%;
    padding: 20rpx;
}
.goods-image{
    width: 320rpx;
    height: 320rpx;
}
.goods-title{
    margin-top: 14rpx;
    height: 72rpx;
    font-size: 28rpx;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height: 38rpx;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.goods-desc{
    margin-top: 10rpx;
    font-size: 22rpx;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height: 38rpx;
    opacity: 0.6;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.goods-price{
    margin-top: 16rpx;
    height: 34rpx;
    font-size: 32rpx;
    font-weight: bold;
    color:rgba(255,67,28,1);
    line-height: 38rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.sale-content{
    margin-top: 20rpx;
    width: 320rpx;
    height: 6rpx;
    background: #EAEAEA;
}
.saled{
    height: 100%;
    background: #FF431C;
}
.sale-desc{
    margin-top: 10rpx;
    height: 21rpx;
    font-size: 22rpx;
    color:rgba(0,0,0,1);
    line-height: 38rpx;
}
.btn-content{
    margin-top: 30rpx;
    text-align: center;
}
.gray-btn{
    font-size: 30rpx;
    text-align: center;
    line-height: 62rpx;
    display: inline-block;
    width: 180rpx;
    height: 62rpx;
    background: #EAEAEA;
    color: #000;
    opacity: 0.7;
}
.red-btn{
    font-weight: bold;
    font-size: 30rpx;
    text-align: center;
    line-height: 62rpx;
    display: inline-block;
    width: 180rpx;
    height: 62rpx;
    background: #ff7f7a;
    color: #fff;
}
.coffee-btn{
    font-size: 30rpx;
    text-align: center;
    line-height: 62rpx;
    display: inline-block;
    width: 180rpx;
    height: 62rpx;
    background: #ff7f7a;
    color: #fff;
}
.coffee-fade-btn{
    font-size: 30rpx;
    text-align: center;
    line-height: 62rpx;
    display: inline-block;
    width: 180rpx;
    height: 62rpx;
    background: #ffa8a5;
    color: #fff;
    opacity: 0.6;
}
.goods-status{
    margin: 10rpx 0 20rpx;
    height: 21rpx;
    font-size: 22rpx;
    color:#666;
    line-height: 11rpx;
    text-align: center;
    opacity: 0.6;
}
.icon-img{
    width: 70rpx;
    height: 70rpx;
    position: absolute;
    left: 20rpx;
    top: 30rpx;
}
</style>

