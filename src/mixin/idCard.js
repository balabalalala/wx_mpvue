import fly from '../lib/http'

export default {
    methods: {
        async fillIdcard(sn, cardid) {
            let res = await this.wx.showModal({
                titel: '',
                content: '是否确定选择这条身份证信息？点击确认后将会直接上传'
            })
    
            if(res.confirm) {
                await fly.put(`/lsj/v1/order/fill_id_card?sn=${sn}&icid=${cardid}`)
            }
        }        
    }
}