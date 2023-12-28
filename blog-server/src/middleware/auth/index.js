const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../../config/config.default");

const { ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.AUTH; // 用户权限不足
const tokenErrorCode = ERRORCODE.AUTHTOKEN; // 用户登录过期

const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header;

  const token = authorization ? authorization.replace("Bearer ", "") : undefined;
  if (!authorization) {
    console.error("您没有权限访问，请先登录");
    return ctx.app.emit("error", throwError(tokenErrorCode, "您没有权限访问，请先登录"), ctx);
  }

  try {
    // user 中包含了payload的信息（id，username，role）
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user;
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        console.error("token已过期", err);
        return ctx.app.emit("error", throwError(tokenErrorCode, "token已过期"), ctx);
      case "JsonWebTokenError":
        console.error("无效的token", err);
        return ctx.app.emit("error", throwError(errorCode, "无效的token"), ctx);
    }
  }

  await next();
};

// 对需要管理员发布信息，但是不建议超级管理员发布信息的接口进行提示
const needAdminAuthNotNeedSuper = async (ctx, next) => {
  const { role, username } = ctx.state.user;
  if (Number(role) !== 1) {
    console.error("普通用户仅限查看");
    return ctx.app.emit("error", throwError(errorCode, "普通用户仅限查看"), ctx);
  }
  if (username == "admin") {
    console.error("admin是配置的用户，没有用户信息，建议注册账号再发布博客内容");
    return ctx.app.emit("error", throwError(errorCode, "admin是配置的用户，没有用户信息，建议注册账号再发布博客内容"), ctx);
  }
  await next();
};

// 对需要管理员权限的进行操作进行提示
const needAdminAuth = async (ctx, next) => {
  const { role } = ctx.state.user;
  if (Number(role) !== 1) {
    console.error("普通用户仅限查看");
    return ctx.app.emit("error", throwError(errorCode, "普通用户仅限查看"), ctx);
  }
  await next();
};

const isSuperAdmin = async (ctx, next) => {
  const { username } = ctx.state.user;
  if (username == "admin") {
    console.error("管理员信息只可通过配置信息修改");
    return ctx.app.emit("error", throwError(errorCode, "管理员信息只可通过配置信息修改"), ctx);
  }
  await next();
};

module.exports = {
  auth,
  needAdminAuthNotNeedSuper,
  isSuperAdmin,
  needAdminAuth,
};
