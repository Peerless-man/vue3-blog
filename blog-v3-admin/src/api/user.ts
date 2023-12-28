import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  message: String;
  result: {
    token: string; // token
    username: string; // 用户名
    role: number; // 用户角色
    id: number; // 用户id
  };
};

export type Result = {
  code: number;
  message: string;
  result: any;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/user/login", { data });
};

/** 注册 */
export const registerUser = (data?: object) => {
  return http.request<Result>("post", "/api/user/register", { data });
};

/** 用户修改个人信息 */
export const updateUserInfo = (data?: object) => {
  return http.request<Result>("put", "/api/user/updateOwnUserInfo", { data });
};

/** 用户修改密码 */
export const updateUserPassword = (data?: object) => {
  return http.request<Result>("put", "/api/user/updatePassword", { data });
};

/** 管理员修改用户角色 */
export const updateUserRole = (id, role) => {
  return http.request<Result>("put", `/api/user/updateRole/${id}/${role}`, {});
};

/** 管理员修改用户信息 */
export const adminUpdateUserInfo = data => {
  return http.request<Result>("put", "/api/user/adminUpdateUserInfo", { data });
};

/** 条件分页获取用户信息 */
export const getUserList = (data?: object) => {
  return http.request<Result>("post", "/api/user/getUserList", { data });
};

/** 获取当前登录人的信息 */
export const getUserInfoById = id => {
  return http.request<Result>("get", `/api/user/getUserInfoById/` + id, {});
};
