<template>
    <div class="container">
        <scroll-view scroll-y class="search-suggester">
            <li v-for="(item, index) in tipList" :key="index" @click="searchTipClick(item, $event)" :data-track_info="item.track_info" :data-name="item.type == 0 ?'search_wait_word_item_click' : 'search_wait_word_goods_item_click'" :data-search_word="searchWord" :data-click_word="item.word">
                <span :data-name="item.type == 0 ?'search_wait_word_item_click' : 'search_wait_word_goods_item_click'" :data-track_info="item.track_info" :data-search_word="searchWord" :data-click_word="item.word">{{item.word}}</span><image v-if="item.type==1" src="https://img-ali.xiaohongchun.com.cn/admin/155477772911318290c2a.png"></image>
            </li>
            <li  @click="searchTipClick(word, $event)" :data-search_word="searchWord" class="see-all" data-name="search_wait_word_see_result_click">查看结果</li>
        </scroll-view>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import fly from "@/lib/http"
import jump from '@/common/lib/jump'

export default {
    props: {
        tipList: {
            type: Array,
            default: []
        },
        word: {
            type: String,
            default: ''
        }
    },
     computed: {
        ...mapState(['searchWord'])
    },
    methods: {
        searchTipClick(item, e) {
            if(typeof item == 'object' && item.type == 0) {
                this.$emit('search', item.word)
            }else if (typeof item == 'object' && item.type == 1) {
                jump.navigateTo('disclosure', {gdid: item.did}, e)
            }else if (typeof item == 'string') {
                this.$emit('search', item)
            }

        }
    },
}
</script>

<style scoped>

.container {
    background: #fff;  
}
.search-suggester {
    background-color: #fff;
    margin-top: 10rpx;
}
.search-suggester li{
    width: 711rpx;
    display: inline-block;
    border-bottom: 1rpx solid #F1F1F1;
    color: #1A1A1A;
    font-size: 30rpx;
    line-height: 90rpx;
    margin-left:40rpx;
    float: left;
}
.search-suggester li image {
    float:right;
    color:#CCC;
    font-size:24rpx;
    margin: 40rpx 40rpx 0 0;
    width: 16rpx;
    height: 16rpx;
}
.search-suggester li span {
    width: 85%;
    float: left;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.see-all {
    text-align: center;
}
</style>
