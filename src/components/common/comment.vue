<template>
	<div :class="isAll ? 'container-all' : 'container'">
        <div class="comment-title">
            <!-- <div class="red-mark"></div> -->
            <p class="text1">评论</p>
            <p class="text2">（{{total}}）</p>
        </div>
        <div v-if="total == 0" class="no-comment-line">暂无评论</div>
        <div class="no-comment-input" v-if="!isAll && allowInteraction">
        <!-- <div class="no-comment-input" v-if="allowInteraction"> -->
            <image :src="publishIcon" />
            <input :placeholder="placeHolderDisabled" data-name="show_comment_input" disabled="disabled" @click="onFocus"/>
        </div>

        <div class="ol" v-if="total > 0">
            <div class="li" v-if="index < (isAll ? 999 : 3) && (item.del == 0 || item.count > 0)" :key="index" v-for="(item, index) in lists">
                <image :src="item.icon" @click="toAll"/>
                <div class="content">
                    <div style="position:relative;">
                        <text style="width:515rpx;" class="nick" @click="toAll">{{item.nick}} </text>
                        <text v-if="isAll" data-name="comment_handle" @click="commentOperation" :data-id="item.id" style="position:absolute;color:#808080;font-weight:500;right:70rpx;bottom:0;">...</text>
                    </div>
                    <div :class="item.del == 0 ? 'comment-content' : 'comment-content-del'" @click="toAll">{{item.del == 0 ? item.content : '该评论已删除'}}</div>
                    <div class="status">
                        <text class="time" @click="toAll">{{item.create_time}}</text>
                        <text v-if="allowInteraction"  data-name="comment_like" @click="like" :data-id="item.id" class="like" :class="item.liked ? 'liked' : ''">{{item.like_num || '0'}}</text>
                        <text v-if="allowInteraction && item.del == 0" data-name="comment_reply" @click="reply" :data-id="item.id" :data-parent_nick="item.nick" :data-parent_id="item.id" class="reply">回复</text>
                    </div>
                    <div v-if="item.children && ! item.hidden" class="reply-list">
                        <div class="reply-area" v-if="reply_index < (isAll ? 999 : 3) && reply_item.del == 0" :key="reply_index" v-for="(reply_item, reply_index) in item.children">
                            <div style="position:relative;">
                                <span @click="toAll" class="reply-nick">{{reply_item.replier_nick}}{{!reply_item.receiver_nick ? ':' : ''}}</span>
                                <span @click="toAll" v-if="reply_item.receiver_nick" class="reply-text"> 回复 </span>
                                <span @click="toAll" v-if="reply_item.receiver_nick" class="reply-nick">{{reply_item.receiver_nick}}:</span>
                                <span v-if="isAll" data-name="comment_handle" @click="commentOperation" :data-parent_id="item.id" :data-id="reply_item.id" style="position:absolute;color:#808080;font-weight:500;bottom:0;right:0;font-size:38rpx;">...</span>
                            </div>
                            <!-- <text @click="toAll" class="reply-content">  {{reply_item.content}}</text> -->
                            <div class="comment-content" @click="toAll">{{reply_item.content}}</div>
                            <div class="reply-status" v-if="isAll">
                                <text @click="toAll" class="time">{{reply_item.create_time}}</text>
                                <text v-if="allowInteraction" data-name="comment_like" @click="like" :data-parent_id="item.id" :data-id="reply_item.id"  class="like" :class="reply_item.liked ? 'liked' : ''">{{reply_item.like_num || '0'}}</text>
                                <text v-if="allowInteraction" data-name="comment_reply" :data-id="item.id" :data-parent_nick="reply_item.replier_nick" :data-parent_id="reply_item.id"  @click="reply"  class="reply">回复</text>
                            </div>
                        </div>
                        <div class="reply-area" v-if="!isAll && item.count > 3">
                            <text @click="toAll" data-name="reply_see_all" class="reply-total">共{{item.count}}条回复 ></text>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!isAll" data-name="comment_see_all" @click="toAll" class="more">查看全部{{total}}条评论</div>
        </div>

        <text v-if="isAll && bottom" class="bottom-line">我也是有底线的哦 ~</text>

        <!--内容页输入框-->
        <div class="comment-box" v-if="!isAll && allowInteraction && focus">
            <textarea fixed="true" maxlength="500" :show-confirm-bar= "false" auto-height="true" :focus="focus" :value="content" @blur="blur" @input="sync" :placeholder="placeholder" cursor-spacing="12" cursor='-1' :class="isIos ? 'comment-textarea-ios': 'comment-textarea'"></textarea>
            <span class="input-char-num-1 count-red-tip" v-if="contentRemainCount <= 10 && contentRemainCount !==0">{{contentRemainCount}}</span>
            <button data-name="comment_send"  :disabled="sendBtnStatus" @click="send" class="send-btn">发送</button>
        </div>
        <!--评论页输入框-->
        <div class="comment-box comment-box-all" v-if="isAll && allowInteraction && !operationModal">
            <div class="input-area">
                <textarea fixed="true" maxlength="500" :show-confirm-bar= "false" auto-height="true" :focus="focus" @blur="blur" :value="content" cursor-spacing="15" @input="sync" :placeholder="placeholder" cursor='-1'  :class="isIos ? 'comment-textarea-ios': 'comment-textarea'"></textarea>
                <span class="input-char-num count-red-tip" v-if="contentRemainCount <= 10 && contentRemainCount !==0">{{contentRemainCount}}</span>
            </div>
            <button data-name="comment_send" :disabled="sendBtnStatus" @click="send" class="send-btn">发送</button>
        </div>
        <comment-operation v-if="isAll && operationModal" 
        :operationContent="operationContent" 
        :operationNick="operationNick" 
        :operationList="operationList" 
        :operationId="operationId"
        :operationParentId="operationParentId" 
        @deleteCallback="commentDelete"
        @close="operationModal = false"/>

        <auth/>
	</div>
