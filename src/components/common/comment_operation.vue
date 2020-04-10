<template>
<div @click="hideModal" class="mask">
    <div @click.stop class="container against-bottom">
        <div class="operation-content">
            {{ operationNick}}：{{ operationContent}}
        </div>
        <ul v-if="operationList" class="op-list">
            <li :data-name="operationItem.op" @click="operation(operationItem)" v-for="(operationItem, index) in operationList" :key="index">
                {{ operationItem.text}}
            </li>
            <li data-name="comment_handle_cancel" @click="hideModal">取消</li>
        </ul>
    </div>
</div>
</template>

<script>
import _ from 'underscore'
import fly from "@/lib/http"
import { createNamespacedHelpers } from 'vuex'
import jump from '@/common/lib/jump'

const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('disclosure')

export default {
    props : {
		operationContent: {
            type: String,
            default: ""
        },
        operationNick: {
            type: String,
            default: ""
        },
        operationList: {
            type: Array,
            default: []
        },
        operationId: {
            type: Number,
            default: 0
        },
        operationParentId: {
            type: Number,
            default: 0
        },
        
    },
    data() {
        return {
           
        }
    },
    

    methods: {
        ...mapMutations(['showModal',]),
        hideModal() {
            this.$emit('close')
        },
        async operation(item) {            
            if(item.op == 'delete'){
                let _that = this
                await fly.delete(`/lsj/v3/comment/${this.operationId}`).then(() => {
                        this.$emit('close')
                        this.$emit('deleteCallback', {operationId: this.operationId, operationParentId: this.operationParentId})
                        return wx.showToast({
                            title: '删除成功',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                )
            }
            if(item.op == 'complaint'){
                this.operationList = [
                    {op: 'complaintItem', text: '违法信息', type: 1 },
                    {op: 'complaintItem', text: '营销广告', type: 2 },
                    {op: 'complaintItem', text: '人身攻击', type: 3 },
                    {op: 'complaintItem', text: '其他理由', type: 4 },
                ]                
            }
            if(item.op == 'complaintItem'){                
                await fly.post('/lsj/v3/comment/expose_comment', {
                    cid: this.operationId,
                    type: item.type
                }).then(() => {
                        this.$emit('close')
                        return wx.showToast({
                            title: '举报成功',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                )
            }
        }

    }
}
</script>

<style scoped>
.container {
    background: white;
    padding:69rpx 76rpx 36rpx 59rpx;
    font-size:28rpx;
    z-index: 999;
}
.ipx .container {
    padding-bottom: 60rpx;
    z-index: 999;
}
.operation-content {
    text-align:center;
    line-height:44rpx;
    color:#808080;
    margin-bottom:76rpx;
}
.op-list {
    text-align: center;
}
.op-list li {
    margin-bottom: 42rpx;
}
</style>