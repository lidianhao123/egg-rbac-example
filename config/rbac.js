'use strict';

exports.permissions = [
  // action_resource
  { name: '/admin', alias: '访问文章管理' },
  { name: '/admin/tag', alias: '访问标签管理' },
  { name: '/admin/collect', alias: '访问收藏管理' },
  { name: '/admin/user', alias: '访问用户管理' },
  { name: '/admin/setting', alias: '访问通用设置' },
  { name: '/admin/user/new', alias: '创建用户' },
  { name: '/admin/setting/newrole', alias: '创建角色' },
  { name: '/admin/setting/modify', alias: '修改角色权限' },
];

exports.roles = [
  { name: 'admin', alias: '管理员', grants: exports.permissions.map(item => item.name) },
  { name: 'user', alias: '普通用户', grants: [ '/admin', '/admin/tag', '/admin/collect' ] },
];