</template>

<script>
import qs from 'qs'
import _ from 'underscore'
import moment from 'moment'
import jump from '@/common/lib/jump'
import fly from "@/lib/http"
import user from '@/lib/user'
import Auth from '@/components/common/auth'
import CommentOperation from '@/components/common/comment_operation'
import { createNamespacedHelpers,mapMutations as globalMapMutations} from 'vuex'
const { mapMutations} = createNamespacedHelpers('disclosure')
export default  {
	props : {
		id: {
            type: Number,
            default: 0
        },
        allowInteraction: {
            type: Boolean,
            defalult: true
        },
        eType: {
            type: Number,
            defalult: 1 // 1 爆料 2 文章
        },
        isAll: {
            type: Number,
            defalult: 0 // 0 否 1 是
        }
	},   
    data () {
        return{
            publishIcon: '',
            page_mark: '',
            page_size: 20,
            lists: [],
            bottom: false,
            status: 0, // 评论框状态
            content: '',
            sending: false,
            focus: false,
            parentNick: '',
            parent: 0,
            mainID: 0,
            user: {},
            total: 0,
            // showAuth: false,
            isIos: false,
            contentRemainCount: 140,
            sendBtnStatus:false,
            mainId:0,
            operationModal: false,
            operationContent: "",
            operationNick: "",
            operationList: [],
            operationId: 0,
            operationParentId: 0,
            clickEnable: true
        }
    },
    components : {Auth, CommentOperation},
    methods : {
        ...globalMapMutations(['toggleAuth','setAuthName']),
        ...mapMutations(['setCommentCount']),
        toAll(e) {
            if(this.isAll == 1) return false
            jump.navigateTo('comment_list', { id: this.id, eType: this.eType ,main_id:this.mainID}, e)
        },
        commentDelete(params) {
            let item = {}
            let cid = params.operationId
            let pid = params.operationParentId
            if(pid) {
                let parentItem = this.lists.find(c => c.id == pid)
                item = parentItem.children.find(c=> c.id == cid)
                parentItem.count -= 1
                item.del = 1

                if(parentItem.children.length == 1) {
                    parentItem.hidden = 1
                }

            }else{
                item = this.lists.find(c => c.id == cid)
                item.del = 1                
            }
        },
        commentOperation(e) {
            if (!user.isLogin()) {
                this.setAuthName('comment_operation')
                return this.toggleAuth()
            }  
            let userId = wx.getStorageSync('lsj_userToken').token.split(' ')[0]
            
            const cid = e.target.dataset.id
            const pid = e.target.dataset.parent_id
            let item = {}
            if(pid) {
                let parentItem = this.lists.find(c => c.id == pid)
                item = parentItem.children.find(c=> c.id == cid)
            }else{
                item = this.lists.find(c => c.id == cid)                
            }
            
            if(item.del != 0) {
                return wx.showToast({
                    title: '该评论内容已被删除～',
                    icon: 'none',
                    duration: 2000
                })
            }

            this.operationContent = item.content
            this.operationNick = item.nick || item.replier_nick
            this.operationId = item.id
            this.operationParentId = pid ? pid : 0
            
            if(item.uid == userId) {
                this.operationList = [
                    {op: 'delete', text: '删除' },
                ]
            }else {
                this.operationList = [
                    {op: 'complaint', text: '举报' },
                ]
            }
            this.operationModal = true
        },

        async like(e) {
            
            if(!this.clickEnable) return
            this.clickEnable = false
            
            if (!user.isLogin()) {
                this.setAuthName('comment_like')
                return this.toggleAuth()
            }            
            const cid = e.target.dataset.id
            const pid = e.target.dataset.parent_id
            let item = {}
            if(pid) {
                let parentItem = this.lists.find(c => c.id == pid)
                item = parentItem.children.find(c=> c.id == cid)
            }else{
                item = this.lists.find(c => c.id == cid)                
            }

            if(item.del != 0) {
                this.clickEnable = true
                return wx.showToast({
                    title: '该评论内容已被删除～',
                    icon: 'none',
                    duration: 2000
                })
            }

            if(item.liked) {
                await fly.post('/lsj/v3/comment/like', {
                    cid,
                    status: 0
                }).then(() => {
                        this.clickEnable = true
                        item.like_num -= 1
                        item.liked = 0
                        return wx.showToast({
                            title: '点赞已取消～',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                )
            }else {
                await fly.post('/lsj/v3/comment/like', {
                    cid,
                    status: 1
                }).then(() => {
                        this.clickEnable = true
                        item.like_num += 1
                        item.liked = 1
                        return wx.showToast({
                            title: '点赞成功～',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                )
                
            }
        },
        sync(e) {
            this.focus = true       
            this.content = e.target.value  
            this.contentRemainCount = 140 - this.content.length
        },
        blur() {
            this.focus = false
            setTimeout(() => {
                if(!this.content) {
                }
            }, 200)
        },
        onFocus() {            
            this.focus = true
            if (!user.isLogin()) {
                this.setAuthName('comment')
                return this.toggleAuth()
            }
            this.parent = 0
            this.mainID = 0
        },
        clearContent() {
            this.content = ''
            this.mainID = 0
            this.parent = 0
            this.focus = false
            this.page_mark = ''
        },
        async send() {
            if (!user.isLogin()) {
                this.setAuthName('comment_send')
                return this.toggleAuth()
            }
            // 是否绑定手机号
            let mobileRes = await fly.get('/lsj/v3/register/get_phone')
            mobileRes = mobileRes.data
            if(!mobileRes.result) {  
                this.wx.checkSession()
                .then( e => 
                    jump.navigateTo('add_mobile_number')
                )
                .catch(async e => {
                    await user.login()
                    jump.navigateTo('add_mobile_number')
                })
                return
            }
            
            if(this.sending || !this.content) return
            if(this.content.trim().length < 5) {
                return wx.showToast({
                    title: '评论内容不能少于5个字哦~',
                    icon: 'none',
                    duration: 2000
                })
                this.sendBtnStatus = false
            }
            if(this.content.trim().length > 140) {
                return wx.showToast({
                    title: '评论内容不能多于140个字',
                    icon: 'none',
                    duration: 2000
                })
                this.sendBtnStatus = false
            }
            this.sendBtnStatus = true
            this.sending = true
            let resp;
            try {
                resp = await fly.put('/lsj/v3/comment/add', {
                    content: this.content,
                    e_id: this.id,
                    e_type: this.eType,
                    main_id: this.mainID || 0,
                    parent_id: this.parent || 0,
                })
            } catch(e) {
                return console.error(e)
            }
            this.content = ''
            this.sending = false
            if(resp) {
                this.sendBtnStatus = false
                const comment = resp.data
                comment.nick = this.user.nick
                comment.icon = this.user.icon
                comment.create_time = this.formatDate(comment.create_time)
                comment.liked = 0
                comment.like_num = 0
                comment.del = 0
                if(this.parent > 0 && this.mainID > 0){                    
                    comment.replier_nick = this.user.nick
                    comment.receiver_nick = this.mainID == this.parent ? null : this.parentNick
                    comment.main_id = this.mainID
                    let parentItem = this.lists.find(c => c.id == this.mainID)
                    if(parentItem.children){                        
                        parentItem.children.push(comment)
                    }else{
                        parentItem.children= [comment]
                    }                    
                }else{
                    this.lists.splice(0, 0, comment)
                }
                this.clearContent()
                this.total += 1
                this.setCommentCount(1)
                wx.showToast({
                    title: '发布成功',
                    icon: 'info',
                    duration: 2000
                })
            }            
        },
        reply(e) {
            if (!user.isLogin()) {
                this.setAuthName('comment_reply')
                return this.toggleAuth()
            }
            const mainID = e.target.dataset.id
            const parentID = e.target.dataset.parent_id
            const parentNick = e.target.dataset.parent_nick
            this.parent = parentID
            this.mainID = mainID
            this.parentNick = parentNick
            this.focus = true;
        },
        async fetch() {
            if(this.bottom) return
            let resp = await fly.get('/lsj/v3/comment/list?' + qs.stringify(this.params))
            resp = resp.data
            if((!resp.page_mark && !resp.result.length) || resp.result.length < this.page_size) {                
                this.bottom = true                
            }
            var _that = this
            resp.result.forEach(function(item){
                item.create_time = _that.formatDate(item.create_time)
                if(item.children){
                    item.children.forEach(function (child) {
                        child.create_time = _that.formatDate(child.create_time)
                    })
                }
            })
            if(this.page_mark !== '') {
                this.lists.push(...resp.result)
            } else {                
                this.lists = resp.result
            }            
            this.total = resp.total            
            this.user.icon = resp.icon
            this.user.nick = resp.nick      
            this.page_mark = resp.page_mark
            this.publishIcon = resp.icon
            
        },
        formatDate(time) {
            if(Date.now() - time < 60 * 1e3) {
                return '刚刚'
            }
            return moment(time).format('MM-DD HH:mm')
        },
    },
    computed : {
        params() {
            return {
                e_id: this.id,
                e_type: this.eType,
                all: this.isAll,
                main_id:this.mainID || this.mainId,
                page_mark: this.page_mark,
                page_size: this.page_size,
            }
        },
        placeHolderDisabled() {
            return '说点什么，才对得起这神价格'
        },
        placeholder() {
            if(this.parent > 0) {
                return '回复' + this.parentNick + '：'
            }else{
                return '写评论...'
            }
        },
    },
    mounted() {
        var phone = wx.getSystemInfoSync();
        if (phone.platform == 'ios') {
            this.isIos = true
        }        
    },
     onLoad() {
        
    },
    created() {  
        const query = this.$root.$mp.query
        this.mainId = query.main_id
        this.fetch()        
    }
}
</script>
<style>
    /* .placeholder {font-weight: 300; font-size: 28rpx; line-height: 60rpx;} */
</style>
<style scoped>
@keyframes liked {
    50% {
        transform: scale(1.2) rotate(10deg);
    }
}
.no-comment-input {padding:0 30rpx; margin-top:40rpx;}
.no-comment-input image {float: left; width: 64rpx; height: 64rpx; border-radius: 50%;}
.no-comment-input input {
    width:512rpx;
    height: 64rpx;
    display: inline-block; 
    vertical-align: middle; 
    background: url(https://img-ali.xiaohongchun.com.cn/admin/15646566768117e5503c.png) no-repeat; 
    background-size: 36rpx 36rpx;
    background-color: #F5F5F5;
    font-size:28rpx;
    outline: none;
    padding-left:78rpx;
    margin-left:20rpx;
    background-position: 32rpx;
}
.input-placeholder{
    height: 60rpx;
    line-height: 60rpx;
}
.input-placeholder::-moz-placeholder{
    height: 60rpx;
    line-height: 60rpx;
}
.input-placeholder::-ms-input-placeholder{
    height: 60rpx;
    line-height: 60rpx;
}
.more {text-align: center;color:#000;font-size: 28rpx;margin-top:49rpx;font-weight:bold;}
.container {padding-bottom:50rpx;}
.container-all {}
.count {font-size: 32rpx; margin-left: 1em; color: #191919; font-weight: bold;}
.ol {margin-left: 30rpx; margin-top: 20rpx;}
.li {padding-top: 50rpx; }
.li image {float: left; width: 64rpx; height: 64rpx; border-radius: 50%;}
.content {overflow: hidden; padding-left: 22rpx; }
.li button {display: inline-block;}
.nick {font-size: 26rpx; color: #000000; display: block; line-height: 1; font-weight:bold;}
.comment-content {font-size: 28rpx; color: #000000; margin-top: 18rpx; padding-right: 76rpx; line-height: 40rpx;}
.comment-content-del {font-size: 28rpx; color: #808080; margin-top: 18rpx; padding-right: 76rpx; line-height: 40rpx;}
.time {color: #808080; font-size: 24rpx; float: left;}
.status {line-height:47rpx; margin-top: 22rpx; padding-right: 56rpx; height: 47rpx;}
.reply-status {line-height:40rpx; margin-top: 22rpx; height: 33rpx;}
.like, .reply {float: right;}
.like{font-size:26rpx;color: #808080;}
.liked {color: #D03436; font-size: 26rpx;}
.like::before {content: ''; display: inline-block; width: 36rpx; height: 54rpx;margin-right: 8rpx;  vertical-align: middle; background: url(https://img-ali.xiaohongchun.com.cn/admin/156463927835337c55960.png) left 3rpx no-repeat; background-size: 36rpx 36rpx; }
.liked::before {background-image: url(https://img-ali.xiaohongchun.com.cn/admin/15646392845891944f082.png); animation: liked .5s;}
.reply {margin-right: 40rpx;font-size: 26rpx;color: #5B92E1;font-weight: bold;}
.reply-list {margin-top:40rpx;padding-top:30rpx;background:#F5F5F5;width:580rpx;}
.reply-area {font-size: 26rpx; background: #F5F5F5; padding: 0 20rpx 30rpx 30rpx;}
.reply-content {color: #000;}
.reply-nick {color: #000000;font-weight:bold;}
.reply-text {color: #000000;}
.reply-total {color: #5B92E1;font-weight:bold;}
.bottom-line {display: block; text-align: center; margin-top: 47rpx; margin-bottom: 150rpx; font-size: 26rpx; color: #a3a3a3;}
.no-comment-line {display: block; text-align: left; margin: 30rpx 0 0 51rpx; font-size: 28rpx; color: #808080;}
.comment-placeholder {height: 120rpx;;z-index:999;}
.comment-box {padding:13rpx 30rpx 15rpx 30rpx; position: fixed; z-index:10; border-top:1rpx;border-top-style:solid; border-color: #f5f5f5;  left: 0; bottom: 103rpx; right: 0;  background: #F5F5F5; }
.comment-box-all {bottom: 0!important;}
.ipx .comment-box-all{border-bottom:60rpx solid #fff;}
.comment-textarea{border-radius: 0;outline: 0 none; border:0.01rem solid #ccc;margin-right:20rpx; width: 510rpx; background-color: #FFFFFF; color: #1D1B19;  font-size: 26rpx; padding: 15rpx 20rpx;}
.comment-textarea-ios{border-radius: 0;outline: 0 none; border:0.01rem solid #ccc;margin-right:20rpx; width: 510rpx; background-color: #FFFFFF; color: #1D1B19;  font-size: 26rpx; padding: 0rpx 20rpx;min-height:60rpx;}
/* .comment-box textarea {margin-right:20rpx; width: 510rpx; background-color: #F5F5F5; color: #808080;  font-size: 28rpx; padding: 15rpx 20rpx;} */
.comment-box button {border-radius:0;text-align:center;width:120rpx;height: 60rpx; vertical-align: middle; background:#1D1B19;color:#fff;font-size:26rpx;}
.send-btn {position: absolute; right: 32rpx; bottom:15rpx; color: #dc3538; font-size: 30rpx; font-weight: 500; line-height: 60rpx;}
/* .mask {z-index: 20;left: 0; right: 0; top: 0; bottom: 0; position: fixed; background-color: rgba(0, 0, 0, .3);} */
/* .modal {position: absolute; width: 70%; left: 50%; top: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 2em; font-size: 28rpx; color: #a3a3a3; text-align: center; border-radius: 10rpx;} */
/* .auth-button {display: inline-block; margin-top: 1.5em;} */
/* .red-mark {
    position: absolute;
    width: 6rpx;
    height: 28rpx;
    top: 45rpx;
    background-color:#dc3538;
} */
.comment-title {
    position: relative;
    padding-top: 30rpx;
    color: #222;
    font-weight: 500;
}
.comment-title .text1 {
    display: inline-block;
    font-size: 34rpx;
    margin-left: 40rpx;
}
.comment-title .text2 {
    display: inline-block;
    font-size: 28rpx;
    margin-left: 0;
}
.input-area {
    position: relative;
}
.input-char-num {
    position: absolute;
    bottom:10rpx;
    right: 154rpx;
    color: #A5A5A5;
    font-size: 22rpx;
}
.input-char-num-1 {
    position: absolute;
    bottom:20rpx;
    right: 180rpx;
    color: #A5A5A5;
    font-size: 22rpx;
}
.count-red-tip {
    color: #D03436;
}
</style>





