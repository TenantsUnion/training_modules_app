const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
/**
 * Config for webpack style loaders based on the utils.js webpack build file from the vue cli 'webpack' template
 * {@link https://github.com/vuejs-templates/webpack/blob/develop/template/build/utils.js}
 */

/**
 * Return object of style loader configurations where the file extension is the key and the loader
 * configuration is the corresponding property. For use with vue loader and .vue files with
 * @code <style lang="">
 *
 * @param options is object with boolean props sourceMap, usePostCSS, and extract to customize style loaders config
 * that is returned
 */
exports.cssLoaders = function (options) {
    options = options || {};

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            console.log('extract style plugin: ' + loader);
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass', {
            data: '@import "style";@import "variables";',
            includePaths: [
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../src/scss'),
                path.resolve(__dirname, '../../node_modules/foundation-sites/scss'),
                path.resolve(__dirname, '../../node_modules/foundation-sites/scss/util'),
                path.resolve(__dirname, '../../node_modules/foundation-sites/_vendor'),
                path.resolve(__dirname, '../../node_modules/font-awesome-sass/assets/stylesheets/font-awesome')
            ]
        }),
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    const output = [];
    const loaders = exports.cssLoaders(options);

    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output;
};
