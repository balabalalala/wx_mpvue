<template>
<ol class="tabs">
    <li
        v-for="(text, index) of texts"
        @click="onClick(index, text)"
        :key="index"
        :class="{active: current===index}"
    >{{text}}</li>
</ol>
</template>

<script>
export default {
    data() {
        return {
            current: 0
        }
    },
    props: ['texts'],
    methods: {
        onClick(index, text) {
            this.current = index
            this.$emit('click', index, text)
        }
    }
};
</script>

<style scoped>
.tabs {
    padding: 0 100rpx;
    text-align: center;
    font-size: 28rpx;
    line-height: 85rpx;
    border-bottom: 1px solid #f1f1f1;
}

.tabs li {
    display: inline-block;
    width: 33%;
}

.active {
    color:#dc3538;
    position: relative;
}

.active::after {
    content: '';
    position: absolute;
    width: 2em;
    border-top: 5rpx solid;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
</style>
