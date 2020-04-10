// https://github.com/michael-ciniawsky/postcss-load-config

// module.exports = {
//   "plugins": {
//     "postcss-mpvue-wxss": {}
//   }
// }
module.exports = (ctx) => ({
  plugins: [
    require('postcss-mpvue-wxss'),
    require('autoprefixer')
  ]
})