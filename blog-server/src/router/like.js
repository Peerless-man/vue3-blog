/**
 * 记录用户点赞信息路由 点赞次数是直接记录到对应的文章、说说、留言内的
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/like" });

const { addLike, cancelLike, getIsLikeByIdOrIpAndType } = require("../controller/like/index");
const { createTimesLimiter } = require("../middleware/limit-request/index");

// 点赞
router.post(
  "/addLike",
  createTimesLimiter({
    prefixKey: "post/like/addLike",
    message: "点赞过于频繁 请稍后再试",
    max: 10,
  }),
  addLike
);

// 取消点赞
router.post(
  "/cancelLike",
  createTimesLimiter({
    prefixKey: "post/like/cancelLike",
    message: "取消点赞过于频繁 请稍后再试",
    max: 10,
  }),
  cancelLike
);

// 获取当前用户对当前文章/说说/留言 是否点赞
router.post("/getIsLikeByIdOrIpAndType", getIsLikeByIdOrIpAndType);

module.exports = router;
