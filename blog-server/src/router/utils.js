/**
 * 上传路由
 * @author: M
 */

const Router = require("koa-router");
const router = new Router({ prefix: "/upload" });

const { upload } = require("../controller/utils/index");

// 图片上传
router.post("/img", upload);

module.exports = router;
