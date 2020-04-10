<template>
<div>
    <div class="article-container" v-if="activityArticle.length">
        <div class="article-title">
            <p>该商品参加此活动</p>
        </div>
        <div class="content">
            <ul>
                <li v-for="(item, index) in activityArticle" :key="index">
                    <goods
                        :isGoods="isGoods"
                        :goodsType="1"
                        :buyStatus="1"
                        :title="item.title"
                        :price="item.v_detail"
                        :imageUrl="item.image_url"
                        :mall="item.mall"
                        :publishTime="item.time_string"
                        :goodsId="item.did || item.aid"
                        :trackInfo="item.track_info || pageTrackInfo"
                     />
                </li>
            </ul>
        </div>
    </div>
    <div class="article-container" v-if="topicArticle.length">
        <div class="article-title">
            <p>该商品在此专题中有推荐</p>
        </div>
        <div class="content">
            <ul>
                <li v-for="(item, index) in topicArticle" :key="index">
                    <goods
                        :isGoods="isGoods"
                        :goodsType="1"
                        :buyStatus="1"
                        :title="item.title"
                        :price="item.v_detail"
                        :imageUrl="item.image_url"
                        :mall="item.mall"
                        :publishTime="item.time_string"
                        :goodsId="item.did || item.aid"
                        :trackInfo="item.track_info || pageTrackInfo"
                         />
                </li>
            </ul>
        </div>
    </div>
</div>

</template>

<script>
import Goods from '@/components/index/goods'
import { createNamespacedHelpers } from 'vuex'
import jump from '@/common/lib/jump'


const {mapState} = createNamespacedHelpers('disclosure')

export default {
    props: ['pageTrackInfo'],
    data(){
        return{
            isGoods:false
        }
    },
    computed: {
        ...mapState({
            activityArticle: state => state.disclosure.activity_article == null?[]:state.disclosure.activity_article,
            topicArticle:state => state.disclosure.topic_article == null?[]:state.disclosure.topic_article
        }),
    },
    components: {
        Goods
    },

    methods: {
    },
}
</script>

<style scoped>
.article-container {
    background: #fff;
    margin-bottom: 40rpx;
    border-bottom:20rpx solid #f5f5f5;
}
.article-title {
    position: relative;
    padding-top: 30rpx;
    margin-bottom: 20rpx;
}
p {
    display: inline-block;
    line-height: 44rpx;
    font-size: 34rpx;
    font-weight: 500;
    color: #222;
    margin-left: 40rpx;
}
li {
    box-shadow:0rpx 4rpx 18rpx 0rpx rgba(128, 128, 128, 0.35);
    margin-bottom: 40rpx;
}
</style>