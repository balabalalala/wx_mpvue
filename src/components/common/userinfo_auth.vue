<template>
    <button :data-name="name || ''" class="userinfo-button" :open-type="openType" @tap="getCode" lang="zh_CN" @getuserinfo.stop="getUserInfo($event)">
        <text :data-name="name || ''">{{note}}</text>
    </button>
</template>

<script>
import user from '@/lib/user'

export default {
    props: {
        note: String,   // 按钮的文案
        type: String,   // 按钮的open-type
        name: String,
    },

    data() {
        return {
            code: '',
            login: user.isLogin()
        }
    },

    computed: {
        openType() {
            if(!this.login) {
                return 'getUserInfo'
            }

            return this.type
        }
    },

    methods: {
        getCode() {
            if(this.login) {
                return this.$emit('authed')
            }

            this.wx.login()
                .then(resp => this.code = resp.code)
                .catch(e => console.error(e))
        },
        getUserInfo(e) {
            if(e.mp.detail.errMsg !== 'getUserInfo:ok') {
                return
            }

            user.userInfoLogin(this.code, e.mp.detail)
                .then(() => {
                    this.$emit('authed')
                    this.login = user.isLogin()
                })
                .catch(e => console.error(e))
        }
    }
}
</script>


<style scoped>
.userinfo-button {
    font-size: inherit;
    width: 100%;
    height: 100%;
    line-height: 1em;
    display: block;
    color: inherit;
    position: relative;
    background-color: inherit;
    /*
    border-color: inherit;
    border-width: inherit;
    */
}
.userinfo-button::after{ border: none; }
.userinfo-button text {
    position: absolute;
    width: 100%;
    width: max-content;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>

