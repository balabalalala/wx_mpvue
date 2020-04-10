<template>
    <div class="today-cabbage">
        <div class="today-top">
            <span class="title">今日白菜</span><span class="update">{{todayData.copywriting}}</span><span data-name="to-cabbage-label" @click="toCabbageLabel" class="more">查看更多 ></span>
        </div>
        <div data-name="to-today-cabbage-detail" class="today-content" @click="toTodayCabbageDetail">
            <image data-name="to-today-cabbage-detail" :src="todayData.image" mode="aspectFill" :lazy-load="true" />
            <div data-name="to-today-cabbage-detail" class="today-info">
                <p class="content-title" style="-webkit-box-orient: vertical;">{{todayData.title}}</p>
                <p class="content-info"><span>{{todayData.editor_rec}}</span><span>{{todayData.time_string}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
import jump from '@/common/lib/jump'
export default {
    props: ['todayData'],
    methods: {
        toCabbageLabel (e) {
            jump.navigateTo('cabbage_subscribe')
        },
        toTodayCabbageDetail (e) {
             jump.navigateTo('web_view', {
                url: this.todayData.url_string,
                notShare: false,
                webPage: true,
                shareTitle: `${this.todayData.v_detail} ${this.todayData.title}`
            }, e)
        }   
    }
}
</script>

<style scoped>
.today-cabbage {
    margin-top: 60rpx;
}

.today-top {
    overflow: hidden;
    position: relative;
    padding: 0 30rpx;
}
/* .today-top::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    z-index: 1;
    transform: translateY(-60%);
    width: 6rpx;
    height: 28rpx;
    background:#dc3538;
} */
.today-top span {display: inline-block;}
.today-top .title {
    font-size: 32rpx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(26,26,26,1);
}
.today-top .update {
    margin-left: 18rpx;
    font-size: 26rpx;
    font-family: PingFang-SC-Regular;
    color: rgba(128,128,128,1);
}
.today-top .more {
    float: right;
    font-size: 24rpx;
    font-family: PingFang-SC-Regular;
    color:rgba(128,128,128,1);
    line-height: 58rpx;
}
.today-content {
    margin-top: 20rpx;
    padding: 0 30rpx;
}
.today-content image {
    display: block;
    width: 100%;
    height: 269rpx;
} 
.today-info {
    box-sizing: border-box;
    padding: 35rpx 33rpx 40rpx 29rpx;
    box-shadow: 0 5rpx 16rpx 0 rgba(40,40,39,0.14);
}
.content-title {
    font-size: 30rpx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(26,26,26,1);
    line-height: 46rpx;
    text-overflow: ellipsis;
    display: -webkit-box;
    /*! autoprefixer: off */ 
    -webkit-box-orient: vertical; 
    /*! autoprefixer: on */
    -webkit-line-clamp:2;
    overflow: hidden;
}
.content-info {
    display: flex;
    justify-content: space-between;
    margin-top: 26rpx;
    font-size: 28rpx;
    font-family: PingFang-SC-Regular;
    color:rgba(128,128,128,1);
    line-height: 1;
}
.content-info span {display: inline-block;}
.content-info span:first-of-type {
    flex: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.content-info span:last-of-type {
    flex: 1;
    text-align: right;
}
</style>
