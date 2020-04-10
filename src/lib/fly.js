import Fly from "flyio/dist/npm/wx"


const fly = new Fly()
// 获取token专用
const flyToken = new Fly()



fly.config.baseURL = `https://${process.env.NODE_ENV == 'development' ? 'dev' : 'www'}.xiaohongchun.com.cn`
fly.config.headers['refer'] = 'app'


flyToken.config = fly.config

export {
    fly, flyToken
}
