<template>
 <form @click="onclick" report-submit='true' @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div>
            <image class="cabbage-banner" src="https://img-ali.xiaohongchun.com.cn/admin/1557219322681393b9bbb.png"></image>
            <!-- 使用帮助 -->
            <div data-name="cabbage-help" class="help-box" @click="toHelp"></div>
            <template v-if="todayData">
                <today-cabbage :todayData="todayData" />
            </template>
            <template v-if="chosenFetched || outdateFetched">
                <div class="chosen-title">精选白菜</div>
                <div class="fall-container">
                    <fall-card
                        v-for="(item, index) in chosenDataObj"
                        :key="index"
                        :data="item"
                        :width='itemWidth'/> 
                </div>
                <div v-if="outdateFetched" class="update-title">以下历史价格仅供参考，购买时请注意核实哦</div>
                <div class="fall-container">
                    <fall-card
                        v-for="(item, index) in outdateDataObj"
                        :key="index"
                        :data="item"
                        :width='itemWidth'/>
                </div>
            </template>
            <to-index></to-index>
             
        </div>
        <loading v-if="isLoading" />
        <to-top :scrollTop="scrollTop" />
    </button>
</form>
</template>

<script src="./script.js"></script>

<style src="./style.css" scoped></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
