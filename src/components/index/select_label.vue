<template>
    <div 
        :class="['select-label-container',isAndroid ? 'android-fixed' : isTabListFixed ? 'fixed' : '']"
        id="channelBox">
        <div class="select-top">
            <div 
                class="selected-box classify-box" 
                :data-name="!showClassifyBox ? 'home_filter_category_click' : '' " 
                @click="unfoldTabsBox('classify')"
                >
                <div v-if="selectedClassify" class="classify">{{selectedClassify.title}}</div>
                <div :class="['arrow', showClassifyBox ? 'arrow-top' : 'arrow-bottom']"></div>
            </div>
            <div 
                class="selected-box mall-box" 
                :data-name="!showMallBox ? 'home_filter_store_click' : '' " 
                @click="unfoldTabsBox('mall')"
                >
                <template v-if="selectedMall[0]">
                    <p  
                        v-for="(mall, index) in selectedMall"
                        :key="index"
                        class="classify"
                        >
                        {{mall.title}}
                    </p>
                </template>
                <div class="arrow-box">
                    <div :class="['arrow', showMallBox ? 'arrow-top' : 'arrow-bottom']"></div>
                </div>
            </div>
        </div>
        <!-- 展开框 --> 
        <div class="tabs-box" v-if="showClassifyBox || showMallBox">
            <template v-if="currentTabs.length">
                <p 
                    v-for="(item, index) in currentTabs" 
                    :key="index"
                    :class="[
                        'single-label', 
                        showClassifyBox ?
                        'limit-width' :
                        'auto-width',
                        item.checked ? 
                        'red-color' : 
                        '',
                        item.checked && showMallBox && index ?
                        'close-icon' :
                        '']"
                    @click="changeSelectedLabel(index)">
                    {{item.title}}
                </p>
            </template>
            <div class="complete-btn" v-if="showMallBox" @click="completeEvent">确认</div>
            <div :class="['arrow-tabs', showClassifyBox ? 'arrow-white-left' : 'arrow-white-right']"></div>
        </div>
        <!-- 透明蒙层 -->
        <div v-if="showClassifyBox || showMallBox" class="transparent-mask" @click="hideBox" ></div>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
export default {
    props: {
        homeMalls: {
            type: Array,
            default: [
                {
                    title:'全部商城',
                    checked: true 
                }
            ]
        },
        newChannels: {
            type: Array,
            default: [
                {
                    title:'全部分类',
                    checked: true 
                } 
            ]
        },
        currentMall: {
            type: Array,
            default: []
        },
        currentChannel: {
            type: Object,
            default: null
        },
        isTabListFixed: {
            type: Boolean,
            default: false
        },
        isAndroid: {
            type: Boolean,
            default: false
        },
        hideSelectedBox: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showClassifyBox: false,  //选择分类
            showMallBox: false, //选择商城
            currentTabs: this.newChannels, //展开框里的内容  分类or商城
            selectedClassify: this.currentChannel ,  //左边分类选中的内容
            selectedMall: this.currentMall , //右边选中的商城
        }
    },
    computed: {
        ...mapGetters(['showIndexSelectBox']),
        onlyTwoSelectedMall () {
            if(this.selectedMall.length > 2) return [this.selectedMall[0], this.selectedMall[1]]
            return this.selectedMall
        }
    },
    watch: {
        hideSelectedBox(newVal) {
            if(newVal && (this.showClassifyBox || this.showMallBox)) this.showClassifyBox = this.showMallBox = false
            this.$emit('changeHideEvent')
            this.reviseSelectMall()
        },
        showClassifyBox (newVal) {
            this.$emit('filterBoxChange', {status: newVal})
        },
        showMallBox (newVal) {
            this.$emit('filterBoxChange', {status: newVal})
        }
    },
    methods: {
        ...mapMutations(['setShowIndexSelectBox']),
        reviseSelectMall() {
            let selected = this.selectedMall.length > 1 || (this.selectedMall[0] && this.selectedMall[0].type != 'all')
            let mallStorage = wx.getStorageSync('select_mall')
            this.homeMalls.forEach(allItem => {
                if(!mallStorage) {
                    allItem.checked = false
                    this.homeMalls[0].checked = true
                    return
                }
                if(mallStorage.some(item => item.title == allItem.title)) {
                    allItem.checked = true
                } else {
                    allItem.checked = false
                }
            })
            if(!mallStorage) return this.selectedMall = [this.homeMalls[0]]
            if(mallStorage.length != this.selectedMall.length) return this.selectedMall = mallStorage
            let isSame = this.selectedMall.every(item => {
                return mallStorage.some(storItem => storItem.title == item.title)
            })
            if(!isSame) this.selectedMall = mallStorage
            
        },
        changeSelectedLabel (index) {
            if(this.showClassifyBox) { 
                this.newChannels[index].checked = true
                this.newChannels.forEach((item, itemIndex) => {
                    if(itemIndex != index && item.checked) item.checked = false 
                })
                this.selectedClassify = this.newChannels[index] 
                this.showClassifyBox = false
                this.reviseSelectMall()
                this.$emit('search', this.selectedClassify, this.selectedMall)
            } else {
                this.homeMalls[index].checked = !this.homeMalls[index].checked
                if(index) {
                    this.homeMalls[0].checked = false
                } else {
                    this.homeMalls.forEach((item, itemIndex) => {
                        if(itemIndex && item.checked) item.checked = false
                    })
                }
                let selected = this.homeMalls.filter(item => item.checked)
                if(!selected.length) this.homeMalls[0].checked = true
                // 去掉全部选择后改为全部商城逻辑
                // if(selected.length == this.homeMalls.length - 1) {
                //     this.homeMalls.forEach((item, itemIndex) => {
                //         if(itemIndex && item.checked) item.checked = false
                //         if(!itemIndex) item.checked = true
                //     })
                // }
                this.selectedMall = this.homeMalls.filter(item => item.checked)
            }
        },
        unfoldTabsBox (type) {
            this.showClassifyBox = type == 'classify' && !this.showClassifyBox
            this.showMallBox = type == 'mall' && !this.showMallBox
            this.currentTabs = type == 'classify' ? this.newChannels : this.homeMalls
            this.setShowIndexSelectBox(this.showClassifyBox || this.showMallBox)
        },
        completeEvent () {
            this.showMallBox = this.showClassifyBox = false
            this.$emit('search', this.selectedClassify, this.selectedMall)
            if(this.selectedMall.length == 1 && this.selectedMall[0].type == 'all') {
                wx.getStorageSync('select_mall') && wx.removeStorageSync('select_mall')
            } else {
                wx.setStorage({
                    key: 'select_mall',
                    data: this.selectedMall
                })
            }
        },
        hideBox() {
            this.showClassifyBox = this.showMallBox = false
        }
    }
}
</script>

