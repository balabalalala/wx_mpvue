<template>
<div v-if="floatImg" 
     data-name="home_float"
     :data-path="floatPath"
     :class="[fadeOut ? 'floatContainer2' : '', 'floatContainer']"
     @click='toPage'
     :style="{backgroundImage:'url(' + floatImg + ')'}">
</div>
</template>

<script>
import moment from 'moment'
import _ from 'underscore'
import nav from '@/lib/navigator'
import {getKeyByUrl} from '@/common/lib/pages'
import fly from "@/lib/http"
import floatingShow from '../../common/lib/floatingShow'

export default {
    data() {
        return {
            floatInfo: []
        }
    },
    props: {
        fadeOut: Boolean
    },

    methods: {
        toPage () {
            wx.navigateTo({
                url: this.currentFloat.path,
                success: () => {
                    if(this.floatInfo.length != 1) {
                        this.floatInfo.shift()
                        wx.setStorageSync('float_num', this.floatInfo.length)
                    }
                }
            })
        },

        getType() {
            let type = ''
            switch(getKeyByUrl(nav.page().route)) {
                case 'home':
                    type = 2
                    break
                case 'disclosure':
                    type = 5
                    break
                case 'new_red_envelope':
                    type = 11
                    break
                default:
                    type = 2
                    break
            }
            return type
        }
    },
    computed: {
        currentFloat () {
            return this.floatInfo.length && this.floatInfo[0]
        },
        floatImg () {
            return this.currentFloat && this.currentFloat.img
        },
        floatPath () {
            return this.currentFloat && this.currentFloat.path
        }  
    },
    created () {
        fly.get('/lsj/v3/misc/float_window?type=' + this.getType()).then(resp => {
            this.floatInfo = resp.data
            if(floatingShow()) {
                wx.setStorageSync('sigin_timeout', moment().endOf("day").valueOf())
                wx.setStorageSync('float_num', this.floatInfo.length)
                return
            }
            let floatNum = this.floatInfo.length - wx.getStorageSync('float_num')
            this.floatInfo.splice(0, floatNum)
        })
    }
}
</script>

<style>
.floatContainer {
    position: fixed;
    bottom: 250rpx;
    right: 24rpx;
    width: 150rpx;
    height: 150rpx;
    z-index: 10;
    transition: right .3s;
    text-align: center;
    background-origin: 0 0;
    background-repeat: no-repeat;
    background-size: contain;
}
.floatContainer2 {
    right: -57rpx;
    filter: opacity(.5);
}

.ipx .floatContainer {
    bottom: 330rpx;
}
</style>
