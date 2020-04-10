import _ from 'underscore'
import fly from "@/lib/http"

export default {

    namespaced: true,

    state: {
        addresses: [],
    },

    mutations: {
        setAddress(state, addresses) {
            state.addresses = addresses
        },

        del({addresses}, id) {
            const index = _.findIndex(addresses, a => a.id === id)

            if(index !== -1) {
                addresses.splice(index, 1)
            }
        }
    },

    actions: {
        async fetchList({commit}) {
            const resp = await fly.get('/lsj/v3/address/list')

            commit('setAddress', resp.data)
        },

        delAddress({commit}, id) {
            fly .delete(`/lsj/v1/user/address/${id}`)
                .then(() => commit('del', id))
                .catch(e => console.error(e))
        },

        async addOrUpdate({dispatch}, params) {
            const id = params.id || ''
            const method = params.id ? 'put' : 'post'
            const url = '/lsj/v3/address/' + id

            let resp = await fly[method](url, params)

            return resp.data.id
        }
    }
}