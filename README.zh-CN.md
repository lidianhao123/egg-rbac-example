# egg-rbac-example

example for [egg-rbac][egg-rbac] plugin

## 本地体验

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

## egg-rabc 基础配置

1. 安装插件 ```js # npm i --save egg-rbac ```
2. 启用插件
```js
// {app_root}/config/plugin.js
exports.rbac = {
  enable: true,
  package: 'egg-rbac',
};
```
3. 插件配置(更多信息查看[config.default.js][egg-rbac-config])
```js
  config.rbac = {
    initOnStart: true, // default false
    /**
     * @param {object} ctx - egg context object
     * @return {object} promise, if resolve data is falsy, no role
     */
    * getRoleName(ctx) {
      if (ctx.session.user && ctx.session.user.role.name) {
        return Promise.resolve(ctx.session.user.role.name);
      }
      return Promise.resolve('');
    },
  };
```
4. 配置权限列表和初始角色信息
```js
// {app_root/config/rbac.js}
'use strict';

exports.permissions = [
  // action_resource
  { name: '/admin', alias: '访问文章管理' },
];

exports.roles = [
  { name: 'user', alias: '普通用户', grants: [ '/admin', '/admin/tag', '/admin/collect' ] },
];
```

## egg-rbac 使用说明

### 产生 context 实例 Role 对象

配置中的 getRoleName 函数用于返回当前用户的角色名称，egg-rbac 内部中间件通过调用 getRoleName 获得角色名称后创建 Role 对象，并且绑定到 context(ctx) 上面。

### 权限判断

1. 通过默认提供的中间件方法进行判断处理
```js
app.get('/admin', app.rbac.can('query_admin'), 'home.index');
```
2. 自定义中间件，请参考[本项目代码](./app/router.js#L8)

3. 调用 ctx.role.can() 进行判断
```js
ctx.role.can('/admin');
```

### 角色创建及修改角色权限

app.rbac 对象上面有通用方法用于创建角色、修改角色权限

例子：
```js
//{app_root/app/controller/home.js}
const role = await app.rbac.newRole({ name: body.name, alias: body.alias, grants: [] });
```
```js
if (body.removeArr && body.removeArr.length > 0) {
  await app.rbac.removePermissions(body.id, body.removeArr);
}
if (body.addArr && body.addArr.length > 0) {
  await app.rbac.addPermission(body.id, body.addArr);
}
```

[egg-rbac]: https://github.com/lidianhao123/egg-rbac
[egg-rbac-config]: https://github.com/lidianhao123/egg-rbac/blob/master/config/config.default.js#L8
