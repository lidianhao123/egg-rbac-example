'use strict';

exports.permissions = [
  // action_resource
  { name: 'query_article', alias: '访问文章管理' },
  { name: 'query_tag', alias: '访问标签管理' },
  { name: 'query_collect', alias: '访问收藏管理' },
  { name: 'query_user', alias: '访问用户管理' },
  { name: 'query_setting', alias: '访问通用设置' },
];

exports.roles = [
  { name: 'admin', alias: '管理员', grants: exports.permissions.map(item => item.name) },
  { name: 'user', alias: '普通用户', grants: [ 'query_article', 'query_tag', 'query_collect' ] },
];
