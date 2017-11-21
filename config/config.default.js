'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1511233622961_9362';

  // add your config here
  config.middleware = [];

  // view ejs engine config
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };

  config.ejs = {
    root: path.join(appInfo.baseDir, 'app/view'),
    cache: true,
    debug: false,
    compileDebug: true,
    delimiter: null,
    strict: false,
  };

  // database config
  config.mongoose = {
    url: 'mongodb://127.0.0.1/rbac-example',
    options: {},
  };

  return config;
};
