<template>
<div>
    <div v-for="right in rights" 
    :class="horizontal ? 'icon-container-inline' + (fullBG && right.type == 1 ? ' fullbg' : '' )   
    :  'icon-container' + (fullBG && right.type == 1 ? ' fullbg' : '')" 
    :key="right.num" 
    :data-name="right.name"
    @click="toRightDetail(right)"
    v-if="(right.type == memberLevel || memberLevel == -1)"
    >
        <div class="right-icon" :class="horizontal ? 'h-icon-' + right.num  : 'icon-' + right.num" ></div>
        <p class="icon-p-1">{{right.name}}</p>
        <p class="icon-p-2">{{right.title}}</p>
    </div>
</div>
</template>
<script>
import jump from '@/common/lib/jump'

const rights = [
    {"sort":0, "num" : 1, "name":"闺蜜卡", "title": "送TA月卡 会员同享 ", "type": 1},
    {"sort":1, "num" : 2, "name":"免费代买", "title": "代买服务费全免", "type": 0},
    {"sort":2, "num" : 3, "name":"会员专享商品", "title": "会员独享购买特权", "type": 0},
    {"sort":6, "num" : 4, "name":"海淘服务", "title": "海淘特价轻松买", "type": 1},
    {"sort":7, "num" : 5, "name":"差价补贴", "title": "降价退给你涨价平台补", "type": 1},
    {"sort":3, "num" : 6, "name":"专属客服", "title": "资深客服 优先解答", "type": 0},
    {"sort":4, "num" : 7, "name":"免费取消", "title": "取消订单无需代买费", "type": 0},
    {"sort":8, "num" : 8, "name":"优先下单", "title": "5星买手帮你抢神价", "type": 1},
    {"sort":5, "num" : 9, "name":"免费进群", "title": "及时推送 神价优先看", "type": 0},
    ]
export default {
    props: {
        horizontal: Boolean,
        memberLevel: Number,
        fullBG: Boolean
    },
    data() {
        return {
            rights: rights
        }
    },
    computed: {
        sortRights () {
            if (this.horizontal && this.memberLevel === 1) {
               return rights.sort(function(a, b) {
                    return a.sort - b.sort;
                });
            }
            return rights
        }
    },
    methods: {
        toRightDetail(right) {
            if (right.type === -1) {
                wx.showToast({
                    title: '即将上线，敬请期待',
                    icon: 'none',
                    duration: 3000
                })
            } else {
                jump.navigateTo('web_view', {
                    url: '/member/member_rights?id='+(right.num -1),
                    webPage: true,
                })
            }
        }
    }
}
</script>

<style scoped>
.fullbg {
    z-index: 100; 
    filter: alpha(Opacity=50);
    -moz-opacity:0.5;
    opacity: 0.5;
}
.icon-container-inline {
    display: inline-block;
    padding-left:20rpx
}
.icon-container {
    width: 180rpx;
    height: 150rpx;
    margin: 25rpx;
    float: left;
    text-align: center;
}
.right-icon {
    width: 140rpx;
    height: 120rpx;
    background: url("https://img-ali.xiaohongchun.com.cn/admin/15622138574399a22500.png");
    background-repeat: no-repeat;
    background-size:cover;
    margin:0 auto
}
.fullbg {
    z-index: 100; 
    filter: alpha(Opacity=50);
    -moz-opacity:0.5;
    opacity: 0.5;
}

.h-icon-1 {
    background-position: -8rpx 0rpx;
}
.h-icon-4 {
    background-position: -460rpx 0;
}
.h-icon-5 {
    background-position: -612rpx 0;
}
.h-icon-8 {
    background-position: -1070rpx 0;
}



.icon-1 {
    background-position: -8rpx 0rpx;
}
.icon-2 {
    background-position: -157rpx 0;
}
.icon-3 {
    background-position: -312rpx 0;
}
.icon-4 {
    background-position: -460rpx 0;
}
.icon-5 {
    background-position: -612rpx 0;
}
.icon-6 {
    background-position: -768rpx 0;
}
.icon-7 {
    background-position: -918rpx 0;
}
.icon-8 {
    background-position: -1071rpx 0;
}
.icon-9 {
    background-position: -1220rpx 0;
}
.icon-p-1 {
    font-size:22rpx;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(34,34,34,1);
    text-align: center;
}
.icon-p-2 {
    font-size:18rpx;
    color:rgba(128,128,128,1);
    text-align: center;
}
</style>
