const path = require('path');

// Webpack Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, '../'), // Sets back the context path to the project root, ignoring webpack files location
    mode: 'development',
    entry: {
        app: './src/index.ts'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
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
                    'css-loader', // translates CSS into CommonJS
                    'less-loader', // compiles Less to CSS
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};
