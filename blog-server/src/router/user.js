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
// 用户登陆
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
