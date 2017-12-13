'use strict';

const viewOptions = { layout: 'layout.ejs' };

const userRule = {
  name: 'string',
  password: { type: 'string', allowEmpty: true, required: false },
  id: { type: 'string', allowEmpty: true, required: false },
  roleId: { type: 'string', allowEmpty: true, required: false },
};
const Controller = require('egg').Controller;
class AdminController extends Controller {
  async test() {
    console.info(this.ctx.session);
    this.ctx.body = '';
  }
  async init() {
    const { ctx, app, service } = this;
    const adminRole = await app.rbac.getRole('admin');
    const oldAdmin = await service.user.findOne('admin');
    if (oldAdmin === null && adminRole) {
      await service.user.newUser({ name: 'admin', password: '123456', role: adminRole._id });
    }
    ctx.body = 'success';
  }
  async index() {
    await this.ctx.render('index.ejs', { sideId: 1 }, viewOptions);
  }

  async newUser() {
    const { ctx, service, logger } = this;
    const body = ctx.request.body;
    try {
      ctx.validate(userRule);
    } catch (err) {
      logger.warn('ctx.validate error %o', err);
      ctx.body = { code: 201, msg: '信息错误' };
      return;
    }
    let user;
    if (body.id) {
      user = await service.user.editUser({ id: body.id, name: body.name, role: body.roleId });
    } else {
      user = await service.user.newUser({ name: body.name, password: body.password, role: body.roleId });
    }
    if (user) {
      user = await service.user.findOneById(user._id);
      ctx.body = { code: 200, msg: 'success', user };
    } else {
      ctx.body = { code: 201, msg: '提交信息错误' };
    }
  }

  async tag() {
    await this.ctx.render('tag.ejs', { sideId: 2 }, viewOptions);
  }

  async collect() {
    await this.ctx.render('collect.ejs', { sideId: 3 }, viewOptions);
  }

  async user() {
    const { ctx, app, service } = this;
    const users = await service.user.findAll();
    const roles = await app.rbac.getAllRoles();
    await ctx.render('user.ejs', { sideId: 4, users, roles }, viewOptions);
  }

  async setting() {
    const { ctx, app } = this;
    const roles = await app.rbac.getAllRoles();
    const permissions = await app.rbac.getAllPermission();
    await ctx.render('setting.ejs', { sideId: 5, roles, permissions }, viewOptions);
  }

  async modifyPermissions() {
    const { ctx, app } = this;
    const body = ctx.request.body;

    if (body.removeArr && body.removeArr.length > 0) {
      await app.rbac.removePermissions(body.id, body.removeArr);
    }
    if (body.addArr && body.addArr.length > 0) {
      await app.rbac.addPermission(body.id, body.addArr);
    }
    ctx.body = {
      code: 200,
      msg: 'success',
    };
  }

  async newRole() {
    const { ctx, app } = this;
    const body = ctx.request.body;

    const role = await app.rbac.newRole({ name: body.name, alias: body.alias, grants: [] });
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
  async login() {
    await this.ctx.render('login.ejs', viewOptions);
  }

  // login API
  async loginAPI() {
    const { ctx, logger } = this;
    try {
      ctx.validate(userRule);
    } catch (err) {
      logger.warn('ctx.validate error %o', err);
      ctx.body = { code: 201, msg: '账号或密码错误' };
      return;
    }
    const flag = await ctx.service.user.authUser(ctx.request.body);
    if (flag) {
      const user = await ctx.service.user.findOne(ctx.request.body.name);
      // console.info('flag', ctx.request.body.name, user.role.name);
      ctx.session.user = {
        name: user.name,
        role: {
          name: user.role.name,
        },
      };
      logger.info('login success, session.user is ', ctx.session.user);
      ctx.body = {
        code: 200,
        msg: '登录成功',
      };
    } else {
      logger.info('login failure, user name is %s', ctx.request.body.name);
      ctx.body = {
        code: 201,
        msg: '账号或密码错误',
      };
    }
  }

  // logout API
  async logout() {
    this.ctx.session.user = null;
    this.ctx.redirect('/login');
  }
}
module.exports = AdminController;
