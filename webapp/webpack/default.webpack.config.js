const path = require('path');
const webpack = require('webpack');
const vueLoaderConf = require('./vue_loader.conf');


module.exports = {
    entry: [
        '../src/app/app.ts'
    ],
    context: path.resolve(__dirname),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'build.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.NodeEnvironmentPlugin([
            'NODE_ENV'
        ]),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    logInfoToStdOut: true
                    // configFile: '../tsconfig.json'
                }
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: vueLoaderConf
            },
            {
                test: /\.tpl.html$/,
                loader: 'raw-loader'
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]',
                        outputPath: 'fonts/',    // where the fonts will go
                        publicPath: '../'       // override the default path
                    }
                }]
            },
            ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.html', '.json', '.scss'],
        alias:
            {
                'vue$': 'vue/dist/vue.esm.js',
                '@shared': path.resolve(__dirname, '../../shared')
            }
    },
    performance: {
        hints: false
    }
};
