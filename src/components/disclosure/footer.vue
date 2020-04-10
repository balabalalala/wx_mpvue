<template>
<div class="placeholder">
    <footer>
        <button data-name="collect" @click="authAction('collect')" :style="{backgroundImage: collectImg}" class="icon-btn">{{disclosure.collect_count || '收藏'}}</button>
        <!-- <button data-name="foot_share" :style="{backgroundImage: icons.share}" class="icon-btn" open-type="share">分享</button> -->
        <button data-name="foot_comment" @click="toCommentList" :style="{backgroundImage: icons.comment}" class="icon-btn comment-btn">{{comment_show.total || '0'}}</button>
        <share-button v-if="shareBtn" @click="AddShareCode" data-name="goods_share" btn-class="share-button" @error="on_error" type=2 size="40" :product="product"/>
        <p v-if="shareBtn" class="share-word">推荐好物</p>
        <div class="buy-btns">
            <!--  当显示一键代下单及去电商购买时，一键代下单在左，去电商购买在右  -->
            <template v-if="fragment.show_self_buy && fragment.buy_btn_name == 'buy' && fragment.buy_btn_class != 'disabled'">
                <button :data-name="fragment.buy_btn_name" @click="authAction('buyerBuy')"  class="buyer-buy" :data-text="fragment.buy_btn_text" />
                <button v-if="!isOpenApp && audit_switch.prop_value == '1'" data-name="self_buy" @click="authAction('selfBuy')" class='self-buy' :data-text="selfBuyText"  />
                <button v-if="isOpenApp" data-name="self_buy" open-type="launchApp" :app-parameter="openAppParams" @error="launchAppError" class='self-buy' :data-text="selfBuyText"  /> 
            </template>
            <template v-else>
                <!-- 当: 展示'去电商购买'按钮 并且 '一键代下单'为灰色时(disabled) 将此按钮隐藏 -->
                <button :data-name="fragment.buy_btn_name" @click="authAction('buyerBuy')" v-if="!fragment.show_self_buy || fragment.buy_btn_class != 'disabled'" class="buyer-buy" :class="btnClass" :data-text="fragment.buy_btn_text" />
                <button data-name="self_buy" @click="authAction('selfBuy')" v-if="audit_switch.prop_value == '1' && fragment.show_self_buy && !isOpenApp" class="self-buy" :data-text="selfBuyText" />
                <button data-name="self_buy" open-type="launchApp" :app-parameter="openAppParams" @error="launchAppError" v-if="fragment.show_self_buy && isOpenApp" class="self-buy" :data-text="selfBuyText" /> 
            </template>
        </div>
    </footer>
</div>
</template>

<script>
import _ from 'underscore'
import icons from '@/pages/disclosure/icons'
import jump from '@/common/lib/jump'
import user from '@/lib/user'
import fly from "@/lib/http"
import mixin from "@/mixin/mixin"
import embed from '@/lib/data_embedding'
import utils from "@/lib/util"

