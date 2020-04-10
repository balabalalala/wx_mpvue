const   fs = require('fs'),
        ncp = require('recursive-copy'),
        chokidar = require('chokidar'),
        { promisify } = require('util'),
        path = require('path'),
        wepyRoot = path.join(__dirname, '../../tt-wx-app'),
        mpVueRoot = path.join(__dirname, '..'),
        names = ['static', 'pages', 'components']


async function copy(name) {
    const src = mpVueRoot + `/dist/${name}`;
    const target = wepyRoot + `/dist/${name}`;

    const exists = await promisify(fs.exists)(target);

    if (!exists) {
        fs.mkdirSync(target);
    }

    ncp(src, target, {overwrite: true}).catch(err => console.error(err))
}

names.forEach(name => {
    chokidar.watch(mpVueRoot + `/dist/${name}`, { persistent: true }).on('all', (event, path) => {
        if (event === 'add' || event === 'change') {
            const target = path.replace('wxapp-mpvue', 'tt-wx-app')
            ncp(path, target, {overwrite: true}, err => err && console.log(err))
        }
    })
})

function syncPages() {
    let vuePages = require(mpVueRoot + '/dist/app.json')
    let pages = vuePages.pages.map(page => {
        let key = page.match(/\/(.+)\//)[1]
        let o = {}
        o[key] = {
            url: page,
            desc: key,
            package: 'main'
        }
        return o
    })

    pages = Object.assign({}, ...pages)
    fs.writeFileSync(mpVueRoot + '/src/common/config/pages/mpvue.js', "module.exports = " + JSON.stringify(pages, null, 4), 'utf8');
}

chokidar.watch(mpVueRoot + '/dist/app.json', { persistent: true }).on('change', syncPages)
