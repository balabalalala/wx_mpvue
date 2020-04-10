<template>
<div class="container">
    <div class="content">
        <button 
        v-if="disclosure.burst_num <= 1" 
        class="d-inner-group-1"
        data-name="d-inner-group-1" 
        open-type="contact" 
        @click="hideModal" 
        session-from="disclosure"
        send-message-title="点击下方消息入群"
        :send-message-path="contactMsgPath"
        send-message-img="https://img-ali.xiaohongchun.com.cn/admin/1552390735181134628e2.png"
        show-message-card="true"
        ></button>
        <button 
        v-if="disclosure.burst_num > 1" 
        class="d-inner-group-2" 
        data-name="d-inner-group-2"
        open-type="contact" 
        @click="hideModal" 
        session-from="disclosure"
        send-message-title="点击下方消息入群"
        :send-message-path="contactMsgPath"
        send-message-img="https://img-ali.xiaohongchun.com.cn/admin/1552390735181134628e2.png"
        show-message-card="true"
        ></button>
    </div>
</div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('disclosure')

export default {
    data() {
        return {
            contactMsgPath: ''
        }
    },
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'burst_num', 'id')
        }),
        getMsgPath() {
            this.contactMsgPath = `/pages/disclosure/main?gdid=${this.disclosure.id}&source=${this.disclosure.burst_num <= 1 ? 'good_price_group' : 'mono_group'}` 
        }
    }
}
</script>

<style scoped>
/* .container {
    border-bottom: 20rpx solid #F5F5F5;
} */
.content {
    height:300rpx;
}
.content img {
    width: 100%;
    height: 340rpx;
}
.d-inner-group-1 {
    background-image: url('https://img-ali.xiaohongchun.com.cn/admin/1566894944178376dced4.png');
    background-size: 100% 100%;
    height: 300rpx;
    width: 100%;
}
.d-inner-group-2 {
    background-image: url('https://img-ali.xiaohongchun.com.cn/admin/15670651508301756e536.png');
    background-size: 100% 100%;
    height: 300rpx;
    width: 100%;
}


</style>