/**
 * 聊天路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/chat" });

const { auth, needAdminAuth } = require("../middleware/auth/index");

const { createChat, deleteChats, deleteOneChat, getChatList } = require("../controller/chat/index");

// 新增聊天
router.post("/add", auth, createChat);

// 删除单条聊天
router.delete("/deleteOne/:id", deleteOneChat);

// 删除聊天
router.post("/delete", auth, needAdminAuth, deleteChats);

// 条件分页获取聊天
router.post("/getChatList", getChatList);

module.exports = router;
