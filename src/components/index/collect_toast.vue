<template>
	<view class="toast-container">{{toastText}}</view>
</template>

<script>
export default {
	props: {
		toastText: {
			type: String,
			default: '收藏我，好价随时看'
		}
	},
    mounted () {
		let currentDay = new Date().getDate()
		wx.setStorage({key: 'collect_toast_cache', data: currentDay})
    }
}
</script>

<style scoped>
.toast-container{
	/* width: 224rpx; */
	padding: 0 20rpx;
	line-height: 46rpx;	
	text-align: center;
	font-size: 20rpx;
	color: #fff;
	border-radius: 20rpx;
	background: linear-gradient(#f87964, #eb5046);
	position: fixed;
	top: -46rpx;
	right: 94rpx;
	z-index: 10;
	animation: toastMove 6s linear 0s 1;
}
.toast-container::after{
	content: '';
	width: 0;
	height: 0;
	border-width: 0 14rpx 30rpx;
	border-style: solid;
	border-color: transparent transparent #f87964;
	position: absolute;
	top: -20rpx;
	right: 32rpx;
}
@keyframes toastMove{
	0%{top: -46rpx;}
	5%{top: 20rpx;}
	95%{top: 20rpx;}
	100%{top: -46rpx;}
}
</style>
