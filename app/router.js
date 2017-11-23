'use strict';

module.exports = app => {
  app.get('/test', 'home.test');
  app.get('/init', 'home.init');
  app.get('/admin', app.rbac.can('query_article'), 'home.index');
  app.get('/admin/article', app.rbac.can('query_article'), 'home.index');
  app.post('/admin/article/new', app.rbac.can('query_article'), 'home.newArticle');
  app.get('/admin/tag', app.rbac.can('query_tag'), 'home.tag');
  app.get('/admin/collect', app.rbac.can('query_collect'), 'home.collect');
  app.get('/admin/user', app.rbac.can('query_user'), 'home.user');
  app.get('/admin/setting', app.rbac.can('query_setting'), 'home.setting');

  // 登录 or 登出
  app.get('/login', 'home.login');
  app.post('/login', 'home.loginAPI');
  app.get('/logout', 'home.logoutAPI');
};
