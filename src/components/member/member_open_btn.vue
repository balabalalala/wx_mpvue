<template>
    <button :data-name="name || ''" class="member-open-btn" @click="loginEvent">
        {{note}}
    </button>
</template>

<script>
import _ from 'underscore'
import { mapMutations } from 'vuex'
import user from '@/lib/user'
export default {
    props: {
        note: String,   // 按钮的文案
        name: String,
        uid: {
            type: Number,
            default: 0
        },
    },
    methods: {
        ...mapMutations(['toggleAuth', 'setAuthName']),
        loginEvent (e) {
            if(!user.isLogin()) {
                let name = e.target.dataset.name  
                this.setAuthName(name)
                return this.toggleAuth()
            }
            this.$emit('openMember')
        }
    }
}
</script>

<style scoped>
.member-open-btn {
    font-size: inherit;
    width: 100%;
    height: 100%;
    line-height: 67rpx;
    display: block;
    color: inherit;
    position: relative;
    background-color: inherit;
    border-radius:50rpx; 
    font-size:26rpx;
    color:rgba(34,34,34,1);
}

</style>