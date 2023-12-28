/*
 * @Author: M
 * @Date: 2023-03-01 16:23:19
 * @Description: 路由公共注册
 * @LastEditTime: 2023-03-02 17:05:41
 * @LastEditors: M
 */

const fs = require("fs"); // 文件模块
const Router = require("koa-router");
const { swaggerJson } = require("../utils/swagger");

const router = new Router();

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js") {
    let r = require("./" + file);
    router.use(r.routes());
  }
});

// 随便写的一个欢迎
router.get("/", (ctx, next) => {
  ctx.body = "欢迎 这是后台server首页";
});

router.get("/swagger.json", async function (ctx) {
  ctx.set("Content-Type", "application/json");
  ctx.body = swaggerJson;
});

module.exports = router;
