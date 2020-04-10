<template>
<form :class="{ipx: isIPX}" report-submit="true" @click="onclick" @submit="formSubmit">
<button formType="submit" class="form-button" hover-class="none">
    <search-header @search="jump"></search-header>

    <p class="total">为您展示过去{{ total }}条精选好价</p>

    <ul class="disclosures">
        <li v-for="disclosure in disclosures" :key="disclosure.did">
            <disclosure @follow="toFollow(disclosure)" :disclosure="disclosure" />
        </li>
    </ul>

    <p v-if="notMore" class="not-more">没有更多了</p>

    <index />

    <modal v-if="showFollowModal" @maskClick="showFollowModal=false" :show-cancel="false" :show-confirm="false" width="580rpx">
        <div slot="body" class="focus-modal">
            <p class="remind-title">关注服务号就能收到订阅消息哦</p>
            <p>回复数字“2” 即可获取“天天跟我买”</p>
            <p>服务号二维码</p>
            <img class="focus-img" src="https://img-ali.xiaohongchun.com.cn/admin/15475393331903778cfd2.PNG" />
            <button 
                v-if="subDisclosure" 
                data-name="search_focus"
                :send-message-title="'【关注服务号】 ' + subDisclosure.title"
                :send-message-path="'/pages/disclosure/main?gdid=' + subDisclosure.did + '&source=subscribe'"
                :send-message-img="subDisclosure.image_url"
                :show-message-card="true"
                class="focus-to-follow" 
                open-type="contact" 
                @click="showFollowModal=false" 
                session-from="search_history" 
                slot="footer">去关注</button>
        </div>
    </modal>
</button>
</form>

</template>

<script>
import { mapState } from 'vuex'
import qs from 'qs'
import mixin from '@/mixin/mixin'
import fly from "@/lib/http"
import jump from '@/common/lib/jump'

import SearchHeader from '@/components/search/header'
import Disclosure from '@/components/search/disclosure'

import Index from '@/components/common/to_index'

export default {
    data() {
        return {
            disclosures: [],
            total: 0,
            showFollowModal: false,
            subDisclosure: null,
            pageMark: 0,
            pageSize: 20,
            notMore: false,
        }
    },

    mixins: [mixin],

    components: {
        SearchHeader, Disclosure,
        Index, 
    },

    computed: {
        ...mapState(['word'])
    },

    methods: {
        fetchDisclosures() {
            const params = {
                word: this.word,
                page_size: this.pageSize,
                buyable: false,
                page_mark: this.pageMark
            }

            fly .get('/lsj/v1/search/disclosureList?' + qs.stringify(params))
                .then(resp => {
                    const disclosures = resp.data.disclosurelist
                    if(disclosures.length) {
                        this.disclosures.push(...disclosures)
                        this.total = resp.data.totalCount
                        this.pageMark = resp.data.page_mark
                    }

                    if(this.disclosures.length == this.total) {
                        this.notMore = true
                    }
                })
        },

        toFollow(disclosure) {
            this.showFollowModal = true
            this.subDisclosure = disclosure
        },

        jump(keyword) {
            this.wx.navigateBack({delta: 1})            
                .then(() => jump.redirectTo('search_result', {keyword}))      
        },
    },

    onLoad() {
        this.$store.commit('setWord', decodeURIComponent(this.$mp.query.keyword))
        this.fetchDisclosures()
    },

    onUnload() {
        Object.assign(this.$data, this.$options.data())
    },
    onReachBottom() {
        !this.notMore && this.fetchDisclosures()
    }

}
</script>


<style scoped>
.total {
    line-height: 75rpx;
    text-align: center;
    font-size: 28rpx;
    border-bottom: 20rpx solid #f1f1f1;
}

.not-more {
    margin:50rpx 0;
    text-align:center;
    font-size:26rpx;
    color:#a3a3a3;
}

</style>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
<style src="@/style/btns.css"></style>
<style src="@/components/subcribe/subcribe_focus.css"></style>


