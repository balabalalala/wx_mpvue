import _ from 'underscore'
import URL from 'url'
import qs from 'qs'

import mainPages from '../config/pages/main'
import mpvuePages from '../config/pages/mpvue'
import groupsPages from '../config/pages/groups'
import myPages from '../config/pages/my'

const pages = Object.assign({}, mainPages, mpvuePages, groupsPages, myPages)

function getUrl(page) {
    // 主包  直接返回url
    if(page.package === 'main') {
        return page.url
    }

    // 分包, 加上包名
    return page.package + '/' + page.url
}

export function getUrlByKey(key = '') {
    if(!key || !pages[key]) return ''

    return '/' + getUrl(pages[key])
}

export function getKeyByUrl(url = '') {
    if(!url) return ''

    url = URL.parse(url).pathname

    if(url.substring(0, 1) === '/') {
        url = url.substr(1)
    }
    let entry = _.pairs(pages).find(entry => url === getUrl(entry[1]))
    
    return entry && entry[0]
}

export function getQuery(url) {
    return qs.parse(URL.parse(url).query)
}


export default pages
