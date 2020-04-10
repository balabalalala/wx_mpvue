<template>
    <div>
        <div class="red-envelope-mask"></div>
        <div class="image-container">
            <img @click="goHomeIndex" class="hit-word-img" :src="img"/>
            <img @click="closeImage" class="close-img" src="https://img-ali.xiaohongchun.com.cn/admin/1535376062052a642f21.png">
        </div>
    </div>
</template>


<script>
    import jump from '@/common/lib/jump'

    export default {
        props: ['img'],
        methods: {
            goHomeIndex() {
                this.closeImage()
                this.wx.navigateBack({delta: 1})
            },

            closeImage () {
                this.$emit("closeHandle")
            }
        }
    }
</script>


<style scoped>

.red-envelope-mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 12;
	background-color:rgba(0, 0, 0, 0.6);
}

.image-container {
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

.hit-word-img {
	display: block;
	width: 100%;
	height: 100%;
	margin: auto;
}

.close-img {
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

</style>