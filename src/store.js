import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import addresses from '@/pages/address_list/store'
import idcards from '@/pages/idcard_list/store'
import disclosure from '@/pages/disclosure/store'
import orderConfirm from '@/pages/order_confirm/store'

Vue.use(Vuex)

const store = new Vuex.Store({
    // plugins: [createLogger()],

    state: {
        address: null,

        showToast: false,

        toastMsg: '',

        showAuth: false,

        authName: '',

        place: '',

        word: '',
        searchWord: '',

        jumpMobilePhonePage: false,
        
        appInstallStatus: '',

        showIndexSelectBox: false
    },

    mutations: {
        setAddress(state, address) {
            state.address = address
        },

        reset(state) {
            state.address = null
        },

        setToast(state, show) {
            state.showToast = show
        },
        setToastMsg(state, msg) {
            state.toastMsg = msg
        },
        toggleAuth(state) {
            state.showAuth = !state.showAuth
        },
        setAuthName (state, data) {
            state.authName = 'auth_' + data
        },

        setPlace(state, place) {
            state.place = place
        },

        setWord(state, word) {
            state.word = word
        },
        setSearchWord(state, searchWord) {
            state.searchWord = searchWord
        },

        setJumpStatus(state) {
            state.jumpMobilePhonePage = !state.jumpMobilePhonePage
        },
        
        setAppInstallStatus(state, status) {
            state.appInstallStatus = status
        },

        setShowIndexSelectBox(state, status) {
            state.showIndexSelectBox = status
        }
    },

    modules: {
        addresses,
        idcards,
        disclosure,
        orderConfirm
    },

    getters: {
        address: state => state.address,
        showIndexSelectBox: state => state.showIndexSelectBox
    },

    strict: process.env.NODE_ENV !== 'production'
})

Vue.prototype.$store = store

export default store


