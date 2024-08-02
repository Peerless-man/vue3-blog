/**
 * 留言的路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/message" });

const { addMessage, updateMessage, deleteMessage, likeMessage, cancelLikeMessage, getMessageList, getAllMessage, getMessageTag } = require("../controller/message/index");
const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index");
const { createTimesLimiter } = require("../middleware/limit-request/index");

// 新增留言
router.post(
  "/add",
  createTimesLimiter({
    prefixKey: "post/message/add",
    message: "留言过于频繁 请稍后再试",
    max: 5,
  }),
  addMessage
);
// 修改留言
router.post(
  "/update",
  createTimesLimiter({
    prefixKey: "post/message/add",
    message: "修改留言过于频繁 请稍后再试",
    max: 5,
  }),
  auth,
  updateMessage
);

// 删除留言
router.put(
  "/delete",
  createTimesLimiter({
    prefixKey: "post/message/add",
    message: "删除过于频繁 请稍后再试",
    max: 5,
  }),
  auth,
  deleteMessage
);

// 后台删除留言
router.put("/backDelete", auth, needAdminAuthNotNeedSuper, deleteMessage);

// 点赞留言
router.put(
  "/like/:id",
  createTimesLimiter({
    prefixKey: "put/message/like/:id",
    message: "留言点赞过于频繁 请稍后再试",
    max: 5,
  }),
  likeMessage
);

// 取消点赞留言
router.put(
  "/cancelLike/:id",
  createTimesLimiter({
    prefixKey: "put/message/cancelLike/:id",
    message: "留言点赞过于频繁 请稍后再试",
    max: 5,
  }),
  cancelLikeMessage
);

// 分页获取留言
router.post("/getMessageList", getMessageList);

// 获取所有留言
router.get("/getAllMessage", getAllMessage);

// 获取热门标签
router.get("/getHotTagList", getMessageTag);

module.exports = router;
