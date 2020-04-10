<template>
<div class="placeholder">
    <div class="container">
        <div data-id="search" @click="clearInput" :class="{clear: keyword}" class="search-box">
            <input @confirm="search" @input="changeSearchSate" confirm-type="search" @click.stop :placeholder="placeholder" v-model="keyword">
        </div>
        <button data-name="search_btn_click" :data-search_word="keyword" @click="search" class="search-btn">搜索</button>
    </div>
    <code-red-envelope v-if="showCodeRedEnvelope" :img="codeRedEnvelopeImg" @closeHandle="closeHandle"></code-red-envelope>
</div> 
</template>

<script>
import { mapState } from 'vuex'
import fly from "@/lib/http"
import user from '@/lib/user'
import CodeRedEnvelope from '@/components/search/code_red_envelope'

const dftPlace          = '请输入商品名称'
const LOCALSEARCHKEY    = 'search_history'

export default {
    data() {
        return {
            keyword: '',
            history: [],
            codeRedEnvelopeImg: '',     // 红包图片
            showCodeRedEnvelope: false  // 红包弹窗
        }
    },

    components: {
        CodeRedEnvelope
    },

    methods: {
        changeSearchSate(e) {
            if(e.target.value){
                this.$emit('changeSearchSate', e.target.value)
                this.$store.commit('setSearchWord', decodeURIComponent(e.target.value))
            }else{
                this.$emit('hideSearchTip')
            }
            
        },
        clearInput() {
            this.keyword = ''
            this.$emit('hideSearchTip')
        },
        search() {
            const word = this.keyword || this.placeholder
            // if(!user.isLogin()) {
            //     // 获取授权
            //     this.$store.commit('setAuthName', 'search_' + word)
            //     this.$store.commit('toggleAuth')
            //     return
            // }
            if(word && word != dftPlace) {
                this.$emit('search', word)
                // 调用暗号红包 API 根据结果处理后续逻辑
                // code:    0: 正常搜索  1: 领取成功  401: 需要授权
                // fly.post('/lsj/v3/activity/cipher/coupon?word=' + encodeURI(word)).then(resp => {
                //     if (resp.data.code == 1) {
                //         // 红包入账弹窗
                //         this.codeRedEnvelopeImg = resp.data.img[0]
                //         this.showCodeRedEnvelope = true
                //     } else if (resp.data.code == 0) {
                //         // 正常关键词 搜索结果
                //         word && this.$emit('search', word)
                //         // 保存搜索词
                //         // this.saveSearchWord(word)
                //         this.checkWordIsExist(word)
                //     }
                // })
            }
        },

        saveSearchWord(word) {
            // 存储前保证当前为最新数据
            try {
                this.sync(word)
            } catch (e) {
                console.log(e)
            }
        },

        sync(word) {
            if(this.history.indexOf(word) == -1) {
                this.history.unshift(word)
                wx.setStorage({
                    key: LOCALSEARCHKEY,
                    data: this.history
                })
            }
        },

        checkWordIsExist(word) {
            const value = wx.getStorageSync(LOCALSEARCHKEY)
            this.history = value ? value : []
            //先删除 再加入，保证已经搜索过的记录出现在 搜索历史的第一位
            var index = this.history.indexOf(word)
            if(index >= 0){
                this.history.splice(index, 1)
            }
            this.saveSearchWord(word)
        },

        closeHandle() {
            this.showCodeRedEnvelope = false;
        },
    },

    computed: {
        ...mapState({
            place: state => state.place,
            word: function(state) {
                if(state.word) {
                    this.keyword = decodeURIComponent(state.word)
                } else {
                    this.word = ''
                }
                
                return state.word
            },
        }),

        placeholder() {
            if(this.place) {
                return decodeURIComponent(this.place)
            }

            return dftPlace
        }
    },

    onLoad() {
        this.keyword = ''
    },
}
</script>

<style scoped>
.placeholder {
    height: 90rpx;
}

.container {
    border-bottom: 1rpx solid #f1f1f1;
    position: fixed;
    left: 0;
    right: 0;
    background: #fff;  
    z-index: 1;  
}

.search-box {
    margin: 19rpx 30rpx;
    pointer-events: none;    
    width: 590rpx;
    box-sizing: border-box;
    padding-left: 65rpx;
    background: #f2f2f2 url(https://img-ali.xiaohongchun.com.cn/program-inline-images/searchgrey.png) 15rpx center no-repeat;
    background-size: 37rpx 37rpx;
}

.search-box input {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 45rpx);
    height: 52rpx;
    pointer-events: auto;
    font-size: 26rpx;
}

.search-box::after {
    content: '×';
    display: inline-block;
    pointer-events: auto;
    text-align: center;
    width: 35rpx;
    height: 35rpx;
    font-size: 24rpx;
    vertical-align: 8rpx;
    line-height: 30rpx;
    background-color: #c4c7c4;
    color: #fff;
    border-radius: 50%;
    margin-right: 10rpx;
    visibility: hidden;
} 

.clear::after {
    visibility: visible;
}

.search-btn {
    position: absolute;
    right: 30rpx;
    top: 0;
    font-size: 32rpx;
    background: transparent;
    color: inherit;
    padding: 0;
    line-height: 90rpx;
}
</style>
