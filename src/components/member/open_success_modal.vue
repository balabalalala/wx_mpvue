<template>
    <div>
        <div class="member-open-mask"></div>
        <img class="bg-animation-img" src="https://img-ali.xiaohongchun.com.cn/admin/15477069325631bcd76.gif"/>
        <div class="image-container">
            <img class="bg-img" :src="img"/>
            <img @click="closeCurrentPage" class="close-img" src="https://img-ali.xiaohongchun.com.cn/admin/1535376062052a642f21.png">
            <p v-if="orderParams" @click="backOrderConfirm" class="order-buy">继续购物</p>
            <p @click="backMemberCenter" :class="orderParams ? 'rights-order' : 'rights-nomal'">{{ orderParams ? "了解更多会员权益 >" : "" }}</p>
        </div>
    </div>
</template>

<script>
    import jump from '@/common/lib/jump'

    export default {
        props: ['img', 'orderParams'],
        methods: {
            backMemberCenter() {
                this.wx.navigateBack({ delta: 1 })
            },

            backOrderConfirm() {
                jump.redirectTo('order_confirm', this.orderParams)
            },

            closeCurrentPage() {
                if (this.orderParams) {
                    this.backOrderConfirm()
                }
                else {
                    this.backMemberCenter()
                }
            }
        }
    }
</script>


<style scoped>

.member-open-mask {
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

.bg-img {
	display: block;
	width: 100%;
	height: 100%;
	margin: auto;
}

.bg-animation-img {
    position: fixed;
    top: 0;
	width: 100%;
	height: 100%;
    z-index: 12;
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

.order-buy {
    bottom: 120rpx;
    font-size: 24rpx;
}

.rights-nomal {
    bottom: 90rpx;
}

.rights-order {
    bottom: 40rpx;
    font-size: 22rpx;
}

p {
    box-sizing: border-box;
    padding-top: 25rpx; 
    position: fixed;
    left: 140rpx;
    width: 300rpx;
    height: 80rpx;
    z-index: 12;
    text-align: center;
    line-height: 1;
    color: #222;
}

</style>