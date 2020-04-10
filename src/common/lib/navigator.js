import qs from 'qs'
import _ from 'underscore'

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
    reload() {
        console.log('222222');
        
        const page = this.page()
        let url = '/' + this.page().route
        console.log(url);
        
    
        if(!_.isEmpty(page.options)) {
          url += `?${qs.stringify(page.options)}`
        }
        console.log(url);
        wx.reLaunch({url})
    }
}
