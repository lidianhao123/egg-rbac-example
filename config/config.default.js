'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1511233622961_9362';

  // add your config here
  config.middleware = [];

  config.siteInfo = {
    name: 'SITE.NAME',
  };

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

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: null,
      db: 0,
    },
  };

  config.rbac = {
    initOnStart: true, // default false
    /**
     * @param {object} ctx - egg context object
     * @return {object} promise, if resolve data is falsy, no role
     */
    * getRoleName(ctx) {
      if (ctx.session.roleName) {
        return Promise.resolve(ctx.session.user.role.name);
      }
      return Promise.resolve('');
    },
  };

  config.nav = [
    { id: 1, name: '文章管理', link: '/admin/article', iconName: 'glyphicon-th-list' },
    { id: 2, name: '标签管理', link: '/admin/tag', iconName: 'glyphicon-tags' },
    { id: 3, name: '收藏管理', link: '/admin/collect', iconName: 'glyphicon-heart' },
    { id: 4, name: '用户管理', link: '/admin/user', iconName: 'glyphicon-user' },
    { id: 5, name: '通用设置', link: '/admin/setting', iconName: 'glyphicon-cog' },
  ];

  return config;
};
