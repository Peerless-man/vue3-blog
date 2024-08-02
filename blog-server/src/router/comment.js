/**
 * 评论路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/comment" });

const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index");

const { addComment, deleteComment, applyComment, thumbUpComment, cancelThumbUp, backGetCommentList, frontGetParentComment, frontGetChildrenComment, getCommentTotal } = require("../controller/comment/index");

const { createTimesLimiter } = require("../middleware/limit-request/index");

// 新增评论
router.post(
  "/add",
  createTimesLimiter({
    prefixKey: "post/comment/add",
    message: "评论过于频繁 请稍后再试",
    max: 20,
  }),
  addComment
);

// 回复评论
router.post(
  "/apply",
  createTimesLimiter({
    prefixKey: "post/comment/apply",
    message: "回复评论过于频繁 请稍后再试",
    max: 20,
  }),
  applyComment
);

// 点赞评论
router.put(
  "/thumbUp/:id",
  createTimesLimiter({
    prefixKey: "post/comment/add",
    message: "点赞过于频繁 请稍后再试",
    max: 10,
  }),
  thumbUpComment
);

// 取消点赞评论
router.put(
  "/cancelThumbUp/:id",
  createTimesLimiter({
    prefixKey: "post/comment/add",
    message: "取消点赞过于频繁 请稍后再试",
    max: 10,
  }),
  cancelThumbUp
);

// 前台删除评论
router.delete("/delete/:id/:parent_id", auth, deleteComment);

// 后台删除评论
router.delete("/backDelete/:id/:parent_id", auth, needAdminAuthNotNeedSuper, deleteComment);

// 后台条件分页获取评论
router.post("/backGetCommentList", backGetCommentList);

// 前台分页获取父级评论
router.post("/frontGetParentComment", frontGetParentComment);

// 前台分页获取子评论
router.post("/frontGetChildrenComment", frontGetChildrenComment);

// 获取关于当前的评论总数 子评论 + 父评论
router.post("/getCommentTotal", getCommentTotal);

module.exports = router;
