const icons = {
    share: 'https://img-ali.xiaohongchun.com.cn/admin/153190243155810752169.png',  // 分享
    collect: 'https://img-ali.xiaohongchun.com.cn/admin/157112480514982cd4e4.png', // 收藏
    collected: 'https://img-ali.xiaohongchun.com.cn/admin/15711248140692d6c912a.png', // 已收藏
    friendsCircle: 'https://img-ali.xiaohongchun.com.cn/admin/153190245154732528c8c.png', // 朋友圈
    comment: 'https://img-ali.xiaohongchun.com.cn/admin/156517370961114f7febc.png',//评论

    bg(key) {
        if(!this[key]) {
            return ''
        }

        return `url(${this[key]})`
    }
}

export default icons