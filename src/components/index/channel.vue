<template>
   <div :class="['channel-box',isAndroid ? 'android-fixed' : isTabListFixed ? 'fixed' : '']"  id="channelBox">
        <scroll-view scroll-x="true" class="channel-container" >
          <div
            v-for="(item,index) in channels" :key="index"
            :class="index === current ? 'channel-item channel-active' : 'channel-item'"
            @click="tabClick(index, item)"
            >
            <span :data-name="'tab_'+ item.id">{{item.title}}</span>
          </div>
        </scroll-view>
    </div>
</template>
<script>
  
export default  {
    props: {
        channels: {
            type: Array,
            default: []
        },
        current: {
            type: Number,
            default: 0,
        },
        isTabListFixed: {
            type: Boolean,
            default: false
        },
        isAndroid: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        tabClick (index, item) {
            if (this.current !== index) {
                this.$emit('changeChannel', index, item)
            }
        }
    }
}
</script>

<style scoped>
.channel-box {
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: rgba(255,255,255,1);
    box-sizing: border-box;
    padding: 0 30rpx;
}
.android-fixed {
    position: -webkit-sticky;
    position: sticky;
    top: 80rpx;
    left: 0;
    right: 0;
    z-index: 9;
}
.channel-container {
    line-height: 100rpx;
    white-space: nowrap;
}
.channel-item  {
    text-align: center;
    display:inline-block;
    line-height: 1;
    margin:0 20rpx;
    color: #1A1A1A;
    font-size: 28rpx;
}


.channel-item:last-child {
    margin-right: 50rpx;
}

.channel-active {
    font-size: 32rpx;
    font-weight: 600;
    position: relative;
    color: #000000
}

.channel-active span {
    position: relative;
    z-index: 9;
}

.channel-active::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3rpx;
    height: 10rpx;
    background: linear-gradient(-13deg,rgba(253,49,72,1),rgba(255,110,56,1),rgba(255,142,57,1));
    box-shadow:0px 0px 10rpx rgba(253,72,51,0.35);
    z-index: 9;
    border-radius: 3rpx;
    opacity: .8;
}
.fixed {
    position: fixed;
    top: 80rpx;
    left: 0;
    background-color: rgba(255,255,255,1);
    z-index: 9;
  }
</style>