<template>
<div>
    <!-- 商品详情 -->
    <div v-if="messageType != 3" class="news-item-container">
        <!-- 用户信息 -->
        <div @click.stop="toAllComment" data-name="to_all_comment">
            <div class="user-info">
                <img :src="icon">
                <div class="publish-info">
                    <div class="nick">{{nick}}</div>
                    <div class="publish-time">{{createTime}}</div>
                </div>
            </div>
            <p @click.stop="toAllComment" data-name="to_all_comment" v-if="messageType == 0" class="reply-remind">回复了我的评论</p>
            <p @click.stop="toAllComment" data-name="to_all_comment" v-if="messageType == 1" class="reply-remind praise">赞了我的评论</p>
        </div>
        <div v-if="messageType == 2" class="reply-remind community-specification">
            您的评论违反了<a @click.stop="toSpecification" data-name="to_community_specification">《天天跟我买社区规范》</a>，已被屏蔽。
        </div>
        <p @click.stop="toAllComment" data-name="to_all_comment" v-if="messageType == 0 && del == 0" class="reply-content">
            {{replyComments}}
        </p>
        <div @click.stop="toAllComment" data-name="to_all_comment">
            <p @click.stop="toAllComment" data-name="to_all_comment" v-if="messageType == 0 && del != 0" class="reply-content delete-comment">该评论已删除</p>
        </div>
        <!-- 商品卡片信息 -->
        <div class="goods-detail">
            <div @click.stop="toGoodsDetail" data-name="to_goods_detail">
                <img :src="imageUrl" class="goods-img">
                <div class="goods-title" style="-webkit-box-orient: vertical;">{{title}}</div>
            </div>
            <p @click.stop="toAllComment" data-name="to_all_comment" class="my-comment" style="-webkit-box-orient: vertical;">我的评论：{{myComment}}</p>
        </div>
    </div>
    <!-- 订单详情 -->
    <div v-else class="news-item-container" data-name="to_order_detail" @click="toOrderDetail">
        <!-- 用户信息 -->
        <div @click="toOrderDetail" data-name="to_order_detail">
            <div class="user-info">
                <img :src="icon">
                <div class="publish-info">
                    <div class="nick">{{nick}}</div>
                    <div class="publish-time">{{createTime}}</div>
                </div>
            </div>
        </div>
        <div data-name="to_order_detail" @click.stop="toOrderDetail" class="reply-remind community-specification">
            {{messageTitle}}
        </div>
        <div data-name="to_order_detail" @click.stop="toOrderDetail" class="goods-detail order-detail">
            <div class="order-content" data-name="to_order_detail" @click.stop="toOrderDetail">
                <div class="order-info">
                    <div class="order-status">
                        {{Ostatus}}
                    </div>
                    <div class="order-num">
                        订单号：{{Osn}}
                    </div>
                </div>
            </div>
            <div data-name="to_order_detail" @click.stop="toOrderDetail" class="goods-info">
                <img class="goods-img" :src="imageUrl">
                <div class="goods-msg">
                    <p class="order-goods-title" style="-webkit-box-orient: vertical;">{{title}}</p>
                    <div class="goods-desc" style="-webkit-box-orient: vertical;">
                        <span class="note" v-if="skuDesc">{{skuDesc}}</span>
                        <span>备注:{{remarkInfo}}</span>
                    </div>
                    <div class="price-info">
                        <div class="goods-price">¥ {{goodsPrice/100}} x{{num}}</div>
                        <div class="mall">{{mall}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import jump from '@/common/lib/jump'
export default {
    props:{
        // 头像
        icon: {
            type: String,
            default: ''
        },
        // 昵称
        nick: {
            type: String,
            default: ''
        },
        // 创建时间
        createTime: {
            type: String,
            default: ''
        },
        // 评论id
        commentId: {
            type: Number,
            default: 0
        },
        // 卡片类型 爆料/文章
        eType: {
            type: Number,
            default: 0
        },
        // 商品id
        goodsId:{
            type: Number,
            default: 0
        },
        // 我的评论
        myComment: {
            type: String,
            default: ''
        },
        // 回复的评论内容
        replyComments: {
            type: String,
            default: ''
        },
        // 订单状态的title
        messageTitle: {
            type: String,
            default: ''
        },
        // 订单状态
        Ostatus: {
            type: String,
            default: ''
        },
        // 订单号
        Osn: {
            type: String,
            default: ''
        },
        // 商城名称
        mall: {
            type: String,
            default: ''
        },
        // 商品价格
        goodsPrice: {
           type: Number,
           default: 0 
        },
        // 购买商品数量
        num: {
           type: Number,
           default: 0 
        },
        // 规格
        skuDesc: {
            type: String,
            default: ''
        },
        // 商品备注
        remark: {
            type: String,
            default: ''
        },
        // 爆料图片或文章图片
        imageUrl: {
            type: String,
            default: ''
        },
        // 商品名称
        title: {
            type: String,
            default: ''
        },
        // 消息类型 0:回复评论  1:点赞评论  2:后台删除 3:订单通知
        messageType: {
            type: Number,
            default: 0
        },
        //爆料/文章跳转地址
        urlString:{
            type: String,
            default: ''
        },
        // 是否跳转所有评论
        isAll: {
            type: Number,
            defalult: 0 // 0 否 1 是
        },
        // 定位当前评论的参数
        mainId: {
            type: Number,
            defalult: 0 
        },
        // 评论是否删除 0是没删除 1是用户删2是后端删
        del: {
            type: Number,
            defalult: 0 
        }
    },
    data () {
        return {

        }
    },
    computed:{
        remarkInfo(){
            if (!this.remark) {
                return '无'
            } else {
                return this.remark
            }
        }
    },
    methods: {
        toAllComment (e) {
            jump.navigateTo('comment_list', { id: this.goodsId, eType: this.eType ,main_id: this.mainId}, e)
        },
        toGoodsDetail (e) {
            if (this.eType == 1) {
                jump.navigateTo('disclosure', {gdid: this.goodsId}, e)
            } else {
                jump.navigateTo('web_view', {
                    url: this.urlString,
                    notShare: false,
                    webPage: true,
                }, e)
            }
        },
        toOrderDetail () {
            jump.navigateTo('order_detail', {sn: this.Osn})
        },
        toSpecification(e) {
            jump.redirectTo('web_view', {
                url: encodeURIComponent('/社区指导原则.pdf'),
                notShare: false,
                webPage: true,
            }, e)
        }
    }
}
</script>
<style scoped>
    .news-item-container {
        width: 100%;
        height: 100%;
        background-color: #fff;
        margin-top:23rpx;
        padding-bottom: 40rpx;
        padding-left: 30rpx;
        padding-right: 50rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #f5f5f5;
    }
    .user-info {
        display: flex;
    }
    .user-info img{
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
    }
    .publish-info {
        width: 89%;
        display: flex;
        justify-content: space-between;
    }
    .nick {
        font-size:28rpx;
        font-family:PingFang SC;
        font-weight:500;
        margin-left: 20rpx;
        margin-top: 3rpx;
        color:rgba(0,0,0,1);
    }
    .publish-time{
        font-size:24rpx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(128,128,128,1);
        margin-top: 8rpx;
    }
    .reply-remind {
        font-size:26rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
        margin-left: 87rpx;
    }
    .praise {
        margin-bottom: 32rpx;
    }
    .community-specification {
        font-size:26rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
        margin-bottom: 32rpx;
        line-height:40rpx;
    }
    .community-specification a{
        display: inline;
        color:#5B92E1;
        text-decoration-line: underline;
    }
    .reply-content {
        font-size:28rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
        margin-left: 87rpx;
        margin-top: 30rpx;
        margin-bottom: 22rpx;
        line-height:40rpx;
    }
    .delete-comment {
        width: 210rpx;
        height: 60rpx;
        padding:10rpx 21rpx;
        margin-top: 23rpx;
        margin-bottom: 27rpx;
        box-sizing: border-box;
        background-color: #f5f5f5;
    }
    .goods-detail {
        width: 585rpx;
        height: 216rpx;
        margin-left: 85rpx;
        padding: 23rpx 34rpx 30rpx 22rpx;
        box-sizing: border-box;
        font-size:28rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:40rpx;
        background:rgba(245,245,245,1);
    }
    .order-detail {
        width: 585rpx;
        height: 248rpx;
        margin-left: 85rpx;
        padding: 23rpx 34rpx 30rpx 22rpx;
        box-sizing: border-box;
        font-size:28rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:40rpx;
        background:rgba(245,245,245,1);
    }
    .order-content {
        width: 535rpx;
    }
    .order-info {
        display: flex;
        justify-content: space-between;
        font-size:26rpx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(0,0,0,1);
        padding-bottom: 15rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #fff;
    }
    .order-num {
        font-size:22rpx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(76,76,76,1);
    }
    .goods-info {
        margin-top: 20rpx;
    }
    .goods-msg {
        margin-left: 140rpx;
    }
    .goods-img {
        float: left;
        width: 120rpx;
        height: 120rpx;
    }
    .goods-title {
        height: 80rpx;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
        word-break: break-all;
        padding-top: 5rpx;
        margin-left: 140rpx;
    }
    .order-goods-title {
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:1;
        overflow: hidden;
        word-break: break-all;
        line-height: 40rpx;
    }
    .goods-desc {
        max-width: 388rpx;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:1;
        overflow: hidden;
        word-break: break-all;
        font-size:24rpx;
        font-family:PingFang;
        font-weight:400;
        color:rgba(76,76,76,1);
        line-height: 24rpx;
        height: 24rpx;
        margin-top: 16rpx;
    }
    .goods-desc span {
        height: 24rpx;
    }
    .note {
        margin-right:11rpx;
    }
    .price-info {
        display: flex;
        justify-content: space-between;
        font-size:26rpx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(0,0,0,1);
        line-height: 26rpx;
        margin-top:16rpx;
    }
    .mall {
        font-size:24rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(220,53,56,1);
    }
    .my-comment {
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:1;
        overflow: hidden;
        word-break: break-all;
        margin-top: 50rpx;
        color:rgba(128,128,128,1);
    }
</style>


