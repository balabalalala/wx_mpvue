<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="member-center">
                <!-- <img v-if="is618Time" @click="openMember" data-name="618_member_banner" src="https://img-ali.xiaohongchun.com.cn/admin/15585975668742aa4a423.gif" style="width:750rpx;height:170rpx;display:block;"/> -->
                <auth @authed="openMember"/>
                <!-- 会员用户信息-->
                <div v-if="user.member" :class="is618Time ? 'member-user-618' : 'member-user'">
                    <member-info 
                        name="newUserGetMember" 
                        :note="note" 
                        @openMember="openMember" 
                        @toOpenList="toOpenList" 
                        :user="user" 
                        :memberEndTime="memberEndTime" 
                        :restTime="restTime">
                    </member-info>
                </div>
                <img v-if="!user.member" class="member-bgimg" style="height: 138rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/15620687031811c7f6860.png"/>
                <img v-if="user.member && !memberEndTime" class="member-bgimg" style="height: 292rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/156212445528856e34e0.png"/>
                <img v-if="user.member && memberEndTime && user.member_level == 0" class="member-bgimg" style="height: 630rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/156203939430054f92ee.png"/>
                <img v-if="user.member && memberEndTime && user.member_level !== 0" class="member-bgimg" style="height: 292rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/154815429404327284d7c.png"/>
                <p v-if="user.member && memberEndTime && user.economy_money !== '0'" :class="user.member_level == 0 ? 'member-right-tip tip-2' : 'member-right-tip tip-1'" :style="is618Time?'top:396rpx;':''">会员期间，已为您节省 {{'¥'+user.economy_money}}</p>
                <p v-if="user.member && memberEndTime && user.economy_money === '0'" :class="user.member_level == 0 ? 'member-right-tip tip-2' : 'member-right-tip tip-1'" :style="is618Time?'top:396rpx;':''">预计每年可省 {{'¥'+ user.average_save_money}}</p>
                <!-- 闺蜜卡赠送 -->
                <div v-if="user.member_level === 0 && memberEndTime" class="friend-card-area">
                    <p class="friend-card-text">可赠卡数：{{user.gave_count}}</p>
                    <button data-name="friend_card_record_btn" @click="friendCardRecord" class="friend-card-btn btn-1" >查看领取记录</button>
                    <button data-name="friend_card_share_btn" @click="cardShare" class="friend-card-btn btn-2" :class="user.gave_count == 0 ? 'btn-disabled' : ''" >{{user.gave_count > 0 ? '去赠送' : '已送完'}}</button>
                </div>
                <!--  赠送分享蒙层  -->
                <div class="share-mask" v-if="showShareMask" @click="showShareMask = false">
                    <img  src="https://img-ali.xiaohongchun.com.cn/admin/15589569129469eed744.png"/>
                </div>

                <div class="rights-container">
                    <!--权益详情-->
                    <p v-if="!user.member || (user.member && !memberEndTime)" class="member-question" style="color:#4C4C4C;" @click="toMemberRights">查看权益详情 ></p>
                    <p v-else class="member-question underline" @click="toQuestion" style="color:#808080;">常见问题</p>
                    <!--权益开关-->
                    <div v-if="user.member && memberEndTime" :data-name="rightSwitch ? 'right_switch_off' : 'right_switch_on'" class="member-right-head" @click="setRightSwitch">
                        {{memberTypeShow}} 专属{{user.member_level === 0 ? '9' : '5'}}大特权
                        <img class="member-right-swtich" :src="rightSwitchIcon"/>
                    </div>
                    <!--横向权益icon-->
                    <!-- <scroll-view  v-if="rightSwitch && user.member && memberEndTime" scroll-x="true" class="right-list">
                            <member-right :horizontal=false :memberLevel="user.member_level > 0 ? 0 : -1"  > </member-right>
                    </scroll-view> -->
                    <div  v-if="rightSwitch && user.member && memberEndTime" class="right-list">
                        <member-right :horizontal=false :memberLevel="user.member_level > 0 ? 0 : -1"  > </member-right>
                    </div>

                    <!-- 年卡更多权益(闺蜜卡和体验卡未过期显示)-->
                    <div v-if="rightSwitch && user.member && memberEndTime && user.member_level > 0" class="member-right-head" >
                        天天年卡会员 更多特权
                    </div>
                    <div v-if="rightSwitch && user.member && memberEndTime && user.member_level > 0" class="right-list">
                            <member-right :horizontal=true :memberLevel=1  > </member-right>
                    </div>

                    <!--会员功能入口-->
                    <div v-if="user.member && memberEndTime" class="member-func">
                        <div class="func-item func-item-1" @click="toMemberCalculator" data-name="to_member_calc">
                            <img v-if="showFuncTip" class="func-tip" src="https://img-ali.xiaohongchun.com.cn/admin/15483249998652e8e6b70.png"/>
                            <img style ="width:344rpx;height:156rpx;"  src="https://img-ali.xiaohongchun.com.cn/admin/15483250078053069ea72.png"/>
                            <p v-if="user.member && memberEndTime && user.economy_money !== '0'" class="func-save-text">已为您节省&nbsp;<span style="font-weight: bold;">{{user.economy_money}}</span>&nbsp;元</p>
                            <p v-if="user.member && memberEndTime && user.economy_money === '0'" class="func-save-text">预计每年可省&nbsp;<span style="font-weight: bold;">{{user.average_save_money}}</span>&nbsp;元</p>
                        </div>
                        <div class="func-item" @click="toPhoneCall" data-name="to_phone_call">
                            <img style ="width:344rpx;height:156rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/15483250034682a502a21.png"/>
                        </div>
                    </div>

                    <!--非会员 || 会员过期 权益icon-->
                    <div v-if="!user.member || (user.member && !memberEndTime)" class="member-right-icon">
                        <member-right :horizontal=false :memberLevel=-1 > </member-right>
                    </div>
                    <img v-if="user.member && !memberEndTime" class="split-line" src="https://img-ali.xiaohongchun.com.cn/admin/15476919166743a36792d.png"/>
                    <!-- 618 -->
                    <div v-if="!user.member || (user.member && !memberEndTime)" class="no-member-price" data-name="to_member_calc" @click="toMemberCalculator">¥119/年，每天仅需 <span style="color:#D2A34A">¥0.32</span></div>
                    <div v-if="!user.member || (user.member && !memberEndTime)" class="member-savemoney" data-name="to_member_calc" @click="toMemberCalculator">开通预计每年可省<span style="color:#D2A34A">{{'¥'+user.economy_money}}</span>元</div>
                </div>

                <img v-if="!user.member || (user.member && !memberEndTime)" style="width:752rpx;height: 4104rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/15481353540779a50254.jpg"/>

                <div v-if="orders.length"  class="member-orderlist">
                    <p class="list-title">- 会员专享推荐 -</p>
                    <ul class="list-container">
                        <li class="list-item" v-for="(order, index) in orders" :key="index">
                            <goods-item @toGo="toGoHandle(order, $event)" toGo="true" :goodsImg="order.image_url" :title="order.title" :keynote="order.deal_price" :bottomSecondary="order.mall" :secondary="order.editor_rec_desc" :titleTopIcon='order.goods_icon'></goods-item>
                        </li>
                    </ul>
                </div>
    
                <!-- <div v-if="!user.member || scrollTop > 240" class="bottom-btn"> -->
                <div class="bottom-btn">
                    <!--试用：不是会员，未买过会员-->
                    <div v-if="!user.member && !user.member_buy" class="btn-border">
                        <member-open-btn name="newUserGetMember" :note="note[0]" @openMember="openMember" :uid="user.uid"></member-open-btn>
                        <img class="btn-icon" src="https://img-ali.xiaohongchun.com.cn/admin/1547558835454134b24cf.gif" />
                    </div>
                    <!--试用：是会员，未买过会员-->
                    <div v-if="user.member && !user.member_buy" class="btn-border">
                        <member-open-btn name="newUserGetMember" :note="note[0]" @openMember="openMember" :uid="user.uid"></member-open-btn>
                        <img class="btn-icon" src="https://img-ali.xiaohongchun.com.cn/admin/1547558835454134b24cf.gif" />
                    </div>
                    <!--开通：不是会员-->
                    <div v-if="!user.member" class="gold-bg-btn" style="width:292rpx;">
                        <member-open-btn name="openMember" :note="note[2]" @openMember="openMember" :uid="user.uid"></member-open-btn>
                    </div>
                    <!--续费：是会员且是体验会员-->
                    <div v-if="user.member && user.member_buy && user.member_level === 0" class="gold-bg-btn" style="width:292rpx;" >
                        <member-open-btn name="keepMember" :note="note[1]" @openMember="openMember" :uid="user.uid"></member-open-btn>
                    </div>
                    <!--开通：是会员且是VIP会员-->
                    <div v-if="user.member && user.member_buy && user.member_level === 1" class="gold-bg-btn" style="width:292rpx;" >
                        <member-open-btn name="keepMember" :note="note[2]" @openMember="openMember" :uid="user.uid"></member-open-btn>
                    </div>
                    <!--开通：是会员且是闺蜜卡会员-->
                    <div v-if="user.member && user.member_level === 2" class="gold-bg-btn" style="width:292rpx;" >
                        <member-open-btn name="keepMember" :note="note[2]" @openMember="openMember" :uid="user.uid"></member-open-btn>
                    </div>
                    
                </div>
                <to-index></to-index>
            </div>
        </button>
    </form>
</template>

<script src="./script.js"></script>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="@/common/style/common.css"></style>
<style src="./style.css" scoped></style>

