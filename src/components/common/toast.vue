<template>
<div v-if="showToast" class="msg">{{toastMsg}}</div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    computed: {
        ...mapState(['showToast', 'toastMsg'])
    }
}
</script>

<style scoped>
.msg {
    position: fixed;
    line-height: 1.3;
    font-size: 28rpx;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(1, 1, 1, .7);
    max-width: 80%;
    color: #fff;
    padding: .8em;
    border-radius: 4rpx;
    width: max-content;
    z-index: 100;
    white-space: pre-wrap;
    text-align: center;
}
</style>