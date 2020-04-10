<template>
	<div v-if="alertData.index_img">
		<div class="mask" data-name="index-window"></div>
		<div class="img-container" data-name="index-window">
			<image class="img-good" :src="alertData.index_img" data-name="index-window" :data-track_info="alertData.track_info" @click="toDetail" />
			<image class="close-btn" data-name="index-window-close" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/closeIconNew.png"  @click="modalClose" />
		</div>
	</div>
</template>
<script>
import moment from 'moment'
import jump from '@/lib/jump'

export default {

	props: {
		alertData: {
            type: Object,
            default: {}
        }
	},
	
	methods: {
		async toDetail(e) {
			this.$emit("modalShowHandle", false)
			let url = this.alertData.url
			jump.navigateTo(url, {}, e)
		},
		modalClose() {
			this.$emit("modalShowHandle", false)
		}
	}
	
}
</script>

<style scoped>
.mask{
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	background-color:rgba(0, 0, 0, 0.6);
}
.img-container{
	display: block;
	width: 580rpx;
	height: 730rpx;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	-webkit-transform: translate(-50%,-50%);
	margin: auto;
	z-index: 12;
}
.img-good{
	display: block;
	width: 100%;
	height: 100%;
	margin: auto;
}
.close-btn{
	width: 70rpx;
	height: 70rpx;
	position: fixed;
	left: 0;
	right: 0;
	margin: auto;
	bottom: -120rpx;
	z-index: 100;
	text-align: center;
}
.tips{
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 180rpx;
	font-size:22rpx;
	font-weight:400;
	color:rgba(20,20,20,1);
}
</style>