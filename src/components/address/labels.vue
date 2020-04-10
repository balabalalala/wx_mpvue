<template>
<div class="labels">
    <div class="label-desc">标签</div>
    <div class="labels-content">
        <ul>
            <li
                v-for="(label, index) of labels"
                v-if="index < 3"
                @click="update(index)"
                class="label-btn"
                :class="current == index ? 'label-btn-active' : ''"
                :key="index"
            >{{label}}</li>
        </ul>

        <div class="self-label">
            <template v-if="editing">
                <input v-model.trim="selfLabel" maxlength="5" class="label-btn" placeholder-class="label-placeholder" placeholder="请输入标签名称，不超过5个字" />
                <button @click="saveLabel" :class="selfLabel ? 'btn-save-active' : ''" class="label-btn label-btn-save">保存</button>
                <button @click="cancel" class="label-btn">取消</button>
            </template>

            <template v-else-if="selfLabel">
                <button @click="update(lastIndex)" :class="current == lastIndex ? 'label-btn-active' : ''" class="label-btn">{{selfLabel}}</button>
                <button @click="edit" class="label-btn btn-edit">编辑</button>
            </template>

            <template v-else>
                <button @click="toggleEdit" class="label-btn">+</button>
            </template>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['labels', 'current'],
    data() {
        return {
            editing: false,
            prevSelfLabel: '',
            selfLabel: '',
        }
    },
    methods: {
        toggleEdit() {
            this.editing = !this.editing
        },

        saveLabel() {
            this.labels.splice(this.lastIndex, 1, this.selfLabel)
            this.update(this.lastIndex)
            this.toggleEdit()
        },

        cancel() {
            if(this.prevSelfLabel) {
                this.selfLabel = this.prevSelfLabel
            }
            this.toggleEdit()
        },

        edit() {
            this.prevSelfLabel = this.selfLabel
            this.toggleEdit()
        },

        update(index) {
            this.$emit('input', index)
        }
    },

    computed: {
        lastIndex() {
            return this.labels.length - 1
        }
    },

    watch: {
        labels() {
            this.selfLabel = this.labels[this.lastIndex] || ''
        }
    },
}
</script>

<style>
.label-placeholder {
    color: #ccc;
}
</style>

<style scoped>
.labels {
    margin-top: 20rpx;
    color: rgb(25,25,25);
    padding: 40rpx 30rpx;
}

.labels-content {
    overflow: hidden;
    padding-left: 26rpx;
}

.label-desc {
    float: left;
}

.self-label {
    margin-top: 16rpx;
}

.self-label input {
    min-height: 0;
    box-sizing: border-box;
    width: 325rpx;
    text-align: left;
    padding-left: .5em;
    margin-right: 0;
}

.label-btn-save {
    background: #ccc;
    margin-left: -3rpx;
}

.btn-save-active {
    background-color:#dc3538;
    color: #fff;
    border: none;
}

.btn-edit, .btn-save {
    min-width: 0;
    width: 66rpx;
    border: none;
    color: #fff;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.btn-edit {
    background-color: #808080;
    margin-left: -26rpx;
}
</style>