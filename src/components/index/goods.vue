<template>
    <div :class=" isGoods ? 'goods-container' : 'goods-container article-container'" :data-track_info="trackInfo"  @click="toDetail">
        <img v-if="!buyStatus" class="overtime-img" src="https://img-ali.xiaohongchun.com.cn/admin/15665431734372a4a2ef8.png"/>
        <image v-if="toTop" mode="widthFix" class="to-top-img" :src="toTopImg" />
        <image class="goods-img" :lazy-load="true" :src="imageUrl" />
        <div class="goods-detail">
            <h2 class="goods-title" style="-webkit-box-orient: vertical;">
                <image v-if="icon" :src="icon"/>
                {{title}}
            </h2>
            <p :class="isGoods ? 'goods-price':'goods-price art-price'" class="goods-price">{{price}}</p>
            <p v-if="isGoods" class="goods-desc">{{editorDesc}}</p>
            <div class='goods-mall'>
                <div :class="isGoods ? 'mall-info':'art-info'">
                    <span class="mall">{{mall}}</span>
                    <span class="time">{{publishTime}}</span>
                    <span v-if="!isGoods" class="view-detail">查看详情</span>
                </div>
                 <div v-if="isGoods" class="comment">
                    <img class="comment-img" src="https://img-ali.xiaohongchun.com.cn/admin/15646399240282f17f0a8.png">
                    <span class="comment-num">{{commentCount}}</span>
                </div>
                <div v-if="isGoods" class="value">
                    <img class="value-img" src="https://img-ali.xiaohongchun.com.cn/admin/15639606652059466134.png">
                    <span class="percentage">{{valuePercentage}}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'
export default {
    props: {
        //判断是商品还是文章用的样式
        isGoods:{
            type: Boolean,
            default: true
        },
        //文章和爆料是否过期 0过期 1没过期
        buyStatus: {
            type: Number,
            default: 0
        },
        //商品类型 0爆料 1文章
        goodsType: {
            type: Number,
            default: 0
        },
        //爆料/文章标题
        title: {
            type: String,
            default: ''
        },
        //爆料图片或文章图片
        imageUrl: {
            type: String,
            default: ''
        },
        //好价 卡片中第二行
        price: {
            type: String,
            default: ''
        },
        //编辑推荐语 卡片中第三行
        editorDesc: {
            type: String,
            default: ''
        },
        //商城
        mall: {
            type: String,
            default: ''
        },
        //发布时间
        publishTime: {
            type: String,
            default: ''
        },
        //爆料did 文章aid 建议传值写法 :goodsId="item.did || item.aid"
        goodsId: {
            type: Number,
            default: 0
        },
        //icon标识  会员专享
        icon: {
            type: String,
            default: ''
        },
        //trankinfo
        trackInfo: {
            type: String,
            default: ''
        },
        //是否置顶
        toTop: {
            type: Number,
            default: 0
        },
        //置顶图片
        toTopImg: {
            type: String,
            default: 'https://img-ali.xiaohongchun.com.cn/admin/1566543168428c6ccbf6.png'
        },
        // listType normal:普通列表，recommend:推荐列表
        listType: {
            type: String,
            default: 'normal'
        },
        // 评论
        commentCount: {
            type: Number,
            default: 0
        },
        // 值
        valuePercentage:{
            type: Number,
            default: 0
        }
    },
    methods: {
        toDetail (e) {
            if(!this.goodsType){
                if(this.listType === 'normal') {
                    jump.navigateTo('disclosure', {gdid: this.goodsId}, e)
                } else {
                    jump.redirectTo('disclosure', {gdid: this.goodsId}, e)
                }
            } else {
                let token = wx.getStorageSync('lsj_userToken');
                jump.navigateTo('web_view', {
				    url: token ? '/article/'+ this.goodsId +'?token=' + token.token : '/article/'+ this.goodsId,
				    notShare: false,
                    webPage: true,
                    shareTitle: `${this.price} ${this.title}`
                }, e)
            }
        },
    }
}
</script>

<style scoped>
.goods-container {
    box-sizing: border-box;
    width: 100%;
    padding: 0rpx 30rpx 0rpx;
    overflow: hidden;
    position: relative;
    background-color: #fff;
    display: flex;
    align-items: center;
}
.goods-detail {
    overflow: hidden;
    background-color: #fff;
    padding: 23rpx 0 0 20rpx;
    height: 232rpx;
    flex: 1;
}
.goods-img {
    float: left;
    width: 202rpx;
    height: 202rpx;
}
.goods-title {
    height: 80rpx;
    max-width: 442rpx;
    /* margin-top: -4rpx; */
    font-size: 30rpx;
    color: rgba(34,34,34,1);
    line-height: 40rpx;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    overflow: hidden;
    word-break: break-all;
}
.article-title {
    margin-top: 30rpx;
    max-width: 384rpx;
    margin-left: 20rpx;
}

.goods-price {
    max-width: 442rpx;
    margin-top: 11rpx;
    font-size: 28rpx;
    font-weight: 600;
    color:#dc3538;
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.art-price{
    margin-top: 19rpx;
}
.article-price{
    margin-top: 19rpx;
    max-width: 384rpx;
    margin-left: 20rpx;

}
.goods-desc {
    margin-top: 16rpx;
    font-size: 28rpx;
    color:rgba(80,80,80,1);
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.goods-mall {
    /* max-width: 440rpx; */
    margin-top: 25rpx;
    font-size: 24rpx;
    color: rgba(80,80,80,1);
    line-height: 1;
    display: flex;
    align-content: center;
    justify-content: space-between;
}
.mall-info {
    max-width: 222rpx;
    width: 222rpx;
    display: flex;
    line-height: 32rpx;
}
.art-info {
    display: flex;
    margin-top: 24rpx;
    width: 460rpx;
    line-height: 44rpx;
    justify-content: space-between;
}
.comment{
    display: flex;
    justify-content: flex-end;
    width: 110rpx;
    align-items: center;
    line-height: 32rpx;
    margin-right: 10rpx;
}
.comment-img {
    width: 28rpx;
    height: 28rpx;
}
.comment-num {
    margin-left: 12rpx;
}
.value {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10rpx;
    width: 105rpx;
    line-height: 32rpx;
}
.value-img {
    width: 32rpx;
    height: 32rpx;
}
.percentage{
    margin-left: 10rpx;
}
.article-mall{
     margin-top: 25rpx;
    font-size: 24rpx;
    color: rgba(80,80,80,1);
    line-height: 1;
    display: flex;
    align-content: center;
    justify-content: space-between;
}
.article-mall .mall{
    width: 180rpx;
    max-width: 180rpx;
    font-size:24rpx;
    font-weight:400;
    color:rgba(80,80,80,1);
    line-height:44rpx;
    text-align: left;
    margin-right: 45rpx;

}
.goods-mall span {
    display: inline-block;
}
.article-mall span {
    display: inline-block;
}
.mall {
    display: inline-block;
    max-width: 130rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  
}
.time {
    margin-left: 6rpx;
    white-space: nowrap;
}
.view-detail{
    display: inline-block;
    width:156rpx;
    height:44rpx;
    font-size:24rpx;
    font-weight:400;
    color:rgba(220,53,56,1);
    border:3rpx solid rgba(220, 53, 56, 1);
    text-align: center;
    line-height:44rpx;
    margin-top: -5rpx;
}
.overtime-img{
    position: absolute;
    top: 28rpx;
    left: 30rpx;
    height:34rpx;
    width:84rpx;
}
.goods-title image {
    width: 86rpx;
    height: 28rpx;
    display: inline-block;
    margin: 0 2rpx -4rpx 0;
}
.to-top-img {
    position: absolute;
    top: 0rpx;
    left: 30rpx;
    width: 49rpx;
}
</style>


