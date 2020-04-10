<template>
<div class="container" v-if="disclosure.rec_desc_new">
    <div class="creator-msg">
        <div class="create-img">
            <img :src="creator.avatar" class="img-icon" >
            <img class="icon-sign" src="https://img-ali.xiaohongchun.com.cn/admin/15523641858702b9dad36.png" >
        </div>
        <b>{{ creator.name }}</b>
    </div>
    <div class="content">
        <wx-parse :content="disclosure.rec_desc_new" @navigate="navigate"/>
    </div>
</div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import _ from 'underscore'
import util from "@/lib/util"
import jump from '@/common/lib/jump'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('disclosure')

export default {
    components: {
        wxParse
    },
    computed: {
        ...mapState({
            creator: state => state.creator,
            disclosure: state => _.pick(state.disclosure, 'rec_desc_new')
        }),
        // recFormat(){
        //     return this.disclosure.detail_rec ? util.beautySub(this.disclosure.detail_rec, 30) : ''
        // }
    },
    methods:{
        navigate(href, e) {
            console.log(href,e)
             jump.navigateTo('web_view', {
                url: '/mall_link?link='+ encodeURIComponent(href),
                notShare: true,
                webPage: true,
            })
        }
    }
}
</script>
<style>
.wxParse {
  width: 100%;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  color: #000;
  line-height: 1.8;
}

.wxParse view {
  word-break: hyphenate;
}

.wxParse .inline {
  display: inline;
  margin: 0;
  padding: 0;
}

.wxParse .div {
  margin: 0;
  padding: 0;
}

.wxParse .h1 {
  font-size: 28rpx;
  margin: 0;
}
.wxParse .h2 {
  font-size: 28rpx;
  margin: 0;
}
.wxParse .h3 {
  font-size: 28rpx;
  margin: 0;
}
.wxParse .h4 {
  margin: 0;
}
.wxParse .h5 {
  font-size: 28rpx;
  margin: 0;
}
.wxParse .h6 {
  font-size: 28rpx;
  margin: 0;
}

.wxParse .h1,
.wxParse .h2,
.wxParse .h3,
.wxParse .h4,
.wxParse .h5,
.wxParse .h6 {
  font-weight: normal;
}
.wxParse .b,
.wxParse .strong {
  font-weight: bolder;
}

.wxParse .p {
  margin: 0;
}

.wxParse .strong,
.wxParse .s {
  display: inline;
}

.wxParse .a {
  color:#5B92E1;
  padding-left: 20rpx;
}
.wxParse .img {
  display: inline-block;
  width: 0;
  height: 0;
  max-width: 100%;
  overflow: hidden;
}

.wxParse .ul, .wxParse .ol {
  display: block;
  margin:0;
  padding-left: 16px;
  font-size: 28rpx;
}
.wxParse .ol {
  list-style-type: disc;
}
.wxParse .ol {
  list-style-type: decimal;
}
.wxParse .li {
  display: list-item;
  align-items: baseline;
  text-align: match-parent;
}
.wxParse .ul .ul, .wxParse .ol .ul {
  list-style-type: circle;
}
.wxParse .ol .ol .ul, .wxParse .ol .ul .ul, .wxParse .ul .ol .ul, .wxParse .ul .ul .ul {
    list-style-type: square;
}

</style>
<style scoped>
/* @import url("~mpvue-wxparse/src/wxParse.css"); */
.container {
    /* position: relative; */
    border-top: 20rpx solid #f5f5f5;
    padding: 40rpx 0 0 40rpx;
    line-height: 1;
}
.creator-msg{
    position: relative;
    height: 60rpx;
    /* padding-bottom: 40rpx; */
}

.create-img {
    float: left;
    margin-right:21rpx;
    position: relative;
}
.img-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
}
.icon-sign {
    width: 24rpx;
    height: 24rpx;
    position: absolute;
    top:36rpx;
    left:48rpx;
}
.content {
    padding: 25rpx 40rpx 0 0rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    /* overflow: hidden; */
}

b {
    position: absolute;
    left: 92rpx;
    top: 5rpx;
    color: rgba(128,128,128,1);
    font-size: 26rpx;
    font-weight: 400;
    /* display:flex; */
    /* vertical-align:middle; */
    line-height:42rpx;
    background:linear-gradient(-45deg,rgba(189,146,92,1) 1.6357421875%, rgba(210,166,115,1) 18.0908203125%, rgba(240,220,175,1) 43.5546875%, rgba(246,204,168,1) 67.4072265625%, rgba(210,166,115,1) 97.5341796875%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

p {
    margin: 55rpx 40rpx 0 0;
    position: relative;
    margin-left: .5em;
    display: block;
    font-size: 28rpx;
    color: #4C4C4C;
    line-height: 42rpx;
    /* max-height: 80rpx; */
    /* overflow: hidden; */
    font-weight: bold;
}
</style>