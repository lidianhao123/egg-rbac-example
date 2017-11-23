'use strict';

// had enabled by egg
// exports.static = true;
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

exports.rbac = {
  enable: true,
  package: 'egg-rbac',
};
