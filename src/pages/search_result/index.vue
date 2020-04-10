<template>
<form :class="{ipx: isIPX}" report-submit="true" @click="onclick" @submit="formSubmit">
<button formType="submit" class="form-button" hover-class="none">
    <search-header @search="jump" @changeSearchSate="changeSearchSate" @hideSearchTip="showSuggester = false"></search-header>
    <search-suggester v-if="showSuggester" :word="tipChangeWord" :tipList="tipList" @search="jump"></search-suggester>
    <div v-if="!showSuggester" class="search-info">
        <category @showSubscribeModal="showSubscribeModal" v-if="category" :category="category" />

        <empty v-if="!disclosures.length && fetch" text="无搜索结果,请重新输入" />

        <ul v-if="disclosures" class="disclosures">
            <li v-for="(disclosure,index) in disclosures" :key="index">
                <p :class="disclosures[index] && disclosures[index].detail == '1' ? 'good-price2' : 'good-price1'" v-if="disclosures[index] && disclosures[index].detail == '1'">以下为历史好价信息，可供参考</p>
                <disclosure v-else @showSubscribeModal="showSubscribeModal" :disclosure="disclosure" />
            </li>
        </ul>
        <loading v-if="needLoad"></loading>
        <p v-if="!moreData && disclosures.length" class="no-more-data">没有更多数据了</p>
        <!--<navigator class="total" :url="'/pages/search_history/main?keyword=' + word" v-if="total">查看{{ total }}条历史精选好价 ></navigator>-->
        <index />
        <subscribe-modal :showModal="isShowSubscribeAlert" @hideSubscribeAlert="hideSubscribeModal" />
    </div>
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
import Category from '@/components/search/category'
import Loading from "@/components/common/loading"
import Index from '@/components/common/to_index'
import Empty from '@/components/common/empty'
import SubscribeModal from '@/components/common/subscribe_modal'
import searchSuggester from '@/components/search/search_suggester'

export default {
    data() {
        return {
            disclosures: [],
            category: null,
            moreData: false,
            needLoad: false,
            page_size:20,
            page_mark:0,
            fetch: false,
            isShowSubscribeAlert: false,
            showSuggester: false,
            tipList:[],
            tipChangeWord: '',
            goodPrice:{detail:"1"},
            isDivide:true,
            audit_switch: '1',
        }
    },

    mixins: [mixin],

    components: {
        SearchHeader, Disclosure, Category,
        Index, Empty, Loading, SubscribeModal, searchSuggester
    },

    computed: {
        ...mapState(['word'])
    },

    onReachBottom() {
        this.moreData && this.fetchDisclosures()
    },

    methods: {
        async changeSearchSate(word) {
            let res = await fly.get('lsj/v3/search/associational_word?word=' + encodeURI(word));
            res = res.data;
            if(res.result.length > 0) {
                this.tipList = res.result
                this.tipChangeWord = word
                this.showSuggester = true
            }else {
                this.tipList = []
                this.tipChangeWord = ''
                this.showSuggester = false
            }
            
        },
        async fetchDisclosures() {
            this.needLoad = true;
            const params = {
                word: this.word,
                page_size: this.page_size,
                page_mark:this.page_mark,
                type: 1
            }

            let resp = await fly.get(`/lsj/v3/search/${this.audit_switch == '1' ? 'by_word' : 'by_words'}?` + qs.stringify(params)) 
                // .then(resp => {
                    this.needLoad = false
                    this.fetch = true
                    if(resp.data.result.length < this.page_size){
                        this.moreData = false;
                    } else {
                        this.moreData = true;
                    }
                    this.disclosures.push(...resp.data.result)
                    if(this.isDivide){
                        for(let i = 0;i < this.disclosures.length;i++){
                            if(this.disclosures[i].buy_status == 0){
                                this.disclosures.splice(i,0,this.goodPrice)
                                this.isDivide = false
                                break;
                            }
                        }
                    }
                    // this.total = resp.data.totalCount
                    // this.fetched = true
                    this.page_mark = resp.data.page_mark
                // })
        },

        fetchCategory() {
            fly .get('/lsj/v3/favorite/search_category?word=' + encodeURI(this.word))
                .then(resp => {
                    if(resp.data.length) {
                        let tempCategory = resp.data[0]
                        tempCategory.description = tempCategory.name + "推荐"
                        tempCategory.name = "订阅" + tempCategory.name + "分类"
                        tempCategory.tag_type = 2
                        this.category = tempCategory
                    }
                    else {
                        this.fetchPriceTag()
                    }
                })
        },

        fetchPriceTag() {
            fly .get('/lsj/v3/favorite/search_goods_tag?word=' + encodeURI(this.word))
                .then(resp => {
                    if(resp.data.length) {
                        this.category = resp.data[0]
                        this.category.name = this.category.tag_title
                        this.category.icon = this.category.tag_image
                    }
                })
        },
        showSubscribeModal() {
            this.isShowSubscribeAlert = true
        },
        jump(keyword) {
            jump.redirectTo('search_result', {keyword})
        },
        hideSubscribeModal() {
            this.isShowSubscribeAlert = false
        }
    },

    async onLoad() {
        // 开关审核
        const misc = await fly.get(`/lsj/v3/misc?key=audit_switch_0926`)
        this.audit_switch = misc.data ? misc.data.prop_value : '1'
        this.$store.commit('setWord', decodeURIComponent(this.$mp.query.keyword))
        this.fetchDisclosures()
        this.fetchCategory()
    },

    onUnload() {
        Object.assign(this.$data, this.$options.data())
        this.$store.commit('setWord', '')
        this.showSuggester = false
    },

    onShareAppMessage() {
        return {
            title: '有人分享给你一大波' + this.word,
            path: '/pages/search_result/main?keyword=' + this.word
        }
    }

}
</script>


<style scoped>
.search-info {
    background-color: #fff;
}
.disclosures {
    background-color: #fff;
}
h2 {
    text-align: center;
    font-size: 32rpx;
    color: #1a1a1a;
    font-weight: 500;
    padding: 30rpx 0 10rpx;
    border-bottom: 1px solid #f2f2f2;
}

h2::before, h2::after {
    content: '';
    display: inline-block;
    width: 25rpx;
    height: 6rpx;
    border-radius: 6rpx;
    border: none;
    background-color: #eb4f47;
    transform: rotate(-45deg);
    margin-right: 15rpx;
    vertical-align: 8rpx;
}

h2::after {
    margin-left: 10rpx;
}

.total {
    line-height: 75rpx;
    text-align: center;
    font-size: 28rpx;
    border-bottom: 1px solid #f2f2f2;
}
.good-price1 {
    width: 100%;
    font-size: 26rpx;
    padding: 0 0 30rpx 0;
    background-color: #222222;
    line-height: 1;
    background-color: #f5f5f5;
    text-align: center;
}
.good-price2{
    width: 100%;
    font-size: 26rpx;
    padding: 30rpx 0;
    background-color: #222222;
    line-height: 1;
    background-color: #f5f5f5;
    text-align: center;
}
.no-more-data{
    margin: 20rpx 0;
    font-size: 20rpx;
    color: #808080;
    text-align: center;
}

</style>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
<style src="@/style/btns.css"></style>
<style src="@/components/subcribe/subcribe_focus.css"></style>


