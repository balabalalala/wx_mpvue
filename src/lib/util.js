export default {
    timeFormatDate(timestamp) {
        var date = new Date(parseInt(timestamp));
        var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
        var time = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}:${minutes}:${seconds}`;
        return time;
    },

    uuid(spliter = '') {
        const template = `xxxxxxxx${spliter}xxxx${spliter}xxxx${spliter}xxxx${spliter}xxxxxxxxxxxx`;
        let date = new Date().getTime();
        return template.replace(/[xy]/g, function (c) {
            const r = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },
    timeFormat(timestamp) {
        const secondInADay = 24 * 3600 * 1000;
        var date = new Date(timestamp);
        var secondInDate = timestamp % secondInADay;
        var nowDate = new Date();
        var displayMinutes = date.getMinutes();
        displayMinutes = (displayMinutes < 10 ? '0' : '') + displayMinutes;

        if (nowDate.getTime() - timestamp < (secondInADay - secondInDate))
            return (`${date.getHours()}:${displayMinutes}`);
        else if (nowDate.getTime() - timestamp < (secondInADay * 2 - secondInDate))
            return ('昨天');
        else if (nowDate.getTime() - timestamp < (secondInADay * 3 - secondInDate))
            return ('前天');
        else
            return (`${date.getMonth() + 1}-${date.getDate()}`);
    },
    formatDate(time,pattern = 'yyyy-MM-dd hh:mm') {
        if(!time) return
        let date = new Date(time);
        function formatdate(date, fmt) {
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
                }
            }
            return fmt;
        }
        function padLeftZero(str) {
            return ('00' + str).substr(str.length);
        }
        return formatdate(date, pattern);
    },
    beautySub(str, len) {
        var reg = /[\u4e00-\u9fa5]/g,
            slice = str.substring(0, len),
            chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
            realen = slice.length * 2 - chineseCharNum;
        return str.substr(0, realen) + (realen < str.length ? "..." : "");
    }
}
