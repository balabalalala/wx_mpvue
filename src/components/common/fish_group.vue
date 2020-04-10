<template>
	<button data-name="o_float_inner_group" @click="showFishAlert">
		<image data-name="o_float_inner_group" src="https://img-ali.xiaohongchun.com.cn/admin/1544683564497299554eb.png"/>
	</button>
</template>
<script>
export default {
	props: {
		service: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		showFishAlert() {
			this.$emit("showFishAlert", true)
		}
	}
}
</script>
<style scoped>
button{
	padding: 0;
	width: 152rpx;
	height: 144rpx;
	background: none;
	position: fixed;
	top: 50%;
	right: 40rpx;
	z-index: 10;
}
button::after{
	border: none;
}
image{
	width: 100%;
	height: 100%;
}
</style>
