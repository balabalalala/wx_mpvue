<template>
    <div class="address-container" @click="toAddressPage">
        <h2>收货人信息</h2>
        <template v-if="!addressNothing">
            <p class="address-nothing">选择收货地址</p>
        </template>
        <template v-else>
            <p class="user"><span>{{address.user_name}}</span><span>{{address.tel_number}}</span></p>
            <p class="address">{{addressSplice}}</p>
            <div class="tags" v-if="pageType == 1">
                <p v-if="address.is_primary" class="label-btn label-btn-default">默认</p>
                <p v-if="address.tag" class="label-btn label-btn-active">{{address.tag}}</p>
            </div>
        </template>
        <image v-if="pageType == 1" class="icon" src='https://img-ali.xiaohongchun.com.cn/program-inline-images/MythreeActiveIcon.png'></image>
    </div>
</template>

<script>
import _ from 'underscore'
import jump from '../../common/lib/jump'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters } = createNamespacedHelpers('orderConfirm')
export default {
    computed: {
        ...mapState({
            address: state => _.pick(state.address, 'is_primary', 'tag', 'tel_number', 'user_name', 'id'),
            sn: state => state.order.sn,
            pageType: state => state.pageType
        }),
        ...mapGetters(['addressSplice']),
        addressNothing () {
            return !!Object.keys(this.address).length
        },
    },
    methods: {
        toAddressPage () {
            if(this.pageType == 2) return
            let id = _.result(this.address, 'id')
            jump.navigateTo('address_list', {id, sn: this.sn,})
        }
    }
}
</script>

<style scoped>
.address-container {
    padding: 41rpx 0 37rpx 37rpx;
    font-size: 26rpx;
    font-family: PingFang-SC-Regular;
    background-color: #fff;
    position: relative;
}
.address-container h2 {
    font-size: 28rpx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(34,34,34,1);
    line-height: 1;
}
.user {
    margin-top: 24rpx;
    line-height: 1;
    color:1rgba(76,76,76,1);
    line-height: 1;
}
.user span:first-child {
    display: inline-block;
    margin-right: 21rpx;
}
.address {
    margin-top: 16rpx;
    line-height: 1;
}
.address-nothing {
    margin-top: 24rpx;
    color: #808080;
}
.icon {
    position: absolute;
    top: 50%;
    right: 34rpx;
    width: 17rpx;
    height: 29rpx;
    transform: translateY(-50%);
}
.tags {
    position: absolute;
    right: 70rpx;
    top: 50%;
    transform: translateY(-50%);
}
.label-btn {
    display: inline-block;
    min-width: 74rpx;
    line-height: 34rpx;
    height: 34rpx;
    text-align: center;
    font-size: 22rpx;
    border: 1rpx solid #ccc;
    border-radius: 6rpx;
    background: #fff;
    margin-right: 20rpx;
    box-sizing: border-box;
    padding: 0;
    vertical-align: middle;
}

.label-btn-active, .label-btn-default {
    border: none;
    color: #fff;
    background-color: #79BCFE;
}

.label-btn-default {
    background-color: #dc3538;
}

</style>
