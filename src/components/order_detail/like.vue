<template>
  <div class="container" v-if="recommend.length">
    <p class="like">猜你喜欢</p>
    <div  class="likecon">
      <div class="detail" v-for="(item, index) in recommend" :key="index" @click="toHandleDetail(item)" >
        <image class="images" :src="item.image_url" mode="aspectFit"></image>
        <p class="title" style="-webkit-box-orient: vertical;">{{item.title}}</p>
        <p class="price">￥{{item.price / 100}}</p>
        <p class="bottomline"></p>
      </div>
    </div>
  </div>
</template>

<script>
import jump from '../../common/lib/jump'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
      ...mapState({
        recommend: state => state.orderDetailRecommend,
      })
    },
  	methods: {
		// 推荐跳转详情
    	toHandleDetail(item) {
      		jump.redirectTo('disclosure', {gdid: item.id})
    	}
	}
}
</script>

<style scoped>
  .container{
    width: 750rpx;
    text-align: center;
    font-size: 30rpx;
    color:#4c4c4c;
	  background-color: #fff;
  }
  .likecon {
	  padding:0 25rpx; 
	  overflow: hidden;
	  position: relative;
  }
  .like{
    padding-top: 50rpx;
    padding-bottom: 30rpx;
  }
  .detail{
    float: left;
    width: 50%;
    padding-right: 25rpx; 
    height: 520rpx;
    position: relative;
    background: #fff;
	  box-sizing: border-box;
  }
  .detail:nth-of-type(2n) {
	  padding-right: 0;
  }
  .bottomline{
	  position: absolute;
    bottom: 15rpx;
    left: 0;
    display:inline-block;
    height: 1px;
    width: 325rpx;
    background: #efefef;
  }
  .images{
    height: 325rpx;
    width: 325rpx;
  }

  .title{
    margin-top: 20rpx;
    width: 325rpx;
    font-size:30rpx;
    color:#1a1a1a; 
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align:left;
  }

  .price{
	  text-align: initial;
    margin-top: 10rpx;
    color:#dc3538;
    font-size: 28rpx;
	  white-space: nowrap;
  }
</style>
