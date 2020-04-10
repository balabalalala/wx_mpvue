<template>
<form @click="onclick" report-submit="true" @submit="formSubmit">
<button formType="submit" class="form-button" hover-class="none">
    <div class="tao-list-container">
        <img class="tao-list-banner" src='https://img-ali.xiaohongchun.com.cn/admin/1546589688485322c4820.jpeg'/>
        <ul>
            <li>
                <tao-disclosure v-for="(good, index) in leftGoods" :key="index" :d="good" @showSuccessModal="showSuccessModal" />
            </li>
            <li>
                <tao-disclosure v-for="(good, index) in rightGoods" :key="index" :d="good" @showSuccessModal="showSuccessModal" />
            </li>

        </ul>
        <modal
            v-if="successModal"
            :show-cancel="false"
            :show-confirm="false"
            width="580rpx"
            @maskClick="successModal=false"
            >
            <div slot="body">
                <image mode="widthFix" class="copy-success-img" :src="currentCopyImage" />
                <div class="copy-success-content">
                    <p class="content-title">已成功复制{{tbkRemind.tkl_mark}} {{hadCoupon ? '(内含优惠券)' :''}}</p>
                    <p class="content-desc">马上打开{{tbkRemind.tbm_mark}}，即可轻松购买！</p>
                </div>
                <div data-name="close-copy-modal" @click="closeCopyModal" class="copy-close">确定</div>
            </div>
        </modal>
        <to-index/>
    </div>

</button>
</form>
</template>

<script>
import mixin from "@/mixin/mixin"
import fly from "@/lib/http"
import utils from "@/lib/util"
import embed from "@/lib/data_embedding"
import TaoDisclosure from "@/components/tao_disclosure/tao_disclosure"
import toIndex from '@/components/common/to_index'

import { createNamespacedHelpers } from 'vuex'
const { mapState, } = createNamespacedHelpers('disclosure')


let pageMark = 0
let noneGoods = false

export default {
    mixins: [mixin],
    data() {
        return {
            leftGoods: [],
            rightGoods: [],
            successModal: false,
            currentCopyImage: '',
            hadCoupon: false,
        }
    },

    computed: {
        ...mapState(['tbkRemind'])
    },

    components: {
        TaoDisclosure,
        toIndex
    },

    mounted () {
        this.getGoodsList()
    },

    methods: {
        async getGoodsList () {
            let res = await fly.get(`/lsj/v3/tao_goods?page_mark=${pageMark}`)
            res = res.data
            if(res.result.length < 20) noneGoods = true
            this.resetTaoGoods(res.result)
            pageMark = res.page_mark
        },
        resetTaoGoods (goods) {
            let newFirstArr = goods.filter((item ,index) => index % 2 === 0)
            let newLastArr = goods.filter((item ,index) => index % 2 !== 0)
            this.leftGoods = this.leftGoods.concat(newFirstArr)
            this.rightGoods = this.rightGoods.concat(newLastArr)
        },
        showSuccessModal (obj) {
            this.currentCopyImage = obj.img
            this.hadCoupon = obj.hadCoupon
            this.successModal = true
        },
        closeCopyModal () {
            this.successModal = false
        }
    },

    onReachBottom () {
        if (noneGoods)  return
        this.getGoodsList(pageMark)
    },

    onShareAppMessage() {
        const shareCode = utils.uuid()
        embed.reportShareIncrement({
            type: "taoDisclosureList",
            share_code: shareCode
        })
        return {
            title: this.tbkRemind.tb_mark + '挑花眼？资深编辑推荐，帮你在好店用好价买好东西！',
            path: `pages/tao_disclosure_list/main?share_code=${shareCode}`
        };
    }

}
</script>

<style src="@/style/form.css"></style>
<style scoped>
    .tao-list-container {
        position: relative;
        z-index: 10;
    }
    .tao-list-banner {
        display: block;
        width: 100%;
        height: 350rpx;
    }
    .tao-list-container ul {
        display: flex;
        flex-direction: row;
        padding: 22rpx 20rpx;
        background-color: #F1F1F1;
        overflow: hidden;
    }
    .tao-list-container ul li {
        display: flex;
        flex-direction: column;
        width: calc(100%/2);
    }
    .tao-list-container ul li:first-of-type {
        margin-right: 20rpx;
    }
    .copy-success-img {
        display: block;
        width: 100%;
        border-radius: 20rpx;
    }
    .copy-success-content {
        width: 455rpx;
        margin: 0 auto 36rpx auto;
        padding: 49rpx 0 47rpx 0;
        border-bottom: 1rpx solid #EFEFEF;
        text-align: center;
    }
    .copy-success-content .content-title {
        line-height: 1;
        font-size: 28rpx;
        font-weight: bold;
        color: rgba(26,26,26,1);
    }
    .copy-success-content .content-desc {
        margin-top: 17rpx;
        line-height: 1;
        font-size: 24rpx;
        color: rgba(26,26,26,1);
    }
    .copy-close {
        margin-bottom: 20rpx;
        line-height: 1;
        font-size: 30rpx;
        font-weight: bold;
        color: #dc3538;
    }
</style>
