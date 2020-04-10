import _ from 'underscore'
import Vue from 'vue'
import qs from 'qs'
import fly from "@/lib/http"
import user from "@/lib/user"

const emptyData = {
    disclosure: {},
    creator: {},
    user: {},
    subscribe_list: {},
    fragment: {},
    specs: {},
    value_of_not: {},
    audit_switch: {},
    comment_show: {},
}

const state = Object.assign(emptyData, {
    recommends: null,
    now: Date.now(),
    modalKey: '',
    isShowSubscribeAlert: false,
    tbkRemind: {
        tb_mark: '商品',
        tbm_mark: '商家App',
        tkl_mark: '链接'
    }
})

export default {

    namespaced: true,

    getters: {
        // 显示秒杀？
        showSecondKill(state) {
            return !!(state.disclosure.seckill && state.now < state.disclosure.endtime_for_buyable)
        },

        // 秒杀是否已开始
        secondKillStarting(state) {
            return state.now > state.disclosure.starttime_for_buyable
        },

        copyLinkNote(state) {
            const copyNotes = {
                copy_coupon: '优惠券链接',
                copy_piece: '凑单品链接',
                // copy_tkl: '商品' + state.tbkRemind.tkl_mark || '链接',
                copy_goods: '商品链接'
            }
            const note = copyNotes[state.modalKey]
            if(!note) {
                return ''
            }
            // 全网商品 copy goods/coupon/piece 
            const tbm_mark = state.tbkRemind.tbm_mark || '商家APP'
            return `已成功复制${note}`
        }
    },

    state: state,

    mutations: {
        setData(state, data) {
            if(_.isEmpty(data)) {
                return
            }

            Object.assign(state, data)
        },

        reset(state) {
            state.disclosure = {}
            state.creator = {}
            state.value_of_not = {}
            state.user = {}
            state.subscribe_list = {}
            state.fragment = {}
            state.specs = {}
            state.modalKey = ''
            state.isShowSubscribeAlert = false
            state.comment_show = {}
        },
        setTbkRemind(state, tbkRemind) {
            state.tbkRemind = tbkRemind
        },
        initIntroducesStates(state) {
            const introduces = JSON.parse(state.disclosure.introduces)
            introduces.forEach(item => item.status = 0)
            state.disclosure.introduces = introduces
        },

        initSpecs(state) {
            const specs = [...state.specs]
            specs.forEach(spec => spec.sku_item.forEach(item => Vue.set(item, 'selected'), false))
            state.specs = specs
        },

        setRecommends(state, data) {
            state.recommends = data
        },

        setCommentCount(state, num) {
            state.comment_show.total += num
        },

        toggleIntroduceStatus(state, title) {
            const introduce = state.disclosure.introduces.find(item => item.title == title)
            introduce.status = 1 ^ introduce.status
        },

        toggleSpectSelect(state, {index, id}) {
            const skus = state.specs[index].sku_item
            skus.forEach(item => item.selected = false)

            const sku = skus.find(item => item.sku_id == id)
            sku.selected = !sku.selected
        },

        toggleSubResult(state, subscribe_obj) {   
            // 重置订阅状态         
            subscribe_obj.result = !subscribe_obj.result
        },

        updateSubscribe(state, {id, subscribe_obj}) {
            // 记录订阅 id
            subscribe_obj.id = id
        },

        toggleUserRemind(state) {
            state.user.remind = !state.user.remind
        },

        toggleCollect(state) {
            const collected = state.user.collected
            const quantity = collected ? -1 : 1
            state.disclosure.collect_count += quantity
            state.user.collected = !collected
        },

        updateNow(state) {
            state.now = Date.now()
        },

        showModal(state, key) {
            state.modalKey = key
        },
        showSubscribeModal(state) {
            state.isShowSubscribeAlert = true
        },
        hideSubscribeModal(state) {
            state.isShowSubscribeAlert = false
        },
        
        hideModal(state) {
            state.modalKey = ''
        }
    },

    actions: {
        async detail({commit}, id) {
            const resp = await fly.get(`/lsj/v3/disclosure/${id}`)
            const misc = await fly.get(`/lsj/v3/misc?key=audit_switch_0926`)
            const audit_switch = misc.data ? misc.data : {prop_value: '1'}
            resp.data.audit_switch = audit_switch
            commit('setData', resp.data)
            commit('initIntroducesStates')
            commit('initSpecs') 
        },
        //相关推荐的数据
        async recommend({commit}, id) {
            const resp = await fly.get(`/lsj/v3/disclosure/recommend/${id}`)
            let recommends = resp.data
            recommends = recommends.map(r => _.pick(r, 'id', 'title', 'editor_rec_desc', 'goods_icon', 'mall', 'v_detail', 'release_time', 'image_url', 'track_info', 'comment_count','value_percentage'))
            commit('setRecommends', recommends)
        },

        // 取消订阅
        unSubscribe({state, commit}, subscribe_obj) {
            fly .delete('/lsj/v3/favorite?id=' + subscribe_obj.id)
                .then(() => {
                    commit('toggleSubResult', subscribe_obj)
                    wx.showToast({
                        title: '取消成功',
                        icon: 'none',
                        duration: 1500
                    })
                })
        },

        // 订阅
        subscribe({commit, state}, subscribe_obj) {
            // state.disclosure.id 如果是爆料 要传详情页最外层的爆料 id
            fly .post('/lsj/v3/favorite', Object.assign({did: state.disclosure.id}, _.pick(subscribe_obj, 'eid', 'e_type')))
                .then(resp => {
                    // resp.data.id 返回订阅 id 用于取消订阅
                    commit('updateSubscribe', {id: resp.data.id, subscribe_obj: subscribe_obj})
                    commit('toggleSubResult', subscribe_obj)
        
                    const today = new Date()
                    const todayModalVal = today.getFullYear()+ "-" + (today.getMonth()+1) + "-" + today.getDate()
                    const todayModalKey = 'subscribed_install_modal'
                    const todayModalstore = wx.getStorageSync(todayModalKey)
                    
                    if(!todayModalstore || (todayModalstore && todayModalstore !== todayModalVal)) {
                        commit('showSubscribeModal')
                        wx.setStorage({key: todayModalKey, data: todayModalVal })
                    }
                    else {
                        wx.showToast({
                            title: '订阅成功',
                            icon: 'none',
                            duration: 1500
                        })
                    }
                })
        },

        // 秒杀提醒
        toggleUserRemind({commit, state}) {
            fly.post('/lsj/v3/activity/switch_notify', {
                e_type: 1,
                eid: state.disclosure.id,
                enable: state.user.remind ? 0 : 1
            }).then(() => commit('toggleUserRemind'))
        },

        // 收藏
        collect({commit, state}) {
            if(!user.isLogin()) {
                commit('setAuthName', 'collect')
                return commit('toggleAuth')
            }
            const did = state.disclosure.id
            const params = {
                did,
                dids: did,
                d_type: state.disclosure.source
            }

            const method = state.user.collected ? 'delete' : 'post'

            fly[method]('/lsj/v3/collection?' + qs.stringify(params))
            commit('toggleCollect')
        },

        // 验证库存
        async validStock({state}, {skuIds, count}) {
            const params = {
                entity_ids: skuIds,
                buy_count: count,
                did: state.disclosure.id
            }

            const resp = await fly.get('/lsj/v3/disclosure/stock_validate?' + qs.stringify(params))

            return resp.data.result != 'false'
        },

        async addOrder({state}, {selected, count}) {
            const resp = await fly.put('/lsj/v1/order/add', {
                did: state.disclosure.id,
                skuList: selected.map(sku => sku.sku_id),
                num: count
            })

            return resp.data
        },

        async match({state}, sn) {
            const resp = await fly.get(`/lsj/v1/order/match?sn=${sn}`)
            return resp.data
        }

    }
}