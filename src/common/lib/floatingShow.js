export default function floatingShow() {
    return Date.now() > Number(wx.getStorageSync('sigin_timeout'))
}