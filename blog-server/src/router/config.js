/**
 * 网站设置路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/config" });

const { auth, needAdminAuth } = require("../middleware/auth/index");

const { updateConfig, getConfig, addView } = require("../controller/utils/index");

// 修改网站设置
router.post("/update", auth, needAdminAuth, updateConfig);

// 获取网站设置
router.get("/", getConfig);

// 修改网站设置的访问次数
router.put("/addView", addView);

module.exports = router;
