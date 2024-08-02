/**
 * 分类路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/category" });

const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index");

const { addCategory, updateCategory, deleteCategories, getCategoryList, getCategoryDictionary } = require("../controller/category/index");

const { verifyCategory, verifyDeleteCategories } = require("../middleware/category/category");

// 新增分类
router.post("/add", auth, needAdminAuthNotNeedSuper, verifyCategory, addCategory);

// 修改分类
router.put("/update", auth, needAdminAuthNotNeedSuper, verifyCategory, updateCategory);

// 删除分类
router.post("/delete", auth, needAdminAuthNotNeedSuper, verifyDeleteCategories, deleteCategories);

// 条件分页获取分类
router.post("/getCategoryList", getCategoryList);

// 获取分类简略信息，用于字典反显
router.get("/getCategoryDictionary", getCategoryDictionary);

module.exports = router;
