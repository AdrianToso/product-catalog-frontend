// Karma configuration file
// https://karma-runner.github.io/1.0/config/configuration-file.html

const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {},
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },

    coverageReporter: {
      dir: path.join(__dirname, './coverage/adr-t.product-catalog.frontend'),
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'text-summary' },
        { type: 'json', subdir: '.', file: 'coverage-final.json' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' }
      ],
      check: {
        global: {
          statements: 70,
          branches: 50,
          functions: 60,
          lines: 70
        },
        emitWarning: false
      }
    },

    reporters: ['progress', 'kjhtml', 'coverage'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};
