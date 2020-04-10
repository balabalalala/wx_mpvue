<template>
    <ul class="cotainer">
        <li data-name="all" :class="allClass" @click="showData" data-id="1" data-classtype="allClass">全部 {{all}}</li>
        <li data-name="categorys" :class="categorysClass" @click="showData" data-id="2" data-classtype="categorysClass">分类 {{categorys}}</li>
        <li data-name="goods" :class="goodsClass" @click="showData" data-id="3" data-classtype="goodsClass">商品 {{goods}}</li>
        <li data-name="labels" :class="labelsClass" @click="showData" data-id="4" data-classtype="labelsClass">标签 {{labels}}</li>
    </ul>
</template>

<script>
    export default {
        props: ['all', 'categorys', 'goods', 'labels', 'allClass', 'categorysClass', 'goodsClass', 'labelsClass'],
        methods: {
            showData(event) {
                let id = parseInt(event.currentTarget.dataset.id)
                let classtype = event.currentTarget.dataset.classtype
                this.$emit("fetch",{id: id, classtype: classtype})
            }
        }
    }
</script>

<style scoped>
    .cotainer{
        height: 83rpx;
        display: flex;
        padding: 0 50rpx;
        justify-content: space-between;
    }
    .cotainer li{
        font-size:30rpx;
        font-weight:600;
        color:rgba(128,128,128,1);
        display: inline-block;
        line-height: 83rpx;
    }
    .cotainer .current{
        color:#dc3538;
        border-bottom: 4rpx solid#dc3538;
    }
</style>
