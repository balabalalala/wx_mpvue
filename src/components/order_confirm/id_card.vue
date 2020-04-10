<template>
<div>
    <div class="idcard-input-box" v-if="!notUploadeTemporary && !hadIdCard && identityCard === 1">
        <p class="input-title">收货人身份证</p>
        <p class="input-tip">应中国海关政策要求，仅用于买手下单、海关清关时使用</p>
        <div class="input-wrapper">
            <input @input="onCardInput('name', $event)" :value="userName" type="text" placeholder="真实姓名" />
            <p v-if="userName" @click="clearCard('name')" class="close"></p>
        </div>
        <div class="input-wrapper">
            <input @input="onCardInput('id', $event)" :value="userCardId" type="text" placeholder="身份证号（将为您加密处理）" />
            <p v-if="userCardId" @click="clearCard('id')" class="close"></p>
        </div>
    </div> 
    <div class="idcard-container" @click="selectIdCard" v-else>
        <p class="idcard-title">收货人身份证</p>
        <p v-if="notUploadeTemporary" class="select">暂不上传身份证</p>
        <p v-else-if="!hadIdCard" class="select">选择</p>
        <div v-else-if="hadIdCard" class="idcard-info">
            <p>{{idCardInfo.full_name}}</p>
            <p>{{idCardInfo.card_id}}</p>
        </div>
        <image class="go" src="https://img-ali.xiaohongchun.com.cn/program-inline-images/MythreeActiveIcon.png"></image>
    </div>
</div>
</template>

<script>
import jump from '../../common/lib/jump'
import _ from 'underscore'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('orderConfirm')
export default {
    //identityCard 0 不需要身份证 1 需要身份证可以不带照片 2 需要带照片的身份证
    //notUploadeTemporary 暂时不上传
    computed: {
        ...mapState({
            notUploadeTemporary: state => state.notUploadeTemporary,
            identityCard: state => state.disclosure.need_idcard,  //0 暂不上传身份证
            idCardInfo: state => _.pick(state.idcard, 'full_name', 'card_id', 'id')
        }),
        hadIdCard () {
            return !!Object.keys(this.idCardInfo).length
        }
    },
    data () {
        return {
            userName: '',
            userCardId: ''
        }
    },
    methods: {
        ...mapMutations(['setIdcardInput']),
        onCardInput(type, e) {
            if(type == 'name'){
                this.userName = e.target.value
                this.setIdcardInput({'full_name': this.userName})
            } else {
                this.userCardId = e.target.value
                this.setIdcardInput({'card_id': this.userCardId})
            }
        },
        clearCard (type) {
            if(type == 'name'){
                this.userName = ''
                this.setIdcardInput({'full_name': this.userName})
            } else {
                this.userCardId = ''
                this.setIdcardInput({'card_id': this.userCardId})
            }
        },
        selectIdCard () {
            if(this.hadIdCard) {
                jump.navigateTo('idcard_list', {id: this.idCardInfo.id})
            }else{
                jump.navigateTo('idcard_list')
            }
        }
    }
}
</script>

<style scoped>
.close {
    position: absolute;
    top: 18rpx;
    right: 11rpx;
    width: 30rpx;
    height: 30rpx;
    text-align: center;
    border-radius: 50%;
    background-color: #808080;
    z-index: 10;
}
.close::after {
    content: "×";
    color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    font-size: 28rpx;
}
.idcard-input-box {
    background-color: #fff;
    line-height: 1;
    padding: 37rpx 35rpx 40rpx;
    position: relative;
}
.input-title, .input-tip {line-height: 1}
.input-title {
    font-size: 28rpx;
    font-weight: 500;
    color: rgba(34,34,34,1);
}
.input-tip {
    color: #808080;
    font-size: 22rpx;
    margin-top: 15rpx;
    margin-bottom: 4rpx;
}
.idcard-input-box input {
    font-size: 26rpx;
    height: 65rpx;
    background-color: #F5F5F5;
    border-radius: 10rpx;
    padding-left: 30rpx;
    color: #222;
}
.input-wrapper {
    position: relative;
}
.input-wrapper:nth-last-of-type(2) {
    margin-top: 24rpx;
}
.input-wrapper:last-of-type {
    margin-top: 20rpx;
}
.idcard-container{
    box-sizing: border-box;
    width: 100%;
    height: 100rpx;
    padding-right: 75rpx;
    padding-left: 37rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25rpx;
    background-color: #fff;
    position: relative;
}
.idcard-container::before, .idcard-input-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 38rpx;
    right: 12rpx;
    height: 1rpx;
    background: #F1F1F1;
}
.idcard-title{
    font-size: 28rpx;
    font-weight: bolder;
    color: #222222;
}
.go{
    height: 30rpx;
    width: 20rpx;
    position: absolute;
    right: 35rpx;
    top: 50%;
    transform: translateY(-50%);
}
.select{
    font-size: 28rpx;
    color: #4c4c4c;
    position: absolute;
    right: 75rpx;
}
.idcard-info {
    display: flex;
    color:#4c4c4c;
    font-size: 26rpx;
}
.idcard-info p:first-child {margin-right: 19rpx;}
</style>
