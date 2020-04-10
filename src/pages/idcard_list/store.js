import _ from 'underscore'
import fly from "@/lib/http"

export default {

    namespaced: true,

    state: {
        idcards: []
    },

    mutations: {
        setIdcards(state, idcards) {
            state.idcards = idcards
        },

        delete({idcards}, id) {
            const index = _.findIndex(idcards, idcard => idcard.id === id)

            if(index !== -1) {
                idcards.splice(index, 1)
            }
        }
    },

    actions: {
        async list({commit}) {
            const resp = await fly.get('/lsj/v1/idcard/my')

            commit('setIdcards', resp.data.data)
        },

        async delete({commit}, id) {
            if(!id) return

            fly.delete('/lsj/v1/idcard/detail?ocr_id=' + id)
                .then(() => commit('delete', id))
                .catch(e => console.error(e))
        }
    }
}