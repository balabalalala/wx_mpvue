<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="phone-container">
                <image class="image-bg" mode="widthFix" src="https://img-ali.xiaohongchun.com.cn/admin/1564455648539be56888.png" />
                <button class="phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机号</button>
                <div class="ignore-btn" @click="backBtn">跳过</div>
            </div>
            <!-- 绑定失败弹窗 -->
            <div class="fail-container" v-if="showFailMask">
                <div class="mask" @click="showFailMask = false"></div>
                <div class="fail-content">
                    <div class="text"><p>绑定失败<br>此手机号码已绑定其他账号</p></div>
                    <img 
                        class="close-icon" 
                        src="https://img-ali.xiaohongchun.com.cn/admin/156387152796129bb5b04.png"
                        @click.stop="showFailMask = false" />
                </div>
            </div>
        </button>
    </form>
</template>

<script>
import fly from "@/lib/http"
import user from "@/lib/user"
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            showFailMask: false
        }
    },
    mounted () {
        this.setJumpStatus()
    },
    methods: {
        ...mapMutations(['setJumpStatus']),
        async getPhoneNumber(e) {
            e = e.mp
            let res = await fly.post('/lsj/v3/register/edit_phone', {
                encrypted_data: e.detail.encryptedData,
                iv_str: e.detail.iv
            })
            res = res.data.result
            // 1已注册
            if(res.status == 1) this.showFailMask = true
            if(res.status == 0) this.backBtn()
        },
        backBtn() {
            this.wx.navigateBack({delta: 1})
        }
    }
}
</script>

<style src="@/style/form.css"></style>
<style scoped>
.phone-container {
    width: 100%;
    height: 100vh;
    background-color: #F6F6F7;
    position: relative;
    z-index: 6;
}
.phone-btn {
    position: absolute;
    bottom: 187rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 570rpx;
    height: 90rpx;
    padding: 0;
    background:rgba(0,0,0,1);
    font-size: 30rpx;
    font-weight:500;
    color:rgba(255,255,255,1);
    text-align: center;
    line-height: 90rpx;
    border-radius: 0;
}
.ignore-btn {
    position: absolute;
    bottom: 123rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 570rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 500;
    color:rgba(0,0,0,1);
}
.fail-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
}
.fail-container .mask {
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
}
.fail-content {
    position: absolute;
    top: 50%;
    left: 1.1rem;
    right: 1.1rem;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
}
.fail-content .text {
    width: 100%;
    height: 2.22rem;
    background-color: #fff;
    font-size: 0.26rem;
    font-weight: bold;
    color:rgba(34,34,34,1);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
.fail-container .text p {
    line-height: 0.38rem;
}
.close-icon {
    margin-top: 0.52rem;
    width: 0.64rem;
    height: 0.64rem;
}
.image-bg {
    width: 100%;
}
</style>
