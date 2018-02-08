'use strict';
const styleLoaders = require('./style_loaders.conf');
const isProduction = process.env.NODE_ENV === 'production';

// sourceMap and extract params both booleans
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
};
