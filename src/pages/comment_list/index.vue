<template>
<form :class="{ipx: isIPX}" report-submit='true' @click="onclick" @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <div style="position: relative;z-index: 1;">
            <comment v-if="isShowComment" :id="eid" :eType="eType" :isAll="1" :allowInteraction="true" ref="commentComponent"/>
        </div>
    </button>
</form>
</template>
<script src="./script.js"></script>
<style src="@/style/form.css"></style>
<style src="@/style/btns.css"></style>
<style src="@/common/style/common.css"></style>