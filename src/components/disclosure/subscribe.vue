<template>
<div class="subscribe-container">
    <div class="subscribe-title">
        <p>订阅</p>
        <span>有好价时通知我</span>
    </div>
    <div class="subscribe-tag">
        <button :data-name="btnDisclosure" @click="sub(disclosure)" v-if="showDisclosure" :class="{subscribed: disclosure.result}">此商品</button>
        <button :data-name="btnCategory" @click="sub(category)" v-if="showCategory" :class="{subscribed: category.result}">{{ category.name }}</button>
        <button v-for="item in price_tag" :key="item" @click="sub(item)" :class="{subscribed: item.result}">{{ item.name }}</button>
    </div>
</div>
</template>

<script>
import fly from '@/lib/http'
import user from '@/lib/user'

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('disclosure')

export default {
    computed: {
        ...mapState({
            disclosure: state => state.subscribe_list.disclosure ? state.subscribe_list.disclosure[0] : [],
            category: state => state.subscribe_list.category ? state.subscribe_list.category[0] : [],
            price_tag: state => state.subscribe_list.price_tag || [],
        }),

        showDisclosure() {
            return !!this.disclosure.eid
        },

        showCategory() {
            return !!this.category.eid
        },

        btnDisclosure() {
          return this.disclosure.result ? 'g_unsub' : 'g_sub'
        },

        btnCategory() {
          return this.category.result ? 'c_unsub' : 'c_sub'
        },
    },
    methods: {
        ...mapActions(['subscribe', 'unSubscribe']),
        sub(obj) {
            if(!user.isLogin()) {
                if(obj.e_type == 1) obj.name = '此商品'
                this.$store.commit('setAuthName', 'subscribe_' + obj.name)
                return this.$store.commit('toggleAuth')
            }

            // 取消订阅
            if(obj.result) {
                this.unSubscribe(obj)
            }
            else {
                this.subscribe(obj)
            }
        }
    }
}
</script>

<style scoped>
.subscribe-container {
    padding: 0 40rpx 40rpx;
    border-top:1rpx solid #F5F5F5;
}

.subscribe-title {
    position: relative;
    /* border-top: 1rpx solid #ccc; */
    padding: 30rpx 0 20rpx;
}


p {
    display: inline-block;
    line-height: 1;
    font-size: 32rpx;
    font-weight: 500;
    color: #000;
}

span {
    display: inline-block;
    margin-left: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #A5A5A5;

}

.subscribe-tag {
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden; 
}

button {
    display: inline-block;
    line-height: 1.2;
    color: #000;
    font-size: 24rpx;
    box-sizing: border-box;
    padding: 15rpx 28rpx;
    vertical-align: bottom;
    margin-right: 12rpx;
    border-radius: 0;
    background-color: #F5F5F5;

}

.subscribed {
    color:#DC3538;
}

</style>