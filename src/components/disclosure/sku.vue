<template>
<div @click="hideModal" class="mask">
    <div @click.stop class="container against-bottom">
        <img class="preview" :src="disclosure.img">

        <i class="close" @click="hideModal"></i>

        <div class="info">
            <b class="price">¥ {{ price }}</b>

            <div v-if="selectedNote" class="selected-spec">已选：{{ selectedNote }}</div>
        </div>

        <ul v-if="specs" class="specs">
            <li v-for="(spec, index) in specs" :key="index">
                {{ spec.sku_desc }}

                <ul>
                    <li
                        v-for="(item, itemIndex) in spec.sku_item"
                        @click="select(item, index)"
                        :class="{disabled: !item.enable, selected: item.selected}"
                        class="spec-item"
                        :key="item.sku_id">{{ item.sku_text }}</li>
                </ul>
            </li>
        </ul>

        <div class="count">
            购买数量
            <b v-if="orderLimit == -1 && limit != -1">{{ limit ? '每人限购' + limit + '件' : '此商品您已不能再购买' }}</b>
            <b v-if="limit == -1 && orderLimit != -1">{{ orderLimit ? '每单限购' + orderLimit + '件' : '' }}</b>
            <b v-if="limit != -1 && orderLimit != -1 && limit == orderLimit">{{ '每人限购' + limit + '件' }}</b>
            <b v-if="limit != -1 && orderLimit != -1 && limit != orderLimit">{{limit < orderLimit ? '每人限购' + limit + '件' : '每单限购' + orderLimit + '件'  }}</b>
            <div class="counter">
                <button @click="reduce">-</button>
                <span>{{ num }}</span>
                <button @click="add">+</button>
            </div>
        </div>

        <button @click="confirm" class="confirm">确认</button>
    </div>
</div>
</template>

<script>
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
import jump from '@/common/lib/jump'

const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('disclosure')
const cannotBuy = '由于已经达到限购数量，此商品您已不能再购买'

export default {
    data() {
        return {
            num: 1
        }
    },
    computed: {
        ...mapState({
            disclosure: state => {
                const d = state.disclosure
                const imgs = d.goods_imgs || []

                return {
                    price: d.price / 100,
                    img: imgs[0],
                    stock: d.stock,
                }
            },
            specs: state => state.specs,
            limit: state => state.disclosure.limit,
            orderLimit: state => state.disclosure.order_limit,
        }),

        selectedNote() {
            return this.selected.map(sku => sku.sku_text).join('，')
        },

        // 已选中的规格
        selected() {
            return _.chain(this.specs)
                .map(spec => spec.sku_item)
                .flatten()
                .filter(sku => sku.selected)
                .value()
        },

        price() {
            if(_.isEmpty(this.specs)) {
                return this.disclosure.price
            }

            // 如果没有规格信息，或者未选择规格，显示disclosure的price字段，否则显示规格的价格
            const sku = this.specs[0].sku_item.find(spec => spec.selected)
            return sku ? sku.price / 100 : this.disclosure.price
        }
    },

    methods: {
        ...mapMutations(['showModal', 'hideModal']),
        ...mapMutations({toggle: 'toggleSpectSelect'}),
        ...mapActions(['validStock', 'addOrder', 'match']),
        select(item, index) {
            if(!item.enable) {
                return
            }

            this.toggle({id: item.sku_id, index})
        },

        add() {
            if(this.limit == 0) {
                return this.$root.toast(cannotBuy)
            }

            if(this.num == this.limit && this.limit < this.orderLimit) {
                return this.$root.toast(`此商品每人限购${this.limit}件`)
            }

            if(this.num == this.orderLimit && this.orderLimit < this.limit) {
                return this.$root.toast(`此商品每单限购${this.orderLimit}件`)
            }

            if(this.num == this.limit) {
                return this.$root.toast(`此商品每人限购${this.limit}件`)
            }

            if(this.num == this.orderLimit) {
                return this.$root.toast(`此商品每单限购${this.orderLimit}件`)
            }

            this.num++
        },

        reduce() {
            if(this.num == 1) {
                return this.$root.toast('购买数量不能小于1')
            }

            this.num--
        },

        async polling(sn) {
            const resp = await this.match(sn)

            if(resp.status == 2) {
                this.hideModal()
                wx.hideLoading()
                return jump.navigateTo('order_confirm', {sn})
            }

            setTimeout(() => this.polling(sn), 1e3)
        },

        async confirm() {
            if(this.limit == 0) {
                return this.$root.toast(cannotBuy)
            }

            // 查询第一个未选择的规格，作提示用
            const spec = this.specs.find(spec => spec.sku_item.every(sku => !sku.selected))
            if(spec) {
                return this.$root.toast(`${spec.sku_desc} 还没有选哦`)
            }

            wx.showLoading({
                title: '加载中',
                mask: true
            })

            // 限库存
            if(this.disclosure.stock) {
                const pass = await this.validStock({
                    skuIds: this.selected.map(sku => sku.sku_id).join(','),
                    count: this.num
                })

                if(!pass) {
                    wx.hideLoading()

                    return wx.showModal({
                        title: '天天跟我买',
                        content: '商品抢光啦，下次早点来抢！',
                        showCancel: false
                    })
                }
            }
            
            // 添加订单
            const resp = await this.addOrder({
                count: this.num,
                selected: this.selected
            }).catch(e => wx.hideLoading())

            if(resp.msg) {
                this.hideModal()
                wx.hideLoading()
                return this.$root.toast(resp.msg)
            }

            resp.sn && this.polling(resp.sn)
        }
    }
}
</script>

