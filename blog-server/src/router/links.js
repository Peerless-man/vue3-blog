/**
 * 友链的路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/links" });

const { auth, needAdminAuthNotNeedSuper, needAdminAuth } = require("../middleware/auth/index");
const { addOrUpdateLinks, deleteLinks, approveLinks, getLinksList, frontUpdateLinks } = require("../controller/links/index");
const { createTimesLimiter } = require("../middleware/limit-request/index");

// 新增友链
router.post(
  "/add",
  createTimesLimiter({
    prefixKey: "post/like/cancelLike",
    message: "新增过于频繁 请稍后再试",
    max: 5,
  }),
  addOrUpdateLinks
);

// 博客前台修改友链
router.post("/frontUpdate", frontUpdateLinks);

// 博客后台修改友链
router.post("/backUpdate", auth, needAdminAuthNotNeedSuper, addOrUpdateLinks);

// 删除友链
router.put("/delete", auth, needAdminAuthNotNeedSuper, deleteLinks);

// 批量审核友链
router.put("/approve", auth, needAdminAuthNotNeedSuper, approveLinks);

// 分页获取友链
router.post("/getLinksList", getLinksList);

module.exports = router;
