<template>
<div class="container" v-if="show">
    <div class="recommend-title">
        <p>相关推荐</p>
    </div>
    <div class="content">
        <ul v-if="recommends.length">
            <li v-for="(item, index) in recommends" :key="index">
                <goods
                    :buyStatus="true"
                    :goodsType="0"
                    :title="item.title"
                    :price="item.v_detail"
                    :imageUrl="item.image_url"
                    :mall="item.mall"
                    :editorDesc="item.editor_rec_desc"
                    :publishTime="item.release_time"
                    :goodsId="item.id"
                    :icon="item.goods_icon"
                    listType="recommend"
                    :trackInfo="item.track_info"
                    :commentCount="item.comment_count"
                    :valuePercentage="item.value_percentage"
                     />
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import Goods from '@/components/index/goods'
import { createNamespacedHelpers } from 'vuex'
import jump from '@/common/lib/jump'


const {mapState} = createNamespacedHelpers('disclosure')

export default {
    computed: {
        ...mapState(['recommends']),
        show() {
            return !!(this.recommends && this.recommends.length)
        }
    },
    components: {
        Goods
    },

    methods: {
        detail(recommend, e) {
            jump.redirectTo('disclosure', {gdid: recommend.id}, e)
        }
    },
}
</script>

<style scoped>
.container {
    background-color: #f5f5f5;
    border-top: 20rpx solid #F5F5F5;
}
.recommend-title {
    background: #fff;
    position: relative;
    padding-top: 35rpx;
}
p {
    display: inline-block;
    line-height: 1rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #222;
    margin-left: 40rpx;
}
.content ul li {
    margin-bottom: 20rpx;
    
}
</style>