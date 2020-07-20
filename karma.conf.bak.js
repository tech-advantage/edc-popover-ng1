const webpackConfig = require('./webpack/webpack.test');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            // 'node_modules/angular/index.js',
            'src/**/*.spec.ts'],
        mime: { 'text/x-typescript': ['ts','tsx'] },
        exclude: [],

        // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.ts': ['webpack'],
        },
        webpack: {
            ...webpackConfig
            // module: webpackConfig.module,
            // resolve: webpackConfig.resolve,
            // mode: webpackConfig.mode
        },

        // For enhancing the test results
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],
        // Web server port
        port: 9876,

        // enable / disable colors (reporters and logs)
        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        autoWatch: true,

        // Browsers to launch
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // If true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // specifies how many browser can be started simultaneous
        concurrency: Infinity,

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            'karma-spec-reporter'
        ]
    });
};
