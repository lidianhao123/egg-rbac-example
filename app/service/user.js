'use strict';

const crypto = require('crypto');

module.exports = app => {
  class UserService extends app.Service {
    * authUser({ name, password }) {
      const user = yield this.ctx.model.User.findOne({ name });
      if (user) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const pw = hash.digest('hex');
        return pw === user.pass;
      }

      return false;
    }

    * newUser({ name, password, role }) {
      if (!name || !password || !role) {
        return null;
      }

      const hash = crypto.createHash('sha256');
      hash.update(password);
      const pw = hash.digest('hex');

      const user = new this.ctx.model.User();
      user.name = name;
      user.pass = pw;
      user.role = role;
      return yield user.save();
    }

    * editUser({ id, name, role }) {
      const user = yield this.ctx.model.User.findOne({ _id: id });
      if (user !== null) {
        user.name = name;
        user.role = role;
        return yield user.save();
      }
      return null;
    }

    * findOne(name) {
      if (!name) {
        return null;
      }
      return yield this.ctx.model.User.findOne({ name }).populate('role');
    }

    * findOneById(_id) {
      if (!_id) {
        return null;
      }
      return yield this.ctx.model.User.findOne({ _id }).populate('role');
    }

    * findAll() {
      return yield this.ctx.model.User.find({}).populate('role');
    }
  }
  return UserService;
};
