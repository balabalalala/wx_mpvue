const   fs = require('fs'),
        ncp = require('ncp').ncp,
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

    ncp(src, target, err => err && console.log(err))

    console.log(`copy ${name} folder completed`)
}

names.forEach(name => copy(name))