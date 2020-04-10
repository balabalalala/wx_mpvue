<template>
    <div class="save-container">
        <div class="save-left">
            <image :src="user.icon"></image>
            {{user.nick}}
        </div>
        <div class="save-right">
            <span>购物顾问本单为您</span>
            <span>节省{{saveAmount/100}}元</span>
        </div>
    </div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            user: state => _.pick(state.disclosure.user, 'icon', 'nick'),
            saveAmount: state => {
                return state.pageType == 2 ? state.order.economy_price : state.disclosure.economy_price
            },
        })
    }
}
</script>

<style scoped>
.save-container {
    box-sizing: border-box;
    width: 100%;
    height: 100rpx;
    padding: 0 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium; 
    color: rgba(255,255,255,1);
    line-height: 100rpx;
    background-color: #dc3538;
}
.save-left {
    max-width: 236rpx;
    font-size: 26rpx;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.save-left image{
    width: 60rpx;
    height: 60rpx;
    background: rgba(193,122,76,1);
    border-radius: 50%;
    vertical-align: middle;
}
.save-right span:last-child {
    font-weight: 500;
    font-size: 26rpx;
}
</style>
