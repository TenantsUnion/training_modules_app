'use strict'
const styleLoaders = require('./style_loaders.conf');
const isProduction = process.env.NODE_ENV === 'production';
// {
//     test: /\.vue$/,
//         loader: 'vue-loader',
//     options: {
//     loaders: {
//         css: ['vue-style-loader', 'css-loader'],
//             scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
//             sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
//     },
//     extractCss: true,
//         esModule: true,
//         cssSourceMap: true,
//         cacheBusting: true,
//         transformToRequire: {
//         video: ['src', 'poster'],
//             source: 'src',
//             img: 'src',
//             image: 'xlink:href'
//     }
// }
// },
module.exports = {
    loaders: styleLoaders.cssLoaders({
        sourceMap: true,
        extract: isProduction
    }),
    cssSourceMap: true,
    cacheBusting: true,
    transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}
