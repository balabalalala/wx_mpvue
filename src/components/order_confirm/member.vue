<template>
    <div class="member-container">
        <div data-name="order-member" class="member-box" @click="toMemberPage" :data-track_info="trackInfoComputed" >
            <image class="member-icon" src="https://img-ali.xiaohongchun.com.cn/admin/154406355192536e0dbea.png" />
            <p data-name="order-member" class="member-word" v-if="memberStatus == 1">您的会员已到期，续费会员享受代买服务费全免</p>
            <p data-name="order-member" class="member-word" v-if="!memberStatus"><span>开通会员 本单可省代买费</span><span style="color:#dc3538">{{saveAmountComputed / 100}}</span>元 点我立即省钱</p>          
            <image class="member-arrow" src="https://img-ali.xiaohongchun.com.cn/admin/154338964231936ec9d89.png" />
        </div>
    </div> 
</template>

<script>
import jump from '../../common/lib/jump'
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters } = createNamespacedHelpers('orderConfirm')
export default {
    props: ['asn'],
    //0: 从未开通过会员  1:会员过期  2:会员未过期
    computed: {
        ...mapState({
             trackInfo: state => state.order.track_info,
             saveAmount: state => state.order.service_charge,
             sn: state => state.order.sn,
             addressId: state => state.address.id
        }),
        ...mapGetters(['memberStatus']),
        trackInfoComputed () {
            return this.trackInfo && this.trackInfo.track_info
        },
        saveAmountComputed () {
            return this.saveAmount && this.saveAmount.price
        }
    },
    methods: {
        toMemberPage (e) {
            //asn 活动页 sn 订单号 
            let params = {
                sn: this.sn,
                asn: this.asn,
                address_id: this.addressId
            }
            jump.redirectTo('member_no_tab', params)
        }
    }
}
</script>

<style scoped>
.member-container {
    box-sizing: border-box;
    width: 100%;
    height: 124rpx;
    /* margin: 20rpx 0; */
    background:rgba(255,255,255,1);
    display: flex;
    justify-content: center;
    align-items: center;
}
.member-box {
    min-width: 690rpx;
    height: 82rpx;
    line-height: 82rpx;
    padding: 0 0 0 14rpx;
    background:rgba(249,249,249,1);
    border: 1rpx solid rgba(241, 241, 241, 1);
    border-radius: 8rpx;
}
.member-icon {
    width: 113rpx;
    height: 43rpx;
    margin-right: 4px;
    vertical-align: middle;
    margin-top: 12rpx;
}
.member-word {
    display: inline-block;
    font-size: 26rpx;
    color: #222;
    font-weight: bold;
}
.member-arrow {
    width: 16rpx;
    height: 16rpx;
    margin-left: 6rpx;
    vertical-align: middle;
}
</style>
