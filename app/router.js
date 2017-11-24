'use strict';

/**
 * middleware for check permission
 * @param {boolean} isAPI undefined or truely
 * @return {function} generate function
 */
function can(isAPI) {
  return function* (next) {
    console.info(this.request.url);
    // this is instance of Context
    if (this.role && this.role.can && this.role.can(this.request.url)) {
      yield next;
    } else {
      // https://tools.ietf.org/html/rfc2616#page-66
      // this.status = 401; // 'Unauthorized'
      if (isAPI) {
        this.body = {
          code: 401,
          msg: 'no permission',
        };
      } else {
        this.redirect('/login');
      }
    }
  };
}

module.exports = app => {
  app.router.get('/test', 'home.test');
  app.router.get('/init', 'home.init');
  app.router.redirect('/', '/admin', 302);
  app.router.get('/admin', can(), 'home.index');
  app.router.get('/admin/tag', can(), 'home.tag');
  app.router.get('/admin/collect', can(), 'home.collect');
  app.router.get('/admin/user', can(), 'home.user');
  app.router.post('/admin/user/new', can(true), 'home.newUser');
  app.router.get('/admin/setting', can(), 'home.setting');
  app.router.post('/admin/setting/modify', can(true), 'home.modifyPermissions');
  app.router.post('/admin/setting/newrole', can(true), 'home.newRole');

  // 登录 or 登出
  app.router.get('/login', 'home.login');
  app.router.post('/login', 'home.loginAPI');
  app.router.get('/logout', 'home.logout');
};
