<template>
    <div @click="jump(disclosure,$event)" class="container ovh" data-name="search_item_click" :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" :data-track_info="disclosure.track_info">
        <img data-name="search_item_click" :data-track_info="disclosure.track_info" :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" :src="disclosure.image_url">

        <div class="info">
            <h3 data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" class="ellipsis" style="-webkit-box-orient: vertical;opacity:'1.0'">{{ disclosure.title }}</h3>
            <div class="detail-info" :style="disclosure.gid && disclosure.type !== 1 ? 'margin-top:4rpx' : ''">
                <div data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" class="disclosure-detail">{{ disclosure.v_detail }}</div>
                <button @click="onclick" data-id="sub_btn" :data-name="subClick ? 'g_unsub' : 'g_sub'"
                    v-if="disclosure.gid && disclosure.type !== 1" class="subscribe">
                    {{subClick ? '已订阅' : '订阅'}}
                </button>
            </div>
            <p data-name="search_item_click" :data-track_info="disclosure.track_info" :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" class="disclosure-desc">{{ disclosure.editor_rec_desc }}</p>
            <div data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" class="info-container" :style="disclosure.gid && disclosure.type !== 1 ? 'margin-top:21rpx' : ''">
                <div class="mall-msg" data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type">
                    <p class="disclosure-mall" data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type"
                    :style="'overflow:hidden;text-overflow: ellipsis;white-space: nowrap;'"
                    v-if="disclosure.mall">{{ disclosure.mall }}</p>
                    <p data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type" class="disclosure-time" :style="'margin-left:'+(disclosure.mall ? 10 : 0) +'rpx'">
                        {{ disclosure.release_time }}</p>
                </div>
                <!-- 评论 -->
                <div class="comment" data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type">
                    <img class="comment-img" src="https://img-ali.xiaohongchun.com.cn/admin/15646399240282f17f0a8.png">
                    <span class="comment-num">{{disclosure.comment_count}}</span>
                </div>
                <!-- 值 -->
                <div class="value" data-name="search_item_click" :data-track_info="disclosure.track_info"  :data-item_id="disclosure.did || disclosure.aid" :data-type_id="disclosure.type">
                    <img class="value-img" src="https://img-ali.xiaohongchun.com.cn/admin/15639606652059466134.png">
                    <span class="percentage">{{disclosure.value_percentage}}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import jump from '@/common/lib/jump'
    import fly from "@/lib/http"

    export default {
        data() {
            return {
                subClick:false
            }
        },
        props: ['disclosure'],
        methods: {
            jump(item, e) {
                if (e.target.dataset.id != 'sub_btn') {
                    if (item.type == 0) {
                        jump.navigateTo('disclosure', { gdid: item.did }, e)
                    } else {
                        let token = wx.getStorageSync('lsj_userToken')
                        jump.navigateTo('web_view', {
                            url: token ? '/article/' + item.aid + '?token=' + token.token : '/article/' + item.aid,
                            notShare: false,
                            webPage: true,
                            shareTitle: `${item.v_detail} ${item.title}`
                        }, e)
                    }
                }
            },

            onclick() {
                this.subClick ? this.unsub() : this.sub()
                console.log(this.subClick)
            },

            unsub() {
                fly.delete("/lsj/v3/favorite?id=" + this.disclosure.sid)
                    .then(() => this.subClick = false)
            },

            sub() {
                fly.post('/lsj/v3/favorite', {
                    did: this.disclosure.did,
                    eid: this.disclosure.gid,
                    e_type: 1
                })
                    .then(resp => {
                        this.subClick = true
                        this.disclosure.sid = resp.data.id

                        // const today = new Date()
                        // const todayModalVal = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
                        // const todayModalKey = 'subscribed_install_modal'
                        // const todayModalstore = wx.getStorageSync(todayModalKey)

                        // if (!todayModalstore || (todayModalstore && todayModalstore !== todayModalVal)) {
                        //     this.$emit('showSubscribeModal')
                        //     wx.setStorage({ key: todayModalKey, data: todayModalVal })
                        // }
                    })

            },
        },
        onLoad(){
            this.subClick = this.disclosure.subscribed
        }

    }

</script>

<style scoped>
    .container {
        padding: 30rpx 20rpx;
        border-bottom: 1px solid #f2f2f2;
        position: relative;
    }

    /* .overtime::before {
    content: '';
    position: absolute;
    width: 84rpx;
    height: 34rpx;
    top: 50rpx;
    left: 20rpx;
    background: url(https://img-ali.xiaohongchun.com.cn/admin/15381088899342074b75d.png) 0 0 no-repeat;
    background-size: contain;
} */
    .detail-info {
        width: 470rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top:10rpx;
    }
    image {
        width: 210rpx;
        height: 210rpx;
        float: left;
    }

    .info {
        font-size: 28rpx;
        padding-left: 20rpx;
        overflow: hidden;
    }

    .info-container {
        display: flex;
        width: 441rpx;
        margin-top: 20rpx;
        justify-content: space-between;
        align-items: center;
    }

    .info h3 {
        max-width: 433rpx;
        line-height: 40rpx;
        height: 80rpx;
        font-size: 30rpx;
        font-weight: 500;
        margin-top: -4rpx;
        color: rgba(34, 34, 34, 1);
    }


    .disclosure-detail {
        max-width: 285rpx;
        white-space: nowrap;
        overflow: hidden;
        line-height: 30rpx;
        text-overflow: ellipsis;
        font-size: 30rpx;
        color: #dc3538;
    }

    .disclosure-desc {
        width: 450rpx;
        max-width: 460rpx;
        white-space: nowrap;
        overflow: hidden;
        line-height: 1;
        margin-top: 19rpx;
        text-overflow: ellipsis;
        font-size: 28rpx;
        color: rgba(163, 163, 163, 1);
    }
    .mall-msg {
        display: flex;
        width: 222rpx;
    }
    .disclosure-mall,
    .disclosure-time {
        line-height: 1;
        display: inline-block;
        font-size: 24rpx;
        color: rgba(163, 163, 163, 1);
    }
    .disclosure-time {
        white-space: nowrap;
    }

    .mall {
        text-align: right;
        color: #a3a3a3;
        font-size: 24rpx;
    }

    .info button {
        float: right;
        margin-right: 10rpx;
    }
   .comment{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 110rpx;
        line-height: 32rpx;
        margin-right: 10rpx;
    }
    .comment-img {
        width: 28rpx;
        height: 28rpx;
    }
    .comment-num {
        margin-left: 12rpx;
        font-size:24rpx;
        color:rgba(128,128,128,1);
    }
    .value {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 10rpx;
        width: 105rpx;
        line-height: 32rpx;
    }
    .value-img {
        width: 32rpx;
        height: 32rpx;
    }
    .percentage{
        font-size:24rpx;
        color:rgba(128,128,128,1);
        margin-left: 10rpx;
    }
</style>