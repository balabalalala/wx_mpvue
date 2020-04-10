Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    properties: {
        cancelText: {
            type: String,
            value: '取消'
        },
        confirmText: {
            type: String,
            value: '确认'
        },
        showCancel: {
            type: Boolean,
            value: false
        },
        showConfirm: {
            type: Boolean,
            value: true
        },
        img: {
            type: String,
            value: ''
        },
        width: {
            type: String,
            value: '90%'
        },
        height: {
            type: Number,
            value: 0
        },
        align: {
            type: String,
            value: 'center'
        },
        pre: {
            type: Boolean,
            value: true
        },
        title: {
            type: String,
            value: ''
        }
    },

    methods: {
        cancel() {
            this.triggerEvent('cancel')
        },
        confirm() {
            this.triggerEvent('confirm')
        },
        onclick() {

        },
        maskClick() {
            this.triggerEvent('maskClick')
        }
    },
})