<template>
    <form @click="onclick" report-submit='true' @submit="formSubmit">
        <button formType="submit" :class="['form-button', isAndroid ? 'sticky-button' : '']" hover-class="none">
            <auth />
            <search-bar :searchText="searchText"/>
             <select-label 
                v-if="!isAndroid && isTabListFixed"
                :isTabListFixed="isTabListFixed"
                :isAndroid="isAndroid"
                :hideSelectedBox="hideSelectedBox"
                :newChannels="newChannels"
                :homeMalls="homeMalls"
                @search="search"
                @filterBoxChange = "filterBoxChange"
                @changeHideEvent="changeHideEvent" />
            <banner :topImgs="topBanner" :bottomImgs="bottomBanner"/>
            <ranking-list :rankTitle="rankTitle" :goodsList="rankGoodsList" />
            <template v-if="newChannels.length">
                <select-label 
                    v-if="!isTabListFixed"
                    :isTabListFixed="isTabListFixed"
                    :isAndroid="isAndroid"
                    :newChannels="newChannels"
                    :homeMalls="homeMalls"
                    :currentChannel="currentNewChannel"
                    :currentMall="currentMalls"
                    :hideSelectedBox="hideSelectedBox"
                    @search="search"
                    @filterBoxChange="filterBoxChange"
                    @changeHideEvent="changeHideEvent"  />
                <div v-show="isTabListFixed && !isAndroid" :style="'width:100%;height:' + selectPlaceholderHeight + 'px'"></div> 
            </template>
            <ul v-if="null != goodsList && goodsList.length > 0" class="ul-goods-container">
                <li class="li-goods-container" v-for="(item, index) in goodsList" :key="index">
                    <goods
                        :buyStatus="item.buy_status"
                        :goodsType="item.type"
                        :title="item.title"
                        :price="item.v_detail"
                        :imageUrl="item.image_url"
                        :mall="item.mall"
                        :editorDesc="item.editor_rec_desc"
                        :publishTime="item.time_string"
                        :goodsId="item.did || item.aid"
                        :icon="item.goods_icon"
                        :trackInfo="item.track_info"
                        :toTop="item.roof_placement_status"
                        :toTopImg="item.roof_placement_image"
                        :commentCount="item.comment_count"
                        :valuePercentage="item.value_percentage" />
                </li>
            </ul>
            <div v-if="null != goodsList && goodsList.length == 0" style="text-align:center;">
                <img style="width:750rpx;height:230rpx;" src="https://img-ali.xiaohongchun.com.cn/admin/15681096359396caf0bc.png"/>
            </div>
            <!-- 首页弹窗 -->
            <popup-windows v-if="modalShow && audit_switch != '0'" :alertData="alertData" @modalShowHandle="modalShowHandle" /> 
            <!-- 首页浮窗 -->
            <float v-if="isShowFloatWindow && audit_switch != '0'"  :fadeOut="fadeOut"/>
            <loading v-if="isLoading" />
            <to-top :scrollTop="scrollTop" />
            <no-goods v-if="noMoreData"/>
            <collect-toast  v-if="isCollcetToastShow" :toastText="isCollcetToastText" />
        </button>
    </form>
</template>


<script src="./script.js"></script>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="./style.css" scoped></style>
<style src="@/common/style/common.css"></style>