<style scoped>
.container {
    background: white;
}

.ipx .container {
    padding-bottom: 60rpx;
}

.preview {
    width: 200rpx;
    height: 200rpx;
    border: 1px solid #f1f1f1;
    margin: -40rpx 40rpx 0 30rpx;
}

.close {
    position: absolute;
    top: 40rpx;
    right: 30rpx;
    width: 32rpx;
    height: 32rpx;
    background: url(https://img-ali.xiaohongchun.com.cn/program-inline-images/closebutton.gif) 0 0 no-repeat;
    background-size: contain;
}

.info {
    display: inline-block;
    vertical-align: top;
    padding-top: 40rpx;
    max-width: 55%;
}

.price {
    color: #dc3538;
    font-size: 32rpx;
}

.selected-spec {
    font-size: 26rpx;
    color: #636363;
    margin-top: 20rpx;
    line-height: 1.3;    
}

.specs {
    margin: 50rpx 30rpx 0;
    max-height: 400rpx;
    overflow-y: auto;
}

.specs > li {
    font-size: 24rpx;
    line-height: 1;
    color: #4e4e4e;
    margin-bottom: 50rpx;
}

.spec-item {
    display: inline-block;
    line-height: 50rpx;
    padding: 0 40rpx;
    font-size: 24rpx;
    background-color: #f1f1f1;
    color: #1a1a1a;
    margin: 20rpx 30rpx 0 0;
}

.disabled {
    color: #ccc;
}

.selected {
    background:#dc3538;
    color: #fff;
}

.count {
    line-height: 50rpx;
    overflow: hidden;
    padding: 30rpx 40rpx;
    font-size: 28rpx;
}

.count b {
    font-size: 24rpx;
    color:#dc3538;
    display: inline;
}

.counter {
    float: right;
}

.counter button, .counter span {
    display: inline-block;
    height: 50rpx;
    line-height: 45rpx;
    text-align: center;
    background-color: #f1f1f1;
    vertical-align: middle;
    margin-left: 4rpx;
}

.counter span {
    width: 130rpx;
    text-align: center;
    color: #595959;
    line-height: 50rpx;
}

.counter button {
    width: 55rpx;
    border-radius: 0;
    padding: 0;
}

.confirm {
    line-height: 100rpx;
    background:#dc3538;
    border-radius: 0;
    font-size: 30rpx;
    color: white;
    font-weight: bold;
}
</style>