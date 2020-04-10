<template>

<li
    :class="overtime ? 'overtime' : ''"
    class="li"
    @click="todetail"
>
    <div class="imgwrapper">
        <img class="img" :src="item.images">
    </div>
    <div class="content">
        <h3 class="title" :class="{bold: !overtime}">{{item.title}}</h3>
        <template v-if="item.d_type !== 2">
            <span class="price">{{item.d_type === 1 ? '今日最低价' : ''}} {{item.v_detail}}</span>
            <div class="info-box">
                <div class="info">{{ info }}</div> 
                <!-- 评论 -->
                <div class="comment">
                    <img class="comment-img" src="https://img-ali.xiaohongchun.com.cn/admin/15646399240282f17f0a8.png">
                    <span class="comment-num">{{item.comment_count}}</span>
                </div>
                <!-- 值 -->
                <div class="value">
                    <img class="value-img" src="https://img-ali.xiaohongchun.com.cn/admin/15639606652059466134.png">
                    <span class="percentage">{{item.value_percentage}}%</span>
                </div>
            </div>
        </template>
        <template v-else>
            <em class="hot-tag">{{ item.h_tags }}</em>
            <p class="spec">{{ item.show_spec }}</p>
            <div class="price-box">
                <em>{{ fixedPrice }}</em>
                <span>价格指数</span>
                <i v-for="n of item.good_price_index" :key="n" class="star"></i>
            </div>
        </template>
    </div>

    <img @click.stop="del" class="delete-icon" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/delIcon.png">

    <!-- <span @click.stop="same" class="same">找相似</span> -->
</li>

</template>
<script type="text/javascript">
import qs from 'qs'
import jump from '@/common/lib/jump'
import http from "@/lib/http"

export default {

    props: ['item'],

    computed: {
        info() {
            if(this.item.d_type === 1) {
                return this.item.mall_num + '个平台在售'
            }

            return this.item.mall + ' 发货'
        },

        overtime() { 
            return (this.item.status === -1  || this.item.mall_num == 0) && this.item.d_type != 2
        },

        fixedPrice() {
            return (this.item.price / 100).toFixed(2)
        }
    },

    methods: {
        todetail() {
            if(this.item.d_type === 1) {
                return jump.navigateTo('goodsDetail', {
                    id: this.item.goods_store_id,
                    sid: this.item.store_id,
                    spec_id: this.item.spec_id
                })
            }
            jump.navigateTo('disclosure', {gdid: this.item.did})
        },

        // same() {
        //     jump.navigateTo('similar_goods', {
        //         id: (this.item.d_type === 0 || this.item.d_type === 2) ? this.item.did : this.item.goods_store_id,
        //     })
        // },

        async del() {
              const resp = await this.wx.showModal({
                title: '天天跟我买',
                content: '是否删除这条记录',
                showCancel: true,
                confirmText: '确定',
            })

            if(!resp.confirm) return

            const params = {
                dids: this.item.d_type !== 1 ? this.item.did : this.item.spec_id,
                d_type: this.item.d_type
            }
            await http.delete('/lsj/v3/collection?' + qs.stringify(params)).catch(e => console.error(e))

            this.$parent.items.splice(
                this.$parent.items.indexOf(this.item),
                1
            )
        }
    }

};

</script>
<style src="@/style/common.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>

<style type="text/css" scoped>
.li {
    position: relative;
    display: block;
    overflow: hidden;
    padding-right: 20rpx;
    border-top: 20rpx solid #f5f5f5;
    background-color: white;
    z-index: 1;
}

.imgwrapper {
    float: left;
    margin: 30rpx 20rpx 20rpx 30rpx;
}

.img {
    width: 210rpx;
    height: 210rpx;
}

.delete-icon {
    position: absolute;
    width: 35rpx;
    height: 35rpx;
    top: 10rpx;
    right: 0;
    padding: 20rpx;
    z-index: 3;
}

/* .same {
    position: absolute;
    z-index: 3;
    width: 125rpx;
    line-height: 40rpx;
    border: 1px solid #d1d1d1;
    text-align: center;
    font-size: 24rpx;
    color: #808080;
    right: 20rpx;
    bottom: 45rpx;
} */

.overtime {
    position: relative;
}

/* .overtime::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .5);
    z-index: 1;
} */

.overtime .imgwrapper {
    position: relative;
}

.overtime .imgwrapper::before {
    content: '';
    position: absolute;
    height:34rpx;
    width:84rpx;
    left: 0;
    top: 0;
    background-size: contain;
    background-image: url(https://img-ali.xiaohongchun.com.cn/admin/15665431734372a4a2ef8.png);
    z-index: 2;
}

.content {
    font-size: 28rpx;
    overflow: hidden;
}

.info {
    width: 222rpx;
    color: #808080;
    font-size: 24rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.title {
    font-size: 30rpx;
    font-weight: 500;
    color: #000000;
    height: 88rpx;
    line-height: 44rpx;
    overflow: hidden;
    margin: 25rpx 40rpx 35rpx 0;
}

.price {
    color: #dc3538;
    font-weight: bold;
}

.hot-tag {
    margin-bottom: 10rpx;
    display: inline-block;
    line-height: 30rpx;
    padding: 0 15rpx;
    background:linear-gradient(-13deg,rgba(224,48,61,1),rgba(243,68,71,1),rgba(255,125,86,1));
    border-radius:18rpx;
    box-shadow:0rpx 2rpx 6rpx 0rpx rgba(243,68,71,0.33);
    font-size: 18rpx;
    color: white;
}

.price-box {
    margin-top: 10rpx;
}

.price-box em {
    font-size: 36rpx;
    color:#dc3538;
    display: inline;
}

.price-box em::before {
    content: '￥';
}

.price-box span {
    margin: 0 10rpx 0 20rpx;
    font-size: 22rpx;
    color: #222;
    display: inline;
}

.spec {
    max-width: 300rpx;
    font-size:18rpx;
    color: rgb(128, 128, 128);
}

.star {
    display: inline-block;
    width: 19rpx;
    height: 19rpx;
    background: url(https://img-ali.xiaohongchun.com.cn/admin/1536552555719159f3cdb.png) 0 0 no-repeat;
    background-size: contain;
}
.info-box {
    width: 435rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 27rpx;
}
.comment{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 110rpx;
    line-height: 32rpx;
    margin-right: 10rpx;
}
.comment-img {
    width: 28rpx;
    height: 28rpx;
}
.comment-num {
    margin-left: 12rpx;
    font-size:24rpx;
    color:rgba(128,128,128,1);
}
.value {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 105rpx;
    margin-left: 10rpx;
    line-height: 32rpx;
}
.value-img {
    width: 32rpx;
    height: 32rpx;
}
.percentage{
    font-size:24rpx;
    color:rgba(128,128,128,1);
    margin-left: 10rpx;
}
</style>
