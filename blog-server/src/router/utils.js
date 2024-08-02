/**
 * 上传路由
 * @author: M
 */

const Router = require("koa-router");
const router = new Router({ prefix: "/upload" });

const { upload } = require("../controller/utils/index");
const { createTimesLimiter } = require("../middleware/limit-request/index");

// 图片上传
router.post(
  "/img",
  createTimesLimiter({
    prefixKey: "post/img",
    message: "上传图片过于频繁 请稍后再试",
    max: 100,
  }),
  upload
);

module.exports = router;
