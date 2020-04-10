<template>
    <div class="my-foot-print">
        <alert-box v-if="alertShow" @leftHandle="leftHandle" @rightHandle="rightHandle" :alertConfig="alertConfig"></alert-box>
        <div class="disclosure-list" v-if="footPrintList.length > 0">
            <div class="good-info" v-for="item in goodConfig" :key="item">
                <goods-item 
                    :data-track_info="item.track_info"
                    @toGo="toGoHandle(item, $event)"
                    @centerIcon="centerIconHandle(item.did)"
                    :toGo="item.toGo"
                    :goodsImg="item.goodsImg"
                    :expire="item.buy_status ? false : true"
                    :icon="item.icon"
                    :title="item.title"
                    :keynote="item.keynote"
                    :secondary="item.secondary"
                    :bottomSecondary="item.bottomSecondary"
                    :centerIcon="item.centerIcon"
                    :valuePercentage="item.value_percentage"
                    :commentCount="item.comment_count"
                    ></goods-item>
            </div>
        </div>
        <!-- 无数据 -->
        <div v-else class="no-data">
            <img src="https://img-ali.xiaohongchun.com.cn/admin/157059085395738f22d76.png">
        </div>
        <loading v-if="needLoad"></loading>
    </div>
</template>

<script>
    import fly from "@/lib/http"
    import util from "@/lib/util"
    import mixin from "@/mixin/mixin"
    import Loading from "@/components/common/loading"
    import AlertBox from "@/components/common/alert_box"
    import GoodsItem from "@/components/common/goods_item"
    import jump from "@/common/lib/jump"
    import pages from '@/lib/pages_config'
    export default {
        mixins: [mixin],
        data() {
            return {
                needLoad: false,
                pageMark: 0,
                footPrintList: [],
                text: "还没有逛过跟我买哦|去首页看看吧",
                goodConfig: [],
                currentId: '',
                alertShow: false,
                alertConfig: {
                    title: '天天跟我买',
                    content: '是否删除这条记录',
                    leftBtnText: '取消',
                    rightBtnText: '确定'
                }
            }
        },
        components: {Loading, GoodsItem, AlertBox},
        methods: {
            //处理数据
            dealJson(detailList) {
                let list = detailList.map(item=>{
                    item.toGo = true
                    item.goodsImg = item.image_url
                    item.expire = (item.status === -1) ? true : false
                    item.icon = (item.status !==  -1 && (item.iconSign || item.icon_sign)) ? true : false
                    item.title = item.title || ""
                    item.keynote = item.v_detail || item.deal_price || ""
                    item.secondary = item.editor_rec_desc
                    item.bottomSecondary = item.mall + " 发货"
                    item.centerIcon = true
                    return item
                })

                return list
            },
            async fetchFootPrintList() {
                this.needLoad = true
                let resp = await fly.get(`/lsj/v1/user/footprints?page_mark=${this.pageMark}`)
                resp = resp.data
                this.needLoad = false
                if(resp.data && resp.data.length > 0){
                    resp.data = resp.data.map(element => {
                        element.timestamp = util.timeFormat(element.timestamp)
                        return element
                    })
                    this.footPrintList = this.footPrintList.concat(resp.data)
                    this.goodConfig = this.dealJson(this.footPrintList)
                    this.pageMark = resp.page_mark
                }
            },
            toGoHandle(item, event){
                jump.navigateTo('disclosure', {gdid: item.did}, event)
            },
            centerIconHandle(did) {
                this.alertShow = true
                this.currentId = did
            },
            leftHandle() {
                this.alertShow = false
            },
            async rightHandle() {
                this.alertShow = false
                let resp = await fly.delete(`/lsj/v1/user/footprints`,[this.currentId])
                resp = resp.data
                if(resp.code === 0) {
                    this.pageMark = 0
                    this.footPrintList = []
                    this.fetchFootPrintList()
                }


            }
        },
        onLoad() {
            this.fetchFootPrintList()
        },
        onReachBottom() {
            this.fetchFootPrintList()
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data())
        }
    }
</script>

<style scoped>
    .no-data {
        margin-left: 148rpx;
        margin-top: 255rpx;
        width: 460rpx;
        height: 460rpx;
    }
    img {
        width: 460rpx;
        height: 460rpx;
    }
    .disclosure-list{
        padding-top: 40rpx;
    }
    .no-disclosure{
        background-color: #f9f9f9;
        height: 100%;
    }
    .good-info{
        width: 750rpx;
        height: 276rpx;
        border-top: 20rpx solid #f2f2f2;
    }
</style>

