<template>
<form report-submit='true' @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <template v-if="items.length">
            <ul>
                <goods-item v-for="item of items" :item="item" :key="item.id"></goods-item>
            </ul>

            <loading v-if="more"></loading>
        </template>
        <!-- 无数据 -->
        <div v-else class="no-collect">
            <img src="https://img-ali.xiaohongchun.com.cn/admin/15705890443421eb115ce.png">
        </div>
    </button>
</form>
</template>

<script>
import qs from 'qs'
import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import Empty from '@/components/common/empty'
import Loading from '@/components/common/loading'
import GoodsItem from '@/components/collection/item'

export default {
    mixins: [mixin],
    data() {
        return {
            items: [], // 当前页面显示的列表
            pageMark: -1, // 分页
        }
    },
    components: {
        GoodsItem, Loading, Empty
    },

    computed: {
        params() {
            return {
                d_type: '', // 旧版 tab 类型 {0: '', 1: 0, 2: 2}  现移除'只选三个'模块 此页面数据不再区分类型
                page_mark: this.pageMark
            }
        },
        // 标识是否还有更多数据, 用来判断是否还需要下拉刷新
        more() {
            return this.pageMark && !(this.items.length % 10)
        }
    },

    methods: {
        async fetch() {
            let resp = await fly.get(`/lsj/v3/collection/list_by_uid?${qs.stringify(this.params)}`).catch(e => console.error(e))
            resp = resp.data

            this.pageMark = resp.page_mark

            if(resp.datas.length) {
                this.items.push(...resp.datas)
            }
        },
    },

    onReachBottom() {
        this.more && this.fetch()
    },

    mounted() {
        this.items = []
        this.pageMark = -1
        this.fetch()
    }
};
</script>
<style scoped>
.no-collect {
    margin-left: 148rpx;
    margin-top: 255rpx;
    width: 460rpx;
    height: 460rpx;
}
img {
    width: 460rpx;
    height: 460rpx;
}
</style>


<style src="@/style/form.css"></style>
