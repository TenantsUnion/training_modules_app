const config = require('config');
const path = require('path');
const webpack = require('webpack');
const vueLoaderConf = require('./vue_loader.conf');


module.exports = {
    entry: [
        './src/app.ts'
    ],
    context: config.get('webapp.context'),
    output: {
        path: config.get('webapp.dist'),
        filename: '[name].[hash].bundle.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        // defaults process.env.NODE_ENV to development if not defined during build, otherwise substitutes value during build
        new webpack.NodeEnvironmentPlugin({
            'NODE_ENV': 'development'
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
                    logInfoToStdOut: true,
                    configFile: path.resolve(__dirname, '../tsconfig.json')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConf
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]',
                        outputPath: 'fonts/',    // where the fonts will go
                    }
                }]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.html', '.json', '.scss'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@shared': path.resolve(__dirname, '../../shared'),
            '@karma_unit_test': path.resolve(__dirname, '../karma_unit_test/src'),
            '@webapp': path.resolve(__dirname, '../src'),
            "@global": path.resolve(__dirname, "../src/global"),
            "@training": path.resolve(__dirname, "../src/training"),
            "@course": path.resolve(__dirname, "../src/course"),
            "@module": path.resolve(__dirname, "../src/module"),
            "@section": path.resolve(__dirname, "../src/section"),
            "@user": path.resolve(__dirname, "../src/user"),
            "@store": path.resolve(__dirname, "../src/store")
        }
    },
    performance: {
        hints: false
    }
}
;
