/**
 * 网站设置路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/config" });

const { auth, needAdminAuth } = require("../middleware/auth/index");

const { updateConfig, getConfig, addView } = require("../controller/utils/index");
const { createTimesLimiter } = require("../middleware/limit-request/index");

// 修改网站设置
router.post("/update", auth, needAdminAuth, updateConfig);

// 获取网站设置
router.get("/", getConfig);

// 修改网站设置的访问次数
router.put(
  "/addView",
  createTimesLimiter({
    prefixKey: "put/addView",
    message: "访问网站过于频繁 请稍后再试",
    interval: {
      min: 60,
    },
    max: 100,
  }),
  addView
);

module.exports = router;
