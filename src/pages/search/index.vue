<template>
<form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
<button formType="submit" class="form-button" hover-class="none">
    <search-header :place="place" @search="jump" @changeSearchSate="changeSearchSate" @hideSearchTip="showSuggester = false"></search-header>
    <search-suggester v-if="showSuggester" :word="tipChangeWord" :tipList="tipList" @search="jump"></search-suggester>
    <auth />
    <div v-if="!showSuggester" class="search-info">
        <div v-if="hots && hots.length" class="hots">
        <h2>热门搜索</h2>
        <ul>
            <li data-name="search_hot_click" :data-search_word="hot" @click="jump(hot)" v-for="(hot, index) in hots" :key="index">{{ hot }}</li>
        </ul>
        </div>

        <div v-if="history.length" class="history">
            <h2 @click="clearHistory">搜索历史</h2>
            <ul>
                <li data-name="search_history_click" :data-search_word="word" @click="jump(word)" v-for="(word, index) in history" :key="index">{{ word }} <i @click.stop="remove(index)">×</i></li>
            </ul>
        </div>

        <div class="empty" v-if="!history.length">
            <img src="https://img-ali.xiaohongchun.com.cn/program-inline-images/searchEmpty.png">
            <p>请输入商品名称</p>
        </div>
    </div>
    
</button>
</form>

</template>

<script>
import { mapState } from 'vuex'
import mixin from '@/mixin/mixin'
import fly from "@/lib/http"
import jump from '@/common/lib/jump'
import Auth from '@/components/common/auth'
import user from '@/lib/user'
import SearchHeader from '@/components/search/header'
import searchSuggester from '@/components/search/search_suggester'

const LOCALSEARCHKEY    = 'search_history'

export default {
    mixins: [mixin],

    data() {
        return {
            hots: [],
            history: [],
            place: '',
            showSuggester: false,
            tipList:[],
            tipChangeWord: ''
        }
    },

    components: {
        SearchHeader,Auth,searchSuggester
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
        remove(index) {
            this.history.splice(index, 1)   
            this.sync()
        },
        
        clearHistory() {
            this.history = []
            this.sync()
        },

        sync() {
            wx.setStorage({
                key: LOCALSEARCHKEY,
                data: this.history
            })
        },

        jump(keyword) {
            // if(!user.isLogin()) {
            //     this.$store.commit('setAuthName', 'search_' + keyword)
            //     return this.$store.commit('toggleAuth')
            // }
            this.checkWordIsExist(keyword)
            jump.navigateTo('search_result', {keyword})
        },

        checkWordIsExist(word) {
            //先删除 再加入，保证已经搜索过的记录出现在 搜索历史的第一位
            if(this.history.indexOf(word) == -1) {
                this.history.unshift(word)
                wx.setStorage({
                    key: LOCALSEARCHKEY,
                    data: this.history
                })
            } else {
                var index = this.history.indexOf(word)
                this.remove(index)
                this.checkWordIsExist(word)
             }
        },
    },

    onLoad() {
        
        this.$store.commit('setPlace', this.$mp.query.keyword)

        fly .get('/lsj/v3/favorite/hot_search')
            .then(resp => this.hots = resp.data)
    },

    onShow() {        
        this.wx.getStorage({key: LOCALSEARCHKEY})
            .then(resp => resp && (this.history = resp.data || []))
    },

    onUnload() {
        this.showSuggester = false
        this.$store.commit('setPlace', '')
    }
}
</script>


<style scoped>
h2 {
    line-height: 130rpx;
    font-weight: 500;
    font-size: 32rpx;
}

h2::before {
    content: '';
    display: inline-block;
    width: 6rpx;
    height: 1em;
    margin-right: 34rpx;
    vertical-align: -3rpx;
}

.hots ul {
    padding-left: 30rpx;
}

.hots li {
    display: inline-block;
    padding: 0 29rpx;
    line-height: 52rpx;
    font-size: 26rpx;
    background: #f1f1f1;
    margin: 0 20rpx 30rpx 0;
}

.history h2 {
    pointer-events: none;
}

.history h2::after {
    content: '';
    float: right;
    width: 30rpx;
    height: 35rpx;
    margin: 50rpx 20rpx 0 0;
    background: url(https://img-ali.xiaohongchun.com.cn/program-inline-images/search_delete.png) 0 0 no-repeat;
    background-size: contain;
    pointer-events: auto;
}

.history li {
    line-height: 90rpx;
    border-bottom: 1px solid #f1f1f1;
    font-size: 30rpx;
    text-indent: 40rpx;
}

.history li:first-child {
    border-top: 1px solid #f1f1f1;
}

.history li i {
    float: right;
    color: #ccc;
    font-size: 40rpx;
    padding: 0 .5em 0 0;
    font-weight: bold;
    margin-right: .2em;
}

.empty {
    text-align: center;
}

.empty img {
    width: 150rpx;
    height: 150rpx;
    margin-top: 200rpx;
}

.empty p {
    margin-top: 100rpx;
    color: #191919;
    font-size: 32rpx;
}
</style>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
<style src="@/style/btns.css"></style>


