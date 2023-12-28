const jwt = require("jsonwebtoken");
const { JWT_SECRET, ADMIN_PASSWORD } = require("../../config/config.default");
const { createUser, updateOwnUserInfo, getOneUserInfo, updatePassword, updateRole, getUserList, adminUpdateUserInfo, updateIp } = require("../../service/user/index");
const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.USER;

const { UPLOADTYPE } = require("../../config/config.default");
const { deleteImgs } = require("../../utils/qiniuUpload");
const { deleteOnlineImgs } = require("../utils/index");
const { deleteMinioImgs } = require("../../utils/minioUpload");

const { getIpAddress } = require("../../utils/tool");
class userController {
  /**
   * 用户注册
   */
  async register(ctx) {
    try {
      const res = await createUser(ctx.request.body);
      // 保存用户id
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
      await updateIp(res.id, ip.split(":").pop());

      ctx.body = result("用户注册成功", {
        id: res.id,
        username: res.username,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "用户注册失败"), ctx);
    }
  }

  /**
   * 用户修改自己的用户信息
   */
  async updateOwnUserInfo(ctx) {
    try {
      const { id } = ctx.state.user;
      const { avatar } = ctx.request.body;

      let one = await getOneUserInfo({ id });
      // 服务器删除原来的头像
      if (one.avatar && one.avatar != avatar) {
        if (UPLOADTYPE == "qiniu") {
          await deleteImgs([one.avatar.split("/").pop()]);
        }
        if (UPLOADTYPE == "online") {
          await deleteOnlineImgs([one.avatar.split("/").pop()]);
        }

        if (UPLOADTYPE == "minio") {
          await deleteMinioImgs([one.avatar.split("/").pop()]);
        }
      }

      const res = await updateOwnUserInfo(id, ctx.request.body);

      ctx.body = result("修改用户成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改用户失败"), ctx);
    }
  }

  /**
   * 修改密码
   */
  async updatePassword(ctx) {
    try {
      const { password1 } = ctx.request.body;
      const { id } = ctx.state.user;
      if (id == 2) {
        return ctx.app.emit("error", throwError(errorCode, "测试用户密码不可以修改哦"), ctx);
      }
      const res = await updatePassword(id, password1);

      ctx.body = result("修改用户密码成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改用户密码失败"), ctx);
    }
  }

  /**
   * 修改用户角色
   */
  async updateRole(ctx) {
    try {
      const { id, role } = ctx.params;
      const res = await updateRole(id, role);

      ctx.body = result("修改角色成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改角色失败"), ctx);
    }
  }

  /**
   *  登录
   */
  async login(ctx) {
    try {
      // 获取用户信息(在token的payload中，记录id，username，role)
      const { username, password } = ctx.request.body;

      if (username == "admin") {
        if (password == ADMIN_PASSWORD) {
          ctx.body = result("超级管理员登录成功", {
            token: jwt.sign({ nick_name: "超级管理员", id: 5201314, role: 1, username: "admin" }, JWT_SECRET, { expiresIn: "1d" }),
            username: "超级管理员",
            role: 1,
            id: 5201314,
          });
        } else {
          return ctx.app.emit("error", throwError(errorCode, "密码错误"), ctx);
        }
      } else {
        // 从返回的对象中剔除password属性，将剩下的属性放到res对象
        const { password, ...res } = await getOneUserInfo({ username });
        // 保存用户ip地址
        let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
        await updateIp(res.id, ip.split(":").pop());
        const ipAddress = getIpAddress(ip.split(":").pop());
        ctx.body = result("用户登录成功", {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: "1d" }),
          username: res.username,
          role: res.role,
          id: res.id,
          ipAddress,
        });
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "用户登陆失败"), ctx);
    }
  }

  /**
   * 分页获取用户列表
   */
  async getUserList(ctx) {
    try {
      const { current, size, nick_name, role } = ctx.request.body;
      const res = await getUserList({ current, size, nick_name, role });

      ctx.body = result("分页获取用户列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页获取用户列表失败"), ctx);
    }
  }

  /**
   * 根据用户id获取当前登录人信息
   */
  async getUserInfo(ctx) {
    try {
      if (ctx.params.id) {
        if (ctx.params.id == 5201314) {
          ctx.body = result("获取用户信息成功", {
            id: 5201314,
            role: 1,
            nick_name: "超级管理员",
          });
        } else {
          let res = await getOneUserInfo({ id: ctx.params.id });
          const { password, username, ip, ...resInfo } = res;
          const ipAddress = getIpAddress(ip);
          resInfo.ipAddress = ipAddress;
          ctx.body = result("获取用户信息成功", resInfo);
        }
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取用户信息失败"), ctx);
    }
  }

  /**
   * 管理员根据用户id修改用户的信息
   * @param {*} ctx
   */
  async adminUpdateUserInfo(ctx) {
    try {
      const { id, avatar } = ctx.request.body;
      let one = await getOneUserInfo({ id });
      // 服务器删除原来的头像
      if (one.avatar && one.avatar != avatar) {
        if (UPLOADTYPE == "qiniu") {
          await deleteImgs([one.avatar.split("/").pop()]);
        }
        if (UPLOADTYPE == "online") {
          await deleteOnlineImgs([one.avatar.split("/").pop()]);
        }
        if (UPLOADTYPE == "minio") {
          await deleteMinioImgs([one.avatar.split("/").pop()]);
        }
      }

      let res = await adminUpdateUserInfo(ctx.request.body);
      ctx.body = result("修改用户信息成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改用户信息失败"), ctx);
    }
  }
}

module.exports = new userController();
