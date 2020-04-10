<template>
    <div class="ranking-container">
        <h2>
            <span class="first-title">{{rankTitle.title}}</span>
            <span class="second-title">{{rankTitle.tips}}</span>
        </h2>
        
        <scroll-view  scroll-x="true" style="width: 100%" class="goods-container">
            <div 
                v-for="(item, index) in goodsList"
                :key="index" 
                class="ranking-goods" 
                :data-name="'rank_list_'+item.eid+'_'+index"
                :data-track_info="item.track_info"
                @click="toDetail(item, $event)">
                <span :data-name="'rank_list_'+item.eid+'_'+index" v-if="index <= 2" class="label">NO.{{index + 1}}</span>
                <image :data-name="'rank_list_'+item.eid+'_'+index" :lazy-load="true" :src="item.image" />
                <p :data-name="'rank_list_'+item.eid+'_'+index">{{item.single_price}}</p>
            </div>
        </scroll-view>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'
export default {
    props: {
        goodsList: {
            type: Array,
            default: []
        },
        rankTitle: {
            type: Object,
            default: {}
        }
    },
    methods: {
        toDetail (item, e) {
            if(!item.type) {
                jump.navigateTo('disclosure', {gdid: item.eid}, e)
            } else {
                let token = wx.getStorageSync('lsj_userToken');
                jump.navigateTo('web_view', {
				    url: token ? '/article/'+ item.eid +'?token=' + token.token : '/article/'+ item.eid,
				    notShare: false,
                    webPage: true,
                    shareTitle: `${item.single_price} ${item.title}`
                }, e)
            }
            
        }
    }
}
</script>

<style scoped>
.ranking-container {
    width: 100%;
    margin: 30rpx 0 0 30rpx;
} 
h2 {
    line-height: 1;
}
.first-title {
    display: inline-block;
    font-size: 34rpx;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height: 1;
}
.second-title {
    display: inline-block;
    margin-left: 18rpx;
    font-size: 26rpx;
    color: rgba(76,76,76,1);
    line-height: 1;
}

.goods-container {
    margin-top: 27rpx;
    padding-bottom: 16rpx;
    white-space: nowrap;
}
.ranking-goods {
    display: inline-block;
    width: 200rpx;
    margin-right: 12rpx;
    overflow: hidden;
    position: relative;
}
.ranking-goods image {
    float: left;
    display: inline-block;
    width: 200rpx;
    height: 200rpx;
}
.ranking-goods p {
    width: 100%;
    float: left;
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #000;
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.label {
    position: absolute;
    top: 0;
    left: 0;
    width: 56rpx;
    height: 37rpx;
    line-height: 37rpx;
    border-radius: 0 0 10rpx 0;
    background-color: #D03436;
    color: #fff;
    font-size: 18rpx;
    text-align: center;
}
</style>
