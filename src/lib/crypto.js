import __ttc from './ttc_encrypt'
import md5 from 'md5'
import util from './util'
import {AUTH_KEY} from './constant'
const key = "xhc_xcx_20180011"

function deviceId() {
    var time = new Date().getTime().toString(36);
    var uuids = wx.getStorageSync(AUTH_KEY) || util.uuid('-');
    var str = `${time}_${uuids}_${key}`;
    return `${time}_${uuids}_${md5(str)}`;
}

export default function () {
    var ss = Math.random().toString(36).substr(2, 4).split("");
    let device_id = deviceId()
    ss.forEach(s => {
        device_id = device_id.replace('-', s);
    });
    device_id += '_' + (new Date().getTime());

    return __ttc.ttc.encrypt(device_id, key, { type: 1, modes: 0 });
}
