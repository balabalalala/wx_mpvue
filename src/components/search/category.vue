<template>
    <div class="category ovh">
        <img :src="category.icon">
        <p>{{ category.name }}</p>
        <p>{{ category.description }}</p>
        <button data-name="search_category_subscribed" class="subscribe" @click="onclick">{{sid ? '已订阅' : '订阅'}}</button>
    </div>
</template>

<script>
import fly from "@/lib/http"

export default {
    data() {
        return {
            sid: ''
        }
    },
    props: ['category'],
    methods: {
        onclick() {
            this.sid ? this.unsub() : this.sub()
        },
        sub() {
            fly
                .post('/lsj/v3/favorite', {
                    eid: this.category.id,
                    e_type: this.category.tag_type,
                })
                .then(resp => {
                    this.sid = resp.data.id
                    const today = new Date()
                    const todayModalVal = today.getFullYear()+ "-" + (today.getMonth()+1) + "-" + today.getDate()
                    const todayModalKey = 'subscribed_install_modal'
                    const todayModalstore = wx.getStorageSync(todayModalKey)
                    
                    if(!todayModalstore || (todayModalstore && todayModalstore !== todayModalVal)) {
                        this.$emit('showSubscribeModal')
                        wx.setStorage({key: todayModalKey, data: todayModalVal })
                    }
                })
        },

        unsub() {
            fly .delete('/lsj/v3/favorite?id=' + this.sid)
                .then(() => this.sid = '')
        }
    }
}
</script>

<style scoped>
.category {
    padding: 40rpx 30rpx 0 30rpx;
    /* margin-bottom: 30rpx; */
    background-color: #fff;
    border-top: 20rpx solid #f5f5f5;
    border-bottom: 20rpx solid #f5f5f5;
}
.category img {
    width: 214rpx;
    height: 214rpx;
    float: left;
}

.category p:nth-child(2) {
    color: #1a1a1a;
    font-size: 28rpx;
    line-height: 40rpx;
    font-weight: 500;
    margin-top: 26rpx;
    margin-left: 234rpx;
}

.category p:nth-child(3) {
    color: #808080;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 40rpx;
    margin-left: 234rpx;
}

.category button {
    float: right;
    margin-right: 33rpx;
    margin-top: 1.5em;
}
</style>
