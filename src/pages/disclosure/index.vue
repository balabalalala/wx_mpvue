<template>
    <form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <slide />
            <div class="container" v-if="fetched">
                <second-kill v-if="showSecondKill" /> <info/> <subscribe /> <creator/> 
                <desc-how /> <links v-if="audit_switch.prop_value=='1'" /> 
                <images />
                <desc />
                <related-article :pageTrackInfo="pageTrackInfo" />
                <comment v-if="audit_switch.prop_value=='1'" :id="disclosure.id" :eType="1" :isAll="0" :allowInteraction="true" ref="commentComponent"/>
                <inner-group v-if="audit_switch.prop_value=='1'" /> 
                <recommends v-if="audit_switch.prop_value=='1'" />
                <disclosure-footer v-if="fetched" />
            </div>
            <index />
            <template v-if="fetched">
                <auth /> <toast />
                <float-window :fadeOut="fadeOut" />
                <links-modal v-if="modalKey=='links_modal'" />
                <sku v-if="modalKey=='sku'" />
                <!--
                    由于mpvue的组件slot存在各种各样的问题，用原生的小程序自定义组件实现了modal，但原生组件只能用在mpvue的根页面上，所以，
                    所有的modal弹框集中在此展示
                -->
                <!-- 去电商购买 引导到客服消息  -->
                <modal v-if="modalKey=='copy_link_buyer' || modalKey=='copy_link' || modalKey=='copy_alone_link' || modalKey=='copy_tkl_buyer' || modalKey=='copy_tkl' || copyLinkNote"
                    :show-cancel="false"
                    :show-confirm="false"
                    @maskClick="hideModal"
                    width="580rpx"
                    >
                    <div slot="body" class="focus-modal">
                        <p class="remind-title">如何获取商品链接</p>
                        <p>下载「天天跟我买」App\n一键到达购买链接</p>
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

                <!-- 从app打开根据场景值弹出此弹窗 引导到客服消息入群  -->
                <modal v-if="modalKey=='from_app_alert'"
                    :show-cancel="false"
                    :show-confirm="false"
                    @maskClick="hideModal"
                    width="580rpx"
                    >
                    <div slot="body" class="focus-modal">
                        <p class="remind-title">{{appModalTitle}}</p>
                        <p>点击下方按钮，一键入群</p>
                        <img class="focus-img" src="https://img-ali.xiaohongchun.com.cn/admin/155177009196723b23ab1.gif" />
                        <button
                            open-type="contact"
                            @click="showFocus=false"
                            session-from="disclosure"
                            slot="footer"
                            class="focus-to-follow"
                            send-message-title="点击下方消息入群"
                            :send-message-path="appModalPath"
                            send-message-img="https://img-ali.xiaohongchun.com.cn/admin/1552390735181134628e2.png"
                            show-message-card="true"
                            data-name="app_inner_group"
                            >马上入群
                        </button>
                    </div>
                </modal>
                <!-- 一键代下单 过期 -->
                <modal v-if="modalKey=='buy_disabled'" @confirm="hideModal">
                    <div slot="body" class="modal-content">
                        <div class="modal-header">{{ fragment.buyer_modal_text }}</div>
                    </div>
                </modal>

                <!-- <modal v-if="modalKey=='subscribe_followed'" title="您已成功订阅。" align="left" :pre="false" @confirm="hideModal">
                    <p slot="body">当订阅的商品/分类/好价发布时，会立即通过<span class="bolder">天天跟我买</span>”服务号通知您。现在就去关注吧！</p>
                </modal> -->

                <!-- <modal v-if="modalKey=='subscribe_unfollowed'" @maskClick="hideModal" :show-cancel="false" :show-confirm="false" width="580rpx">
                    <div slot="body" class="focus-modal">
                        <p class="remind-title">关注服务号就能收到订阅消息哦</p>
                        <p>回复数字“2” 即可获取“天天跟我买”</p>
                        <p>服务号二维码</p>
                        <img class="focus-img" src="https://img-ali.xiaohongchun.com.cn/admin/15475393331903778cfd2.PNG" />
                        <button class="focus-to-follow" open-type="contact" @click="hideModal" session-from="disclosure" slot="footer">去关注</button>
                    </div>
                </modal> -->
                <div v-if="modalKey=='not_member'" class="mask">
                    <div>
                        <img @click="toMember" :data-track_info="disclosure.track_info" class="member-modal-image" style="width: 580rpx; height: 763rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/154029202543015825478.png" />
                        <view @click="hideModal" data-name="dis_member" class="member-modal-close">×</view>
                    </div>
                </div>
                <subscribe-modal :showModal="isShowSubscribeAlert" @hideSubscribeAlert="hideSubscribeModal" />
            </template>

        </button>
    </form>
</template>

<script src="./script.js"></script>
<style scoped src="./style.css"></style>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
<style src="@/style/btns.css"></style>
<style src="@/components/subcribe/subcribe_focus.css"></style>

