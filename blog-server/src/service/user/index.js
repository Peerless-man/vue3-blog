const User = require("../../model/user/user");
const { randomNickname, getIpAddress } = require("../../utils/tool");
const bcrypt = require("bcryptjs"); // 密码加盐加密
const { Op } = require("sequelize");

const filterSensitive = require("../../utils/sensitive");

class UserService {
  /**
   * 用户注册
   * @param {*} user
   */
  async createUser(user) {
    let { username, password, nick_name, qq } = user;

    // 过滤敏感词
    nick_name = await filterSensitive(nick_name);
    // 随机生成昵称
    nick_name = nick_name ? nick_name : randomNickname("小张的迷弟");
    const avatar = "http://mrzym.top/online/9bb507f4bd065759a3d093d04.webp";
    const res = await User.create({ username, password, nick_name, qq, avatar, role: 2 });

    return res.dataValues;
  }

  /**
   * 用户自己修改用户信息
   * @param {*} id
   * @param {*} user
   * @returns
   */
  async updateOwnUserInfo(id, user) {
    let { avatar, nick_name, qq } = user;
    nick_name = await filterSensitive(nick_name);
    const res = await User.update({ avatar, nick_name, qq }, { where: { id } });
    return res[0] > 0 ? true : false;
  }

  /**
   * 修改用户密码
   * @param {*} id
   * @param {*} password
   */
  async updatePassword(id, password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const res = await User.update({ password: hash }, { where: { id } });
    return res[0] > 0 ? true : false;
  }

  /**
   * 修改用户角色
   * @param {*} id
   * @param {*} role
   */
  async updateRole(id, role) {
    const res = await User.update({ role: role }, { where: { id } });
    return res[0] > 0 ? true : false;
  }

  /**
   * 根据条件查找一个用户
   * @param { id, username,role}
   * @returns Users
   */
  async getOneUserInfo({ id, username, password, role }) {
    const whereOpt = {};

    id && Object.assign(whereOpt, { id });
    username && Object.assign(whereOpt, { username });
    password && Object.assign(whereOpt, { password });
    role && Object.assign(whereOpt, { role });
    const res = await User.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: whereOpt,
    });
    return res ? res.dataValues : null;
  }

  /**
   * 分页查询用户列表
   */
  async getUserList({ current, size, nick_name, role }) {
    // 分页
    const offset = (current - 1) * size;
    const limit = size * 1;

    // 条件
    const whereOpt = {};
    if (typeof role === "number") {
      role &&
        Object.assign(whereOpt, {
          role: {
            [Op.eq]: role,
          },
        });
    }
    nick_name &&
      Object.assign(whereOpt, {
        nick_name: {
          [Op.like]: `%${nick_name}%`,
        },
      });
    const { count, rows } = await User.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ["password"] },
      where: whereOpt,
    });

    rows.forEach((v) => {
      if (v.dataValues.ip) {
        v.dataValues.ip_address = getIpAddress(v.dataValues.ip);
      } else {
        v.dataValues.ip_address = "火星";
      }
    });

    return {
      current,
      size,
      total: count,
      list: rows,
    };
  }

  /**
   * 修改用户ip地址
   * @param {*} id
   * @param {*} ip
   */
  async updateIp(id, ip) {
    const res = await User.update(
      {
        ip,
      },
      {
        where: {
          id,
        },
      }
    );
    return res[0] > 0 ? true : false;
  }

  /**
   * 根据用户id获取昵称
   * @param {*} id
   */
  async getAuthorNameById(id) {
    let res = await User.findByPk(id);
    return res ? res.dataValues.nick_name : null;
  }

  // 获取用户总数
  async getUserCount() {
    let res = await User.count();
    return res;
  }

  // 管理员修改用户信息
  async adminUpdateUserInfo({ id, nick_name, avatar }) {
    let res = await User.update(
      { nick_name, avatar },
      {
        where: {
          id,
        },
      }
    );
    return res[0] > 0 ? true : false;
  }
}

module.exports = new UserService();
