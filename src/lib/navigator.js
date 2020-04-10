import _ from 'underscore'
import qs from 'qs'

export default {
    // 获取栈中的某个页面，默认当前页
    page(page) {
        const  pages = getCurrentPages()
        page = page || pages.length - 1

        return pages[page]
    },
    prev() {
        const  pages = getCurrentPages()

        if(pages.length === 1) return null

        return pages[pages.length - 2]
    },
}
