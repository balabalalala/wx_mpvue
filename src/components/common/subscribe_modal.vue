<template>
    <modal v-if="showAPPAlert"
        :show-cancel="false"
        :show-confirm="false"
        @maskClick="hideModal"
        width="580rpx"
        >
        <div slot="body" class="focus-modal">
            <p class="remind-title">下载APP才能收到订阅通知</p>
            <p>想不错过任何好价，快去下载吧</p>
            <img class="focus-img" src="https://img-ali.xiaohongchun.com.cn/admin/1551254597006c5de6c.gif" />
            <button
                open-type="contact"
                @click="showFocus=false"
                session-from="sign_earn_coin"
                slot="footer"
                class="focus-to-follow"
                send-message-title="点击下方消息下载App"
                :send-message-path="contactMsgPath"
                send-message-img="https://img-ali.xiaohongchun.com.cn/admin/15509095856652608cf5b.png"
                show-message-card="true"
                data-name="to_download_app"
                >马上下载
            </button>
        </div>
    </modal>

    <modal v-else-if="showInfoAlert" title="您已成功订阅。" align="left" :pre="false" @confirm="hideModal">
        <p slot="body">当订阅的商品/分类/好价发布时，会通过天天跟我买APP推送给您。</p>
    </modal>
</template>

<script>
import fly from "@/lib/http"
export default {
    props: {
        //外部控制键
        showModal: {
            type: Boolean,
            default: false
        },
        
    },
    data () {
        return {
            install: false
        }
    },
    computed: {
        showAPPAlert () {
            return this.showModal && !this.install
        }, 
        showInfoAlert () {
            return this.showModal && this.install
        }, 
    },
    methods: {
        hideModal() {
            this.showModal = false
            this.$emit("hideSubscribeAlert")
        }
    },
    mounted () {
        fly.get('/lsj/v3/user/is_download').then(resp => {
            this.install = (resp.data && resp.data == 2)
            this.$store.commit('setAppInstallStatus', this.install)
        })
        // this.install = (resp.data && resp.data == 2)
    }
}
</script>
<style scoped src="@/components/subcribe/subcribe_focus.css"></style>
<style scoped>
.bolder {
    font-weight: bolder;
    text-align: center;
}
</style>