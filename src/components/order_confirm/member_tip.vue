<template>
    <div data-close="close" class="container" @click="closeMemberTip">
        <div class="content">
            <div v-if="status==4"> 
                <p>马上成为年卡会员</p> 
                <p>全年可省<span class="title"> {{economyMoney}}元 </span>代买服务费</p>
                <p>本单可省<span class="title"> {{saveAmountComputed / 100 || order.service_fee / 100}}元 </span></p>
            </div>
            <div v-else>
                <p><span>开通会员，马上可省</span><span class="title"> {{saveAmountComputed / 100 || order.service_fee / 100}}元 </span>代买服务费</p>
                <p>超值月卡只要0.99元</p>
            </div>
            <div class="btn_content">
                <p data-name="o_no_open" class="not_buy" @click="closeMemberTip">暂不开通</p>
                <p data-name="o_open" class="to_buy" @click="toBuyMember">去开通</p>
            </div>
            <div data-name="o_no_tip" class="no_more" @click="noMoreMemberTip">
                <div data-name="o_no_tip" class="check_circle">
                    <p  v-if="ischeck" class="is_check"></p>
                </div>
                <p data-name="o_no_tip" class="no_more_text">不再提醒</p>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'service_charge', 'service_fee')
        }),
        saveAmountComputed () {
            return this.order.service_charge && this.order.service_charge.price
        }
    },
    data() {
        return {
            ischeck: false
        }
        
    },
    methods: {
        closeMemberTip(event) {
            if(event.target.dataset.close || (event.target.dataset.name && event.target.dataset.name !== "o_open")){
              this.$emit("closeMemberTip")
            }
        },
        toBuyMember() {
            this.$emit("toBuyMember")
        },
        noMoreMemberTip() {
            this.ischeck = true
            this.$emit("noMoreMemberTip")
        }
    }
}
</script>

<style scoped>
.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 99;
}
.content{
    position: fixed;
    width: 640rpx;
    min-height: 398rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #FCF9F0;
    box-sizing: border-box;
    padding: 80rpx 58rpx 70rpx;
    border-radius: 10rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: 500;
    color: #4C4C4C;
    line-height: 48rpx;
}
.title{
    color: #dc3538;
}
.btn_content{
    margin-top: 50rpx;
    height: 62rpx;
    display: flex;
    justify-content:center;
    align-items:center;
}
.not_buy{
    width:200rpx;
    text-align: center;
    line-height: 58rpx;
    background: #fff;
    border: 2rpx solid #D7D7D7;
    font-size: 28rpx;
    font-weight: 400;
    color: #808080;
    border-radius:30rpx;
}
.to_buy{
    margin-left: 30rpx;
    width:200rpx;
    text-align: center;
    line-height: 58rpx;
    background: linear-gradient(#FF7070, #FF5C53, #FC2434);
    border-radius:30rpx;
    box-shadow:0 10rpx 21rpx 0 rgba(198,41,46,0.22);
    font-size:30rpx;
    font-weight:500;
    color:#FFFFFF;
}
.no_more{
    display: flex;
    justify-content:center;
    align-items:center;
    margin-top: 30rpx;
    height: 24rpx;
}
.check_circle{
    width:16rpx;
    height:16rpx;
    background: #fff;
    border: 1rpx solid #D7D7D7;
    border-radius:50%;
    display: flex;
    justify-content:center;
    align-items:center;
}
.is_check{
    width:8rpx;
    height:8rpx;
    background:#dc3538;
    border-radius:50%;
}
.no_more_text{
    width:100rpx;
    line-height:24rpx;
    font-size:24rpx;
    font-weight:400;
    color:#808080;
    margin-left: 7rpx;
}

</style>