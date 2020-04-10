<template>
    <form report-submit='true' @click="onclick" @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <cabbage-label :tagInfo="tagInfo"/>
            <ul v-if="cabbageList.length">
                <li v-for="(item, index) in cabbageList" :key="index">
                    <p class="good-price" v-if="cabbageList[index] && cabbageList[index].detail == '1'">以下历史价格仅供参考，购买时请注意核实哦</p>
                    <goods v-else
                        :goodsType="1"
                        :buyStatus="1"
                        :title="item.title"
                        :price="item.v_detail"
                        :imageUrl="item.image_url"
                        :mall="item.mall"
                        :editorDesc="item.editor_rec_desc"
                        :publishTime="item.time_string"
                        :valuePercentage="item.value_percentage"
                        :commentCount="item.comment_count" 
                        :goodsId="item.did || item.aid" />
                </li>
            </ul>
            <loading v-if="isLoading" />
            <index />
        </button>
    </form>
</template>
<script src="./script.js"></script>
<style src="@/style/common.css"></style>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="./style.css" scoped></style>