<style scoped>
.select-label-container {
    box-sizing: border-box;
    width: 100%;
    padding: 20rpx 0;
    background-color: #F5F5F5;
    position: relative;
}
.select-top {
    padding: 0 10rpx 0 30rpx;
    display: flex;
    justify-content: space-between;
}
.selected-box {
    box-sizing: border-box;
    flex: 1;
    padding-left: 21rpx;
    height: 65rpx;
    margin-right: 20rpx;
    background:rgba(255,255,255,1);
    border: 1rpx solid rgba(29, 27, 25, 1);
    position: relative;
    display: flex;
}
.classify-box {
    flex-direction: column;
    justify-content: center;
}
.arrow-box {
    position: absolute;
    top: 50%; 
    transform: translateY(-50%);
    height: 44rpx;
    right: 0;
    width: 48rpx;
    /* border-right: 1rpx solid rgba(29, 27, 25, 1);   */
    background-color: #fff;
    z-index: 2;
}
.arrow {
    position: absolute;
    top: 50%;
    right: 20rpx;
    width: 0;
    height: 0;
    border-width: 8rpx;
}
.arrow-tabs {
    position: absolute;
    top: -20rpx;
    width: 0;
    height: 0;
    /* border-width: 10rpx; */
    border-width: 12rpx;
}
.arrow-bottom {
    transform: translateY(-4rpx);
    border-color: #1D1B19 transparent transparent transparent;
    border-style: solid dashed dashed dashed;
}
.arrow-top {
    transform: translateY(-12rpx);
    border-color: transparent transparent #1D1B19 transparent;
    border-style: dashed dashed solid dashed;
}
.arrow-white-left {
    left: 50rpx;
    border-color: transparent transparent #fff transparent;
    border-style: dashed dashed solid dashed;
}
.arrow-white-right {
    left: 55%;
    transform: translateX(-10rpx);
    border-color: transparent transparent #fff transparent;
    border-style: dashed dashed solid dashed;
}
.mall-box {
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    padding-right: 40rpx;  
    position: relative;
    border: none;
}
.mall-box::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* height: 63rpx; */
    bottom: 0;
    z-index: 2;
    border: 1rpx solid rgba(29, 27, 25, 1);
}
.classify {
    width: max-content;
    min-width: 64rpx;
    margin-right: 10rpx;
    padding: 0 12rpx;
    height: 44rpx;
    line-height: 44rpx;
    background: #F5F5F5;
    text-align: center;
    font-size: 24rpx;
    font-weight: 500;
    color: #1D1B19;
}
.tabs-box {
    box-sizing: border-box;
    margin-top: 10rpx;
    padding: 40rpx 0 35rpx 30rpx;
    width: 100%;
    min-height: 214rpx;
    background:rgba(255,255,255,1);
    box-shadow: 0 5rpx 16rpx 0 rgba(36,34,31,0.2);
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    position: absolute;
    top: 95rpx;
    z-index: 9;
}
.single-label {
    margin: 0 14rpx 16rpx 0;
    height: 44rpx;
    line-height: 44rpx;
    background:rgba(245,245,245,1);
    font-size: 24rpx;
    font-weight: 500;
    color:rgba(29,27,25,1);
    position: relative;
}
.limit-width {
    width: 124rpx;
    text-align: center;
}
.auto-width {
    width: max-content;
    padding: 0 14rpx;
}
.red-color {
    color: #D03436;
    /* background-color: #000; */
}
.close-icon::before {
    content: 'x';
    position: absolute;
    top: -14rpx;
    right: 5rpx;
    color: #808080;
    font-size: 16rpx;
}
.complete-btn {
    position: absolute;
    bottom: 40rpx;
    right: 30rpx;
    width: 90rpx;
    height: 50rpx;
    line-height: 50rpx;
    border: 1rpx solid rgba(0, 0, 0, 1);
    font-size: 24rpx;
    font-weight: 600;
    color:rgba(29,27,25,1);
    text-align: center;
}
.android-fixed {
    position: -webkit-sticky;
    position: sticky;
    top: 80rpx;
    left: 0;
    right: 0;
    z-index: 9;
}
.fixed {
    position: fixed;
    top: 96rpx;
    left: 0;
    background-color: #F5F5F5;
    z-index: 9;
}
.ellipsis-icon {
    position: absolute;
    top: 50%;
    right: 40rpx;
    color: #000;
    font-size: 30rpx;
}
.transparent-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
}
</style>
