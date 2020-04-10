<template>
    <div class="remark-container">
		<div class="remark-item item-between" v-if="pageType == 1">
			<p>配送方式</p>
			<p class="font black-color">由{{mall}}发货</p>
		</div>
		<div class="remark-item" v-if="pageType == 1">
			<p>留言备注</p>
			<input class="font message-input gray-color" placeholder="选填,额外需要备注的说明" @input="changeRemarkInput" />
		</div>
        <div class="remark-rule text-center" v-if="pageType == 2 && payTime">
			<p class="special-style">付款时间</p>
			<p class="font black-color">{{payTime}}</p>
		</div>
		<div class="remark-rule" v-if="pageType == 2 && order.attachment && order.attachment.length">
			<p class="special-style">下单截图</p>
            <div class="buyer-img-box">
                <image class="buyer-img" :src="order.attachment[0]" @click="previewImage"></image>
                <p class="watch-more" @click="previewImage">点击查看更多</p>
            </div>
		</div>
        <div class="remark-rule">
			<p class="special-style">下单须知</p>
			<p v-if="order.type == 8" class="font black-color flex-fill add-margin">奖品将在支付运费后的30个工作日内陆续发出，港澳台及国外将不发货；口红、眉笔、唇釉随机送其中一款产品。</p>
			<p v-else class="font black-color flex-fill add-margin">{{order.notes}}</p>
		</div>
		<div class="remark-rule add-margin" v-if="order.buyer_remark">
			<p class="special-style">买手留言</p>
			<p class="font black-color add-margin flex-fill">{{order.buyer_remark}}</p>
		</div>
		<div class="remark-rule" @click="changeStatus" v-if="pageType == 1">
            <div class="special-style">
			    <image class="rule-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/haiTaoIconRed.png" v-if="selected"></image>
			    <image class="rule-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/haiTaoIcon.png" v-else></image>
			</div>
            <div class="font gray-color flex-fill">我知晓由于海淘及代买服务特殊性，付款后不能取消和修改订单
			    <p class="protocol font" @click.stop="jump">《一键代下单交易规则》</p>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'
import jump from '@/common/lib/jump'
import { createNamespacedHelpers, mapGetters } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            order: state => _.pick(state.order, 'buyer_remark', 'notes', 'type', 'attachment', 'pay_time'),
            mall: state => state.disclosure.mall,
            selected: state => state.agreement,
            pageType: state => state.pageType
        }),
        payTime () {
            if(!this.order.pay_time) return false
            return moment(this.order.pay_time).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    methods: {
        ...mapMutations(['setAgreement', 'setRemark']),
        changeStatus () {
            this.setAgreement(!this.selected)
        },
        changeRemarkInput (e) {
            this.setRemark(e.target.value)
        },
        jump (){
			jump.navigateTo('web_view', {
				url: '/protocol/buyer_buy',
				notShare: true,
				webPage: true
			})
        },
        previewImage () {
            wx.previewImage({
                urls: this.order.attachment
            })
        }
    }
}
</script>

<style scoped>
.remark-container {
    padding: 6.5rpx 0 8rpx 39rpx;
    background-color: #fff;
}
.remark-item {
    height: 86rpx;
    padding-right: 32rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}
.remark-item::before, .remark-rule::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1rpx;
    background-color: #F1F1F1;
}
.remark-item:first-child::before {
    height: 0;
}
.remark-rule:first-child::before {
    height: 0;
}
.special-item {
    align-items: center;
}
.item-between {
    justify-content: space-between;
}
.remark-item p:first-child {
    font-size: 28rpx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(34,34,34,1);
}
.font {font-size: 26rpx;}
.mall-origin {color: #222222}
.message-input {
    margin-left: 21rpx;
    width: 450rpx;
	height: 50rpx;
    min-height: 0; 
	border: none;
    padding-top: 1rpx;
    box-sizing: border-box;
}
.rule-icon {
    float: right;
    height: 25rpx;
    width: 25rpx;
    margin-right: 23rpx;
}
.black-color {color: #222222}
.gray-color {color: #4c4c4c}
.remark-rule {
    padding: 28rpx 32rpx 28rpx 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
}
.flex-fill {flex: 1}
.special-style {
    width: 132rpx;
    text-align: left;
    font-size: 28rpx;
    font-weight: 600;
}
.protocol {
    display: inline-block;
    margin-left: 10rpx;
    color: #dc3538;
    text-decoration: underline;
}
.buyer-img-box {position: relative;}
.buyer-img {
    display: block;
    width: 320rpx;
	height: 170rpx;
}
.watch-more {
    position: absolute;
    top: 64rpx;
    left: 77rpx;
    color:#4c4c4c;
    font-size: 26rpx;
    color: #4C4C4C;
}
.text-center {
    align-items: center;
}
.add-margin {
    margin-top: 1rpx;
}
</style>
