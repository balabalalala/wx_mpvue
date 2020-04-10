<template>
    <div class="remark-container">
        <p>留言备注：</p>
        <p>{{message}}</p>
    </div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            message: state => state.order.remark
        })
    }
}
</script>

<style scoped>
.remark-container {
    box-sizing: border-box;
    width: 100%;
    padding: 40rpx 35rpx 45rpx 37rpx;
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.remark-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 37rpx;
    right: 0;
    height: 1rpx;
    background:rgba(241,241,241,1);
}
.remark-container p:first-child {
    width: 152rpx;
    font-size: 28rpx;
    font-weight: 500;
    color:rgba(34,34,34,1);
    text-align: left;
}
.remark-container p:last-child {
    flex: 1;
    font-size: 26rpx;
    color:rgba(76,76,76,1);
}
</style>
