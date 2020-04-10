<template>
<form report-submit='true' @click="onclick" @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <ul v-if="newsList.length > 0" class="news-container">
            <li v-for="(item, index) in newsList" :key="index">
                <news-item
                    :icon="item.icon"
                    :nick="item.nick"
                    :createTime="item.create_time"
                    :myComment="item.my_comments"
                    :replyComments="item.reply_comments"
                    :messageTitle="item.message_title"
                    :Ostatus="item.o_status"
                    :Osn="item.o_sn"
                    :mall="item.mall"
                    :goodsPrice="item.unit_price"
                    :num="item.num"
                    :remark="item.remark"
                    :skuDesc="item.sku_desc"
                    :imageUrl="item.e_image"
                    :title="item.e_title"
                    :messageType="item.message_type"
                    :urlString="item.url_string"
                    :commentId="item.id"
                    :eType="item.e_type"
                    :goodsId="item.eid"
                    :isAll="1"
                    :mainId="item.main_id"
                    :del="item.del"
                />
            </li>
        </ul>
        <!-- 无消息 -->
        <div v-else class="no-news">
            <img src="https://img-ali.xiaohongchun.com.cn/admin/15689634479041ad55b77.png">
        </div>
        <loading v-if="isLoading" />
    </button>
</form>
</template>
<script>
import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import newsItem from '@/components/my_news/news_item'
import loading from "@/components/common/loading"
let pageMark = 0;
let pageSize = 20;
export default {
    mixins: [mixin],
    data () {
        return {
            newsList:[],
            noMoreData: false,
            isLoading: true,
        }
    },
    components:{
        newsItem,loading
    },
    methods:{
        async getNewsList (reset) {
            this.isLoading = true;
            let res = await fly.get(`/lsj/v3/message/get_user_message_new?message_type_list=0&message_type_list=1&message_type_list=2&message_type_list=3&page_mark=${pageMark}`);
            res = res.data
            if (res.result.length < 20) {
                this.isLoading = false
                this.noMoreData = true
            }
            if (reset) {
                this.newsList = res.result
            } else {
                this.newsList = this.newsList.concat(res.result)
            }
            pageMark = this.newsList[this.newsList.length-1].id
        },
        async pullNewData () {
            if(this.noMoreData) return
            this.isLoading = true
            this.noMoreData = false
            pageMark = 0 
            this.newsList = []
            this.getNewsList(true)
        },
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
        this.pullNewData()
    },

    onReachBottom() {
        if(this.noMoreData) return
        this.getNewsList(false)
    },
    async onLoad() {
        pageMark = 0 
        this.getNewsList(true);
    },
    onUnload() {
        pageMark = 0
        pageSize = 20
        this.newsList = []
        Object.assign(this.$data, this.$options.data())
    }

}
</script>
<style src="@/style/common.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style scoped>
    .no-news {
        margin-left: 148rpx;
        margin-top: 353rpx;
        width: 460rpx;
        height: 460rpx;
    }
    img {
        width: 460rpx;
        height: 460rpx;
    }
</style>


