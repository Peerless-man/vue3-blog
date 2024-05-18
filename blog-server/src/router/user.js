/*
 * @Author: M
 * @Date: 2023-03-01 16:23:19
 * @Description: 用户路由
 * @LastEditTime: 2023-04-19 22:18:12
 * @LastEditors: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/user" });

const { login, register, updateOwnUserInfo, updatePassword, updateRole, getUserList, getUserInfo, adminUpdateUserInfo } = require("../controller/user");

const { userValidate, verifyUser, crpyPassword, verifyLogin, verifyUpdatePassword } = require("../middleware/user/index");

const { auth, isSuperAdmin, needAdminAuth } = require("../middleware/auth/index");

// 用户注册
router.post("/register", userValidate, verifyUser, crpyPassword, register);
/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - 用户
 *     summary: 用户登录
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: 用户账户
 *             password:
 *               type: string
 *               description: 用户密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: 用户身份凭证 可以拿到这个到swagger里的Authorize那里填入 就有权限了 还有一些信息自己登录试试就不赘述了
 *       500:
 *         description: 服务端错误
 */
router.post("/login", userValidate, verifyLogin, login);
// 用户修改个人用户信息
router.put("/updateOwnUserInfo", auth, isSuperAdmin, updateOwnUserInfo);
// 修改密码
router.put("/updatePassword", auth, isSuperAdmin, verifyUpdatePassword, updatePassword);
// 管理员修改用户角色
router.put("/updateRole/:id/:role", auth, needAdminAuth, updateRole);
// 管理员修改用户信息
router.put("/adminUpdateUserInfo", auth, needAdminAuth, adminUpdateUserInfo);

// 分页获取用户列表
router.post("/getUserList", auth, getUserList);

// 根据用户id获取用户信息
router.get("/getUserInfoById/:id", getUserInfo);

module.exports = router;
