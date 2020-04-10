<template>
<div>
    <section class="container">
        <h2>如何购买</h2>
        <div class="purchase-way">
            <wx-parse :content="disclosure.purchase_way_new" @navigate="navigate"/>
        </div>
        <div v-if="areas" class="exclude-area">
            <strong>以下地区暂时无法购买：</strong> {{ areas }}
        </div>
    </section>
</div>
</template>

<script>
import _ from 'underscore'
import wxParse from 'mpvue-wxparse'
import { createNamespacedHelpers } from 'vuex'
import jump from '@/common/lib/jump'
const { mapState } = createNamespacedHelpers('disclosure')

export default {
    components: {
        wxParse
    },
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'editor_rec_descs', 'rec_desc', 'purchase_way_new', 'exclude_area')
        }),

        areas() {
            return (this.disclosure.exclude_area || []).join('、');
        }
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
  padding-left: 40rpx;
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
.container {
    padding: 40rpx;
    line-height: 1;
    border-bottom: 1rpx solid #f1f1f1;
    font-size: 28rpx;
}

.container:last-child {
    border-bottom: none;
}

h2 {
    padding-bottom: 30rpx;
    font-size: 34rpx;
    font-weight: 500;
    color: #000;
    text-align: left;

}
.purchase-way {
    line-height: 48rpx;
}
p {
    line-height: 42rpx;
    margin-top: 40rpx;
    color: #4C4C4C;
    white-space: pre-wrap;
    word-break:break-all;
}

.exclude-area {
    margin-top: 30rpx;
    font-size: 26rpx;
    color: #808080;
    line-height: 42rpx;
    box-sizing: border-box;
}

.exclude-area strong {
    display: inline;
    font-size: 28rpx;
    color: #000;
    font-weight: bold;
}
</style>