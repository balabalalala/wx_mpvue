<template>
    <div>
        <img class="icon-user" :src="user.icon ? user.icon : 'https://img-ali.xiaohongchun.com.cn/admin/15354505783773a3e40a3.png'" />
        
        <p v-if="user.nick" class="user-name">
            {{user.nick}}
            <img v-if="user.member && user.member_level === 1" class="vip-icon-0" :src="'https://img-ali.xiaohongchun.com.cn/admin/' + (!memberEndTime ? '15480383716563b2bb520.gif' : '154755699592824030997.gif')" />
            <img v-if="user.member && user.member_level === 0" class="vip-icon-1" :src="'https://img-ali.xiaohongchun.com.cn/admin/' + (!memberEndTime ? '15480383638932e3608de.gif' : '154755702963820f70029.gif')" /> 
            <img v-if="user.member && user.member_level === 2" class="vip-icon-0" :src="'https://img-ali.xiaohongchun.com.cn/admin/' + (!memberEndTime ? '156223216215729f75537.gif' : '156207817896135d1e95e.gif')" />
        </p>
        <p v-else class="user-name" style="height:30rpx;">
            <userinfo-auth name="memberCenterPageLogin" :note="login"></userinfo-auth>
        </p>
        <p v-if="user.member && memberEndTime" class="time">{{restTime}}</p>
        <p v-if="user.member && !memberEndTime" class="time">会员已过期，开通重获特权</p>
        <p v-if="user.member" @click="toOpenList" data-name="member_open_list" class="open-list">查看开通记录 ></p>
        <div v-if="user.member && user.member_level === 1" data-name="openMember"  class="go-btn go-btn-1" @click="loginEvent">{{note[2]}} > </div>
        <div v-if="user.member && user.member_level === 2" data-name="openMember"  class="go-btn go-btn-1" @click="loginEvent">{{note[2]}} > </div>
        <div v-if="user.member && user.member_level === 0" data-name="keepMember" class="go-btn go-btn-2" @click="loginEvent">{{note[1]}} > </div>
        <div v-if="user.member && user.member_buy === 0" data-name="newUserGetMember" class="go-btn go-btn-3" @click="loginEvent">{{note[0]}} > 
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    props: {
        note: Array,   // 按钮的文案
        name: String,
        user: Object,
        memberEndTime: Boolean,
        restTime: String
    },
    methods: {
        ...mapMutations(['toggleAuth', 'setAuthName']),
        toOpenList(){
            this.$emit('toOpenList')
        },
        loginEvent (e) {
            if (!this.user.uid) {
                let name = e.target.dataset.name 
                this.setAuthName(name)
                this.toggleAuth()
                return
            }
            this.$emit('openMember')
        }
    }
}
</script>

<style scoped>
.btn-icon {
    position: absolute;
    top: -30%;
    left: 70%;
    width: 93rpx;
    height: 30rpx;
}

.fullbg {
    z-index: 100; 
    filter: alpha(Opacity=50);
    -moz-opacity:0.5;
    opacity: 0.5;
}
.go-btn {
    background:linear-gradient(-45deg,rgba(244,210,158,1),rgba(237,193,138,1),rgba(244,210,158,1));
    border-radius:40rpx 0 0 40rpx;
    height:67rpx;
    line-height:67rpx;
    text-align:center;
    font-size:26rpx;
    position:absolute;
    left:550rpx;
    top:37rpx;
    padding:0 20rpx;
    min-width:120rpx;
    
}
.go-btn-1 {
    width:200rpx;
    left:540rpx
}
.go-btn-2 {
    width:120rpx;
    left:600rpx;
}
.go-btn-3 {
    width:224rpx;
    left:504rpx;
}



.icon-user {
    width:110rpx;
    height:110rpx;
    border-radius: 50%;
    float: left;
    margin-right:21rpx;
}
.vip-icon-0 {
    width:89rpx;
    height:32rpx;
    margin-left:6rpx;
    margin-top: 9rpx;


}
.vip-icon-1 {
    width:55rpx;
    height:32rpx;
    margin-left:6rpx;
    /* vertical-align:middle; */
    margin-top: 9rpx;
}
.member-user .user-name {
    font-size:28rpx;
    line-height:52rpx;
    font-family:PingFang-SC-Regular;
    display:flex;
    vertical-align:middle;
    font-weight: bold;

}
.nick-angle {
    font-size: 16rpx;
}
.time {
    font-size: 24rpx;
    line-height: 40rpx;
    color:rgba(76,76,76,1);
    font-family:PingFang-SC-Regular;
}
.overtime {
    font-size: 20rpx;
    line-height: 6rpx;
    font-family:PingFang-SC-Regular;
    color:#808080;
}
.open-list {
    font-size: 20rpx;
    /* line-height: 6rpx; */
    font-family:PingFang-SC-Regular;
    color:#808080;
}

</style>
