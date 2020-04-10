<template>
<div v-if="showAuth" @click="hide" data-id="modal-mask" class="mask">
    <div class="modal">
        <h2>授权后可继续操作</h2>

        <button :data-name="authName || 'auth'" type="primary" class="auth-button" size="mini" open-type="getUserInfo" lang="zh_CN" @getuserinfo="register">
            点击授权
        </button>

        <div class="protocol">授权即代表您同意<navigator url="/pages/web_view?webPage=1&&url=%2Fprotocol%2Fuser">《用户协议》</navigator>与<navigator url="/pages/web_view?webPage=1&url=%2Fprotocol%2Fprivacy">《隐私政策》</navigator></div>
    </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import user from '@/lib/user'
import jump from '@/common/lib/jump'
export default {
    computed: {
        ...mapState(['showAuth', 'authName']),
    },

    methods: {
        ...mapMutations(['toggleAuth']),
        hide(e) {
            if(e.target.dataset.id == 'modal-mask') {
                this.toggleAuth()
            }
        },

        async register(e) {
            if(e.mp.detail.errMsg !== 'getUserInfo:ok') {
                return
            }

            const resp = await this.wx.login()

            await user.userInfoLogin(resp.code, e.mp.detail)

            this.toggleAuth()
            
            this.$emit('authed')
        }
    }
}
</script>

<style scoped>
.modal {
    position: absolute;
    width: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 2em;
    font-size: 28rpx;
    color: #a3a3a3;
    text-align: center;
    border-radius: 10rpx;
}

h2 {
    font-size: 30rpx;
    font-weight: bold;
    color: #4c4c4c;
}

.auth-button {
    display: inline-block;
    margin-top: 1.5em;
}

.protocol {
    font-size: 22rpx;
    margin-top: 1em;
}

.protocol navigator {
    display: inline;
    color: #ff2e3f;
}
</style>