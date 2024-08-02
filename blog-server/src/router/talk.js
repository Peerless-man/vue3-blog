/*
 * @Description: 说说路由
 * @Author: M
 * @Date: 2023-04-06 19:46:27
 * @LastEditTime: 2023-04-18 22:39:11
 * @LastEditors: M
 */

const Router = require("koa-router");
const router = new Router({ prefix: "/talk" });

const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index");
const { publishTalk, updateTalk, deleteTalkById, togglePublic, toggleTop, revertTalk, getTalkList, getTalkById, talkLike, cancelTalkLike, blogGetTalkList } = require("../controller/talk/index");
const { createTimesLimiter } = require("../middleware/limit-request/index");

// 发布说说
router.post("/publishTalk", auth, needAdminAuthNotNeedSuper, publishTalk);

// 修改说说
router.put("/updateTalk", auth, needAdminAuthNotNeedSuper, updateTalk);

// 删除说说
router.delete("/deleteTalkById/:id/:status", auth, needAdminAuthNotNeedSuper, deleteTalkById);

// 修改说说公开私密状态 1 公开 2 私密
router.put("/togglePublic/:id/:status", auth, needAdminAuthNotNeedSuper, togglePublic);

// 修改说说公开置顶状态 1 置顶 2 不置顶
router.put("/toggleTop/:id/:is_top", auth, needAdminAuthNotNeedSuper, toggleTop);

// 恢复说说 从3回收站恢复到1
router.put("/revertTalk/:id", auth, needAdminAuthNotNeedSuper, revertTalk);

// 分页获取说说
router.post("/getTalkList", getTalkList);

// 获取说说详情
router.get("/getTalkById/:id", getTalkById);

// 说说点赞
router.put(
  "/like/:id",
  createTimesLimiter({
    prefixKey: "put/talk/like/:id",
    message: "说说点赞过于频繁 请稍后再试",
    max: 5,
  }),
  talkLike
);

// 取消点赞
router.put(
  "/cancelLike/:id",
  createTimesLimiter({
    prefixKey: "put/talk/like/:id",
    message: "说说取消点赞过于频繁 请稍后再试",
    max: 5,
  }),
  cancelTalkLike
);

// 前台获取说说
router.post("/blogGetTalkList", blogGetTalkList);

module.exports = router;