import { mapMutations as globalMapMutations, createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('disclosure')

export default {
    data() {
        return {
            icons: {
                share: icons.bg('share'),
                friendsCircle: icons.bg('friendsCircle'),
                comment: icons.bg('comment')
            },
            product:{},
            shareBtn:false
        }
    },
    mixins: [mixin],
    computed: {
        ...mapState({
            disclosure: state => _.pick(state.disclosure, 'collect_count', 'id', 'fanli_url', 'tkl_url', 'seckill', 'starttime_for_buyable'),
            user: state => _.pick(state.user, 'id', 'collected'),
            fragment: state => state.fragment,
            hasSub: state => _.result(state.subscribe_list.disclosure ? state.subscribe_list.disclosure[0] : [], 'result', false), // 是否已订阅该商品
            subscribe_disclosure: state => (state.subscribe_list.disclosure && state.subscribe_list.disclosure[0]) ? state.subscribe_list.disclosure[0] : [],
            audit_switch: state => _.pick(state.audit_switch, 'prop_value'),
            comment_show: state => _.pick(state.comment_show, 'total')
        }),
        btnClass () {
            //秒杀商品 已经开始 会员展示会员颜色 普通展示红色 没有开始一律展示黄色
            let seckill = this.disclosure.seckill
            let className = this.fragment.buy_btn_class
            let startSeckill = Date.now() - this.disclosure.starttime_for_buyable > 0
            if(seckill && className && className != 'disabled' && !startSeckill) {
                return 'second-kill'
            } else if (seckill && !className) {
                return 'red-btn'
            } else {
                return this.fragment.buy_btn_class
            }
        },
        collectImg() {
            return this.user.collected ? icons.bg('collected') : icons.bg('collect')
        },
        selfBuyText () {
            if(this.audit_switch.prop_value == '1'){
                return this.fragment.url_status ? '去电商购买' : '直达链接'
            }else {
                return '去电商购买'
            }
            
        },
        // 是否打开app
        isOpenApp () {
             const appInstallStatus = this.$store.state.appInstallStatus
             const scene = wx.getStorageSync('scene')
             return ! (this.disclosure.fanli_url && (this.disclosure.fanli_url.indexOf('union-click.jd.com') != -1 || this.disclosure.fanli_url.indexOf('u.jd.com') != -1))
                 && scene == 1036  && appInstallStatus
        },
        openAppParams () {
             const shareCode = getApp().globalData.share_code             
             return 'tt://xiaohongchun/params?disclosureDetail&did=' + this.disclosure.id + (shareCode ? `&share_code=${shareCode}` : '')
        },
        // 是否显示订阅按钮
        isSub() {
            return this.fragment.buy_btn_class == 'subscribe'
        }
    },
    methods: {
        ...mapActions(['collect', 'subscribe', 'unSubscribe']),
        ...globalMapMutations(['toggleAuth','setAuthName']),
        ...mapMutations(['showModal']),
        poster() {
            jump.navigateTo('share_friends', {id: this.disclosure.id})
        },
        toCommentList() {
            jump.navigateTo('comment_list', { id: this.disclosure.id, eType: 1 })
        },
        authAction(method) {
            if(!user.isLogin()) {
                this.setAuthName(method)
                return this.toggleAuth()
            }
            this[method]()
        },
        selfBuy() {
            // 跳转京东开普勒
            if(this.disclosure.fanli_url && (this.disclosure.fanli_url.indexOf('union-click.jd.com') != -1 || this.disclosure.fanli_url.indexOf('u.jd.com') != -1) ) {
                var _that = this
                wx.navigateToMiniProgram({
                    appId: 'wx1edf489cb248852c',
                    path: 'pages/proxy/union/union?spreadUrl=' + encodeURIComponent(this.disclosure.fanli_url),
                    extraData: {},
                    success(res) {
                        _that.sendTrackReq({ fun: 'onjump', jump_to: 'jdhwj' })
                    },
                    fail(res) {
                        if(_that.fragment.link_modal_key.indexOf('copy') !== -1) {
                            jump.navigateTo('web_view', {
                                url: '/mall_link?link='+ encodeURIComponent(this.disclosure.tkl_link || this.disclosure.fanli_url),
                                notShare: true,
                                webPage: true,
                            })
                        }else {
                            _that.showModal(_that.fragment.link_modal_key)
                        }
                    }
                })
            } else {
                if(this.audit_switch.prop_value == '1') {
                    if(this.fragment.link_modal_key.indexOf('copy') !== -1) {
                        jump.navigateTo('web_view', {
                            url: '/mall_link?link='+ encodeURIComponent(this.disclosure.tkl_link || this.disclosure.fanli_url),
                            notShare: true,
                            webPage: true,
                        })
                    }else {
                        this.showModal(this.fragment.link_modal_key)
                    }
                }else{
                    this.showModal('copy_link_buyer')
                }
            }
        },
        buyerBuy() {
            if(this.isSub) {
                return this.hasSub ? this.unSubscribe(this.subscribe_disclosure) : this.subscribe(this.subscribe_disclosure)
            }
            this.showModal(this.fragment.buyer_modal_key)
        },
        launchAppError(e) {
            if(this.fragment.link_modal_key.indexOf('copy') !== -1) {
                jump.navigateTo('web_view', {
                    url: '/mall_link?link='+ encodeURIComponent(this.disclosure.tkl_link || this.disclosure.fanli_url),
                    notShare: true,
                    webPage: true,
                })
            }else {
                this.showModal(this.fragment.link_modal_key)
            }
        },
        // 好物圈分享
        async goodPriceShare () {
            let disclosureInfo
            let resp = await fly.get('/lsj/v3/weixin/query_goods?dids='+ this.disclosure.id)
            resp = resp.data
            disclosureInfo = JSON.parse(resp.result).product_list
            this.product = _.clone(disclosureInfo[0])
            if(this.product){
                this.shareBtn = true
            } else {
                this.shareBtn = false
            }
            let _that = this
            wx.getSystemInfo({
                success: function(res) {
                    console.log(res)
                    if (res.version < '7.0.3') {
                        _that.shareBtn = false
                    }
                },
                failure() {
                }
            })
        },
        AddShareCode() {
            const shareCode = utils.uuid(), id = this.disclosure.id
            const helpParams = {
                share_code: shareCode,
            };
            embed.reportShareIncrement({
                share_code: shareCode,
                type: 'goods_circle_rec',
                entity_id: id,
            }) 
            this.product.src_mini_program_path =  this.product.src_wxapp_path+'&' + shareCode
        },
    },
    mounted () {
        this.goodPriceShare()
    },
}
</script>

<style>
.share-button {
    position: absolute;
    left: 212rpx;
    top: -5rpx;
    display: inline-block;
    min-width: 2.2em;
    height: 95rpx;
    font-size: 12px;
    padding: 0;
    border: none;
    background-color: transparent;
    background-position: center 10rpx;
    background-repeat: no-repeat;
    background-size: 52rpx, 52rpx;
    color: #4c4c4c;
    padding-top: 0rpx;

}
.button--btn-type-2 .button--btn-navigator__hover {
    background-color: transparent;
}
</style>

<style scoped>
.share-word {
    position: absolute;
    left: 200rpx;
    top:60rpx;
    font-size: 20rpx;
    color: #4c4c4c;
}
.placeholder {
    height: 100rpx;
}

.ipx .placeholder {
    height: 160rpx;
}

footer {
    position: fixed;
    z-index: 3;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100rpx;
    padding-left: 40rpx;
    background-color: #fff;
    border-top: 1px solid #f1f1f1;
}

.ipx footer {
    border-bottom: 60rpx solid #fff;
}

footer > button {
    margin-right: 45rpx;
}

footer .comment-btn {
    margin-right: 46rpx;
    /* margin-right: 0; */
}

.buy-btns {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
}

.self-buy {
    background:#DC3538;
}

.buyer-buy {
   background:linear-gradient(45deg,rgba(251,126,92,1),rgba(255,189,133,1));
}

.buy-btns button {
    display: inline-block;
    color: #fefefe;
    width: 220rpx;
    height: 100%;
    border-radius: 0;
    font-size: 30rpx;
    position: relative;
}

.buy-btns button::before {
    content: attr(data-text);
    width: fit-content;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: pre-wrap;
    line-height: 1.2;
}

.disabled {
    background: #a8a8a8;
}

.buy-btns .member {
    background: linear-gradient(45deg, #000, #4c4c4c);
    color: #ECBF86;
}

.buy-btns .subscribe {
    background: linear-gradient(45deg, #FF9F3D, #FFBD2E);
}

.buy-btns .second-kill {
    background: #ffc447;
}
.buy-btns .red-btn {
    background:#DC3538;
}
</style>