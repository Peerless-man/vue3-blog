/**
 * 记录用户点赞信息路由 点赞次数是直接记录到对应的文章、说说、留言内的
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/like" });

const { addLike, cancelLike, getIsLikeByIdAndType } = require("../controller/like/index");

// 点赞
router.post("/addLike", addLike);

// 取消点赞
router.post("/cancelLike", cancelLike);

// 获取当前用户对当前文章/说说/留言 是否点赞
router.post("/getIsLikeByIdAndType", getIsLikeByIdAndType);

module.exports = router;