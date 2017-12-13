'use strict';

const crypto = require('crypto');
const Service = require('egg').Service;

class UserService extends Service {
  async authUser({ name, password }) {
    const user = await this.ctx.model.User.findOne({ name });
    if (user) {
      const hash = crypto.createHash('sha256');
      hash.update(password);
      const pw = hash.digest('hex');
      return pw === user.pass;
    }

    return false;
  }

  async newUser({ name, password, role }) {
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
    return await user.save();
  }

  async editUser({ id, name, role }) {
    const user = await this.ctx.model.User.findOne({ _id: id });
    if (user !== null) {
      user.name = name;
      user.role = role;
      return await user.save();
    }
    return null;
  }

  async findOne(name) {
    if (!name) {
      return null;
    }
    return await this.ctx.model.User.findOne({ name }).populate('role');
  }

  async findOneById(_id) {
    if (!_id) {
      return null;
    }
    return await this.ctx.model.User.findOne({ _id }).populate('role');
  }

  async findAll() {
    return await this.ctx.model.User.find({}).populate('role');
  }
}
module.exports = UserService;
