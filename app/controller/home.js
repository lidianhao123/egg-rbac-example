'use strict';

const viewOptions = { layout: 'layout.ejs' };

const userRule = {
  name: 'string',
  password: { type: 'string', allowEmpty: true, required: false },
  id: { type: 'string', allowEmpty: true, required: false },
  roleId: { type: 'string', allowEmpty: true, required: false },
};

module.exports = app => {
  class AdminController extends app.Controller {
    * test() {
      console.info(this.ctx.session);
      this.ctx.body = '';
    }
    * init() {
      const adminRole = yield app.rbac.getRole('admin');
      const oldAdmin = yield this.service.user.findOne('admin');
      if (oldAdmin === null && adminRole) {
        yield this.service.user.newUser({ name: 'admin', password: '123456', role: adminRole._id });
      }
      this.ctx.body = 'success';
    }
    * index() {
      yield this.ctx.render('index.ejs', { sideId: 1 }, viewOptions);
    }

    * newUser() {
      const ctx = this.ctx;
      const body = ctx.request.body;
      try {
        ctx.validate(userRule);
      } catch (err) {
        ctx.logger.warn('ctx.validate error %o', err);
        ctx.body = { code: 201, msg: '信息错误' };
        return;
      }
      let user;
      if (body.id) {
        user = yield this.service.user.editUser({ id: body.id, name: body.name, role: body.roleId });
      } else {
        user = yield this.service.user.newUser({ name: body.name, password: body.password, role: body.roleId });
      }
      if (user) {
        user = yield this.service.user.findOneById(user._id);
        this.ctx.body = { code: 200, msg: 'success', user };
      } else {
        this.ctx.body = { code: 201, msg: '提交信息错误' };
      }
    }

    * tag() {
      yield this.ctx.render('tag.ejs', { sideId: 2 }, viewOptions);
    }

    * collect() {
      yield this.ctx.render('collect.ejs', { sideId: 3 }, viewOptions);
    }

    * user() {
      const users = yield this.service.user.findAll();
      const roles = yield app.rbac.getAllRoles();
      yield this.ctx.render('user.ejs', { sideId: 4, users, roles }, viewOptions);
    }

    * setting() {
      const roles = yield app.rbac.getAllRoles();
      const permissions = yield app.rbac.getAllPermission();
      yield this.ctx.render('setting.ejs', { sideId: 5, roles, permissions }, viewOptions);
    }

    * modifyPermissions() {
      const ctx = this.ctx;
      const body = ctx.request.body;

      if (body.removeArr && body.removeArr.length > 0) {
        yield app.rbac.removePermissions(body.id, body.removeArr);
      }
      if (body.addArr && body.addArr.length > 0) {
        yield app.rbac.addPermission(body.id, body.addArr);
      }
      ctx.body = {
        code: 200,
        msg: 'success',
      };
    }

    * newRole() {
      const ctx = this.ctx;
      const body = ctx.request.body;

      const role = yield app.rbac.newRole({ name: body.name, alias: body.alias, grants: [] });
      if (role === null) {
        ctx.body = {
          code: 501,
          msg: '角色简称已存在',
        };
      }
      ctx.body = {
        code: 200,
        msg: 'success',
        role,
      };
    }

    // render login page
    * login() {
      yield this.ctx.render('login.ejs', viewOptions);
    }

    // login API
    * loginAPI() {
      const ctx = this.ctx;
      try {
        ctx.validate(userRule);
      } catch (err) {
        ctx.logger.warn('ctx.validate error %o', err);
        ctx.body = { code: 201, msg: '账号或密码错误' };
        return;
      }
      const flag = yield ctx.service.user.authUser(ctx.request.body);
      if (flag) {
        const user = yield ctx.service.user.findOne(ctx.request.body.name);
        // console.info('flag', ctx.request.body.name, user.role.name);
        this.ctx.session.user = {
          name: user.name,
          role: {
            name: user.role.name,
          },
        };
        this.logger.info('login success, session.user is ', this.ctx.session.user);
        ctx.body = {
          code: 200,
          msg: '登录成功',
        };
      } else {
        this.logger.info('login failure, user name is %s', ctx.request.body.name);
        ctx.body = {
          code: 201,
          msg: '账号或密码错误',
        };
      }
    }

    // logout API
    * logout() {
      this.ctx.session.user = null;
      this.ctx.redirect('/login');
    }
  }
  return AdminController;
};
