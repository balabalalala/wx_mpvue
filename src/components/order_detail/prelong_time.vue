<template>
    <div class="bgmask">
        <div class="prelong-container">
            <p class="prelong-title">确认延长收货时间？</p>
            <div class="prelong-content">
                <p>每笔订单收货时间只能延长一次，请选择您延长收货的原因：</p>
                <ul class="radio-group">
                    <li v-for="(item, index) in items" class="radio-item"  :key="index">
                        <div class="select-btn" @click="radioChange(index)">
                            <div class='btn-red' v-if="currentReason === index"></div>
                        </div>
                        <div style="max-width:351rpx" :class="currentReason === index ? 'isSelected' : ''" @click="radioChange(index)">{{item}}</div>
                    </li>
                </ul>
            </div>
            <div class="prelong-bottom">
                <p class="cancel-btn" @tap="hideModal">取消</p>
                <p class="confirm-btn"  @tap="confirmPrelongTime">确定</p>
            </div>
       </div>
   </div>
   
</template>

<script>
import fly from '../../lib/http'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    data() {
        return {
            items: [
                '商品还未发货',
                '商品在配送中',
                '商品有瑕疵／错漏，需要进一步处理',
                '其他原因'
            ],
            currentReason:0,
            isSelectedStyle: false,
        }
    },
    computed: {
        ...mapState({
            id: state => state.order.id
        })
    },
    methods: {
        radioChange (index) {
            this.currentReason = index
        },
        hideModal () {
            this.$emit('hidePrelongModal')
        },
        async confirmPrelongTime () {
            let reason = this.items.filter((item, index) => {
                if(this.currentReason === index){
                    return item
                }
            })
            let resp = await fly.post(`/lsj/v3/order/delay_receive`, {
                oid: this.id,
                reason: reason[0]
            })
            if(resp.data == "OK"){
                this.$emit('hidePrelongModal', 'ok')
            }
        }
    }
}
</script>

<style scoped>
.bgmask{
    position: fixed;
    z-index: 30;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    display: -webkit-flex;
    -webkit-align-items: center;
    -webkit-justify-content: center;
    background: rgba(0, 0, 0, 0.5);
}
.prelong-container {
    width:530rpx;
    height: 622rpx;
    padding: 69rpx 0 0 0;
    background:rgba(255,255,255,1);
    border-radius:20rpx;
    box-sizing: border-box;
    text-align: center;
    position: relative;
}
.prelong-title {
    font-size: 30rpx;
    color: #222222;
    text-align: center;
    margin-bottom: 25rpx;
}
.prelong-content {
    font-size: 28rpx;
    color: #4C4C4C;
    text-align: left;
    width: 403rpx;
    margin: 0 auto;
}
.prelong-content .radio-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5rpx;
}
.radio-group:first-child {
    margin-top: 7rpx;
}
.radio-group .radio-item {
    display:flex;
    line-height:40rpx;
    margin-top:16rpx;
}
.prelong-content .select-btn {
    width: 26rpx;
    height: 26rpx;
    line-height: 40rpx;
    background-color: #F5F5F5;
    border-radius: 13rpx;
    margin-top: 6rpx;
    margin-right: 12rpx;
    position:relative;
}
.prelong-content .btn-red {
    position: absolute;
    left: 8rpx;
    top: 8rpx;
    width: 12rpx;
    height: 12rpx;
    background-color: #dc3538;
    border-radius: 6rpx;
}
.prelong-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 101rpx;
    line-height: 101rpx;
    border-top: 1rpx solid #B0B0B0;
}
.prelong-bottom .cancel-btn, .prelong-bottom .confirm-btn{
    float: left;
    width: 50%;
    font-size: 28rpx;
    font-family: PingFang-SC-Regular;
}
.prelong-bottom :last-child{
    color: #dc3538;
}
.prelong-bottom::after{
    height: 102rpx;
    width: 2rpx;
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    background-color: #B0B0B0;
}
.isSelected{
    color: #dc3538
}

</style>