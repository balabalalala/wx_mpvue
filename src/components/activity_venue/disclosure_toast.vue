<template>
    <div class="opcity-tip">
        <div v-if="threeTip">
			<p class="opcity-tip-title">订阅成功！</p>
            <p class="opcity-tip-subtitle">将在活动开始前3分钟提醒您，您也可以关注“天天跟我买”公众号，获取更多好价信息。</p>
        </div>
        <div v-else>
            <p class="opcity-tip-title">订阅成功！</p>
        	<p class="opcity-tip-subtitle">活动马上开始哟，准备好姿势开抢吧！</p>
        </div>
    </div>
</template>

<script>
export default{
    props: ['threeTip']
}
</script>
<style scoped>
.opcity-tip{
	width: 480rpx;
	height: 130rpx;
	padding: 60rpx 66rpx 58rpx;
	background:rgba(34,34,34,1);
	opacity: 0.7;
	border-radius: 20rpx;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	z-index: 30;
}
.opcity-tip-title{
	line-height: 34rpx;
	font-size: 36rpx;
	color:rgba(255,255,255,1);
	text-align: center;
}
.opcity-tip-subtitle{
	font-size: 30rpx;
	color:rgba(255,255,255,1);
	line-height: 48rpx;
	text-align: center;
}
</style>
