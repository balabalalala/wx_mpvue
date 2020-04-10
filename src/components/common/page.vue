<template>
<form report-submit='true' @submit="formSubmit">
    <button formType="submit" class="form-button" hover-class="none">
        <slot></slot>
    </button>
</form>
</template>

<script>
    export default {
        mounted() {
            console.log('mounted');
        }
    }
</script>

<style></style>