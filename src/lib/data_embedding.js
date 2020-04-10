import fly from './http'

export default {
    async reportShareIncrement(params) {
        let result = await this.report('/lsj/v1/union/share_inc', params)
        return result
    },
    reportShareBack(params) {
        this.report('/lsj/v1/union/share_click_callback', params)
    },
    async report(url, params) {
        let resp = await fly.post(url, params)
        return resp.data
    }
}
