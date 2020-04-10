import _ from 'underscore'

import utils from "@/common/lib/utils"
import mixin from "@/mixin/mixin"
import jump from '@/common/lib/jump'
import nav from '@/common/lib/navigator'
import fly from "@/lib/http"
import {getKeyByUrl} from '@/common/lib/pages'

export default {
    data() {
        return {
            agree: true,
            positive: '', // 正面
            negative: '', // 反面
            ocr_id: '',
            name: '',
            card_id: '',

            isEdit: false, // 是否是编辑身份证
            isEncrypt: false //是否存过照片
        }
    },

    mixins: [mixin],

    methods: {
        async save() {
            this.validate()

            if(!this.valid) return

            if(!/^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(this.card_id)) return this.toast('身份证号码无效')

            await this.update()

            this.$store.dispatch('idcards/list')
            getApp().globalData.events.trigger('idcard:change', this.ocr_id)
            this.wx.navigateBack({delta: 1 })
        },

        validate() {
            if(!this.agree) return this.toast('请先同意身份证上传协议')

            if(!this.positive) return this.toast('请上传正面身份证照片')

            if(!this.negative) return this.toast('请上传反面身份证照片')

            if(!this.name) return this.toast('请输入姓名')


        },

        async upload(key) {
            const img = await this.wx.chooseImage({count: 1})

            this.wx.showLoading({title: '上传中...'})

            const sign = await fly.get('/lsj/v1/get_sign?num=1').catch(e => console.log(e))

            const resp = await this.uploadToWX(img.tempFilePaths[0], sign.data[0])

            this[key] = JSON.parse(resp.data).data.resource_path.replace(/^(\/.*?){2}\//, 'http://s.xiaohongchun.com.cn/')

            this.wx.hideLoading()

            await this.add()

            await this.pollingStatus()
        },

        async uploadToWX(filepath, sign) {
            return this.wx.uploadFile({
                url: `https://tj.file.myqcloud.com/files/v2/1252313296/xcximage${sign.filename}`,
                filePath: filepath,
                name: 'filecontent',
                header: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: sign.sign
                },
                formData: {'op': 'upload'}
            })
        },

        async add() {
            if(!this.positive || !this.negative) return

            const resp = await fly.post('/lsj/v1/idcard/add', this.params)

            this.ocr_id = resp.data.ocr_id
        },

        async update() {
            await fly.post('/lsj/v1/idcard/update?ocr_id=' + this.ocr_id, this.params)
        },

        async pollingStatus() {
            if(!this.positive || !this.negative) return

            this.wx.showLoading({title: '识别中...'})

            let resp = await fly.get(`/lsj/v1/idcard/detail?ocr_id=${this.ocr_id}`)
            resp = resp.data

            switch(resp.status) {
                case 'Pending':
                    return setTimeout(this.pollingStatus, 2000)
                    break
                case 'Success':
                    this.name = resp.name
                    this.card_id = resp.card_id
                    break
                case 'Fail':
                    this.wx.showModal({
                        title: '天天跟我买',
                        content: '我们无法识别您的身份证，请手动填写姓名和身份证号!',
                        showCancel: false
                    })
                    break
            }

            this.wx.hideLoading()
        },

        async detail() {
            if(!this.ocr_id) return

            let resp = await fly.get('/lsj/v1/idcard/' + this.ocr_id)
            resp = resp.data.result

            if(resp.frontImageUrl) this.isEncrypt = true

            this.positive = resp.frontImageUrl
            this.negative = resp.backImageUrl
            this.name = resp.fullName
            this.card_id = resp.cardId
        },

        reUploadImg () {
            this.isEncrypt = false
            this.positive = ''
            this.negative = ''
        }
    },

    computed: {
        valid() {
            return _.chain(this)
                    .pick('positive', 'negative', 'name', 'card_id')
                    .values()
                    .every(val => val)
                    .value()
        },
        params() {
            return {
                front_image_url: this.positive,
                back_image_url: this.negative,
                name: this.name,
                card_id: this.card_id,
                ocr_id: this.ocr_id,
            }
        },

        encrypt() {
            return this.card_id.replace(/^(\w{3})\w{11}(.*)$/, '$1***********$2')
        }
    },

    mounted() {
        this.ocr_id = this.$mp.query.id || ''

        if(this.ocr_id) {
            this.isEdit = true
        }

        this.wx.setNavigationBarTitle({
            title: '身份证' + (this.isEdit ? '编辑' : '添加')
        })

        this.detail()
    },

    onUnload() {
        Object.assign(this.$data, this.$options.data())
    }
}