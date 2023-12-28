module.exports = (err, ctx) => {
  let status = 500;
  switch (err.code) {
    case "100002":
      // 没有权限
      status = 403;
      break;
    case "100016":
      // token 过期 需要重新登录
      status = 401;
      break;
    default:
      status = 500;
  }
  ctx.status = status;
  ctx.body = err;
  console.error(err);
};
