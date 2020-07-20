const path = require('path');

// Webpack Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: path.resolve(__dirname, '../'), // Sets back the context path to the project root, ignoring webpack files location
    entry: {
        app: './src/index.ts',
    },
    output: {
        path: path.resolve('./dist'),
        filename: 'edc-popover-ng1.js'
    },
    externals: {
        angular: 'angular'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            /**
             * ESLINT ( -> doesn't use tslint, because it will soon be deprecated )
             */
            {
                test: /\.ts$/,
                enforce: 'pre', // To make sure to check source files, not modified by other loaders
                use: [
                    {
                        // https://github.com/webpack-contrib/eslint-loader
                        loader: require.resolve('eslint-loader'),
                        options: {
                            // Automatically correct when possible - https://eslint.org/docs/user-guide/command-line-interface#fix
                            fix: false,
                            // Output formatter https://eslint.org/docs/user-guide/formatters/#codeframe
                            formatter: 'codeframe', // require('eslint-friendly-formatter') is an option too
                            emitError: true
                        },
                    },
                ],
                exclude: [/node_modules/, /.yalc/ ],
            },
            /**
             * TS LOADER
             */
            {
                test: /\.ts$/,
                exclude: [/node_modules/, /.yalc/ ],
                use: [
                    'ts-loader'
                ]
            },
            {
                test: /\.(css|less)$/,
                use: [
                    'style-loader',{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './dist',
                        },
                    },
                    'css-loader', // translates CSS into CommonJS
                    'less-loader', // compiles Less to CSS
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'edc-popover-ng1.css'
        }),
    ],
    stats: 'verbose',
};
