<template>
    <form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div :class="(commonListData.share && commonListData.member) ? 'container-m' : 'container'">

                <p v-if="!(commonListData.share && commonListData.member)" class="top-tip">{{(commonListData.member && !commonListData.conf) ? '根据您开通会员期间的消费记录计算':'根据天天跟我买年卡会员的平均年消费计算'}}</p>

                <!--会员 分享 除外-->
                <div v-if="!(commonListData.share && commonListData.member)" class="container-cal-normal">
                    <p class="top-tip-cal">{{(commonListData.member && !commonListData.conf) ? '开通会员期间已为您节省':'开通年卡会员 平均可省'}}</p>
                    <div class="price-display">
                        <div class="child-one"> <p class="price-money">¥{{totalPrice}}/年</p></div>
                        <div class="child-two"> <p class="price-equal">相当于</p></div>
                        <div class="child-three"> <img class="price-img" :src="commonListData.img"/></div>
                    </div>
                    <div class="container-share" v-if="!commonListData.share">
                        <button v-if="commonListData.member && !commonListData.conf" class="share-img-m" style="width: 280rpx;height: 74rpx;" open-type="share" data-name="calculator_member_share"></button>
                        <button v-else class="share-img" style="width: 280rpx;height: 74rpx;" open-type="share" data-name="calculator_share"></button>
                    </div>
                    <div style="height:20rpx;background-color: white;"></div>
                </div>
                <div v-else class="container-cal-unnormal">
                    <div class="user-container">
                        <img class="icon-user" :src="commonListData.icon ? commonListData.icon : 'https://img-ali.xiaohongchun.com.cn/admin/15354505783773a3e40a3.png'" />
                        <p class="title-ueser">省钱这种好事，我只告诉你</p>
                        <p v-if="commonListData.nick" class="user-name">{{commonListData.nick}}</p>
                    </div>
                    <div>
                        <img class="member-container" src="https://img-ali.xiaohongchun.com.cn/admin/154864115190616d16242.png"/>
                        <p class="member-price">¥{{totalPrice}}</p>
                        <div class="member-img"><img class="price-img" :src="commonListData.img"/></div>
                    </div>
                    <div class="member-list">
                        <img class="member-header" src="https://img-ali.xiaohongchun.com.cn/admin/1548728634243226f7098.png"/>
                    </div>
                </div>

                <!-- 省钱信息模块 -->
                <div v-if="commonListData" :class="(commonListData.share && commonListData.member) ? 'calculator-list-m' : 'calculator-list'">
                    <div v-if="commonListData.economize" class="calculator-item">
                        <div class="list-title">购物消费</div>
                        <div class="list-intro">全是好价，多买多省</div>
                        <div class="list-price">¥{{economizePrice}}</div>
                    </div>
                    <div v-if="commonListData.service_charge" class="calculator-item">
                        <div class="list-title">代买费</div>
                        <div class="list-intro">节省每单金额3%的代买服务费</div>
                        <div class="list-price">¥{{serviceChargePrice}}</div>
                    </div>
                    <div v-if="commonListData.free_card" class="calculator-item">
                        <div class="list-title">亲友体验卡</div>
                        <div class="list-intro">开通赠送3张价值123的亲友体验卡</div>
                        <div class="list-price">¥{{freeCardPrice}}</div>
                    </div>
                    <div v-if="commonListData.subsidy" class="calculator-item">
                        <div class="list-title">补贴差价</div>
                        <div class="list-intro">商品涨价 平台补贴</div>
                        <div class="list-price">¥{{subsidyPrice}}</div>
                    </div>
                    <div v-if="commonListData.economize_member" class="calculator-item" style="border-bottom:none">
                        <div class="list-title">各大电商会员卡</div>
                        <div class="list-intro">省下京东、亚马逊等多家电商会员卡费</div>
                        <div class="list-price">¥{{economizeMemberPrice}}</div>
                    </div>
                </div>
                
                <!--底部悬浮条-->
                <div class="bottom-square">
                    <!--不是会员，源生页面-->
                    <div v-if="!commonListData.member && !commonListData.share" class="gold-bg-btn" style="width:292rpx" @click="toMemberOpen" data-name="openMember">
                        立即开通
                    </div>
                    <!--会员，源生页面-->
                    <div v-if="commonListData.member && !commonListData.share" class="gold-bg-btn" style="width:292rpx" @click="toMemberOpen" data-name="keepMember">
                        立即续费
                    </div>
                    <!--不是会员，分享进来的页面-->
                    <div v-if="!commonListData.member && commonListData.share" class="gold-bg-btn" style="width:380rpx" @click="toMember" data-name="openMemberShare">
                        了解天天会员，聪明省钱
                    </div>
                    <!--会员，分享进来的页面-->
                    <div v-if="commonListData.member && commonListData.share" class="gold-bg-btn" style="width:380rpx" @click="toMember" data-name="openShare">
                        了解天天会员，聪明省钱
                    </div>
                </div>
                <to-index></to-index>
            </div>
        </button>
    </form>
</template>

<style src="./style.css" scoped></style>
<script src="./script.js"></script>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>