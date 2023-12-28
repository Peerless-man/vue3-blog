import { defineStore } from "pinia";
import { store } from "@/store";
import { userType, userInfoType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, getUserInfoById } from "@/api/user";
import { UserResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username:
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "",
    // 页面级别权限 暂时没什么乱用
    role: storageSession().getItem<DataInfo<number>>(sessionKey)?.role,
    avatar: "",
    nick_name: "",
    id: 0 // 登录用户的id
  }),
  getters: {
    getAvatar() {
      return (
        this.avatar ||
        storageSession().getItem<userInfoType>("blogCurrentUser")?.avatar
      );
    },
    getNickName() {
      return (
        this.nick_name ||
        storageSession().getItem<userInfoType>("blogCurrentUser")?.nick_name
      );
    },
    getUserId() {
      return (
        this.id || storageSession().getItem<userInfoType>("blogCurrentUser")?.id
      );
    }
  },
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLE(role: number) {
      this.role = role;
    },
    SET_TOKEN(token: string) {
      this.token = token;
    },
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    SET_NICKNAME(nick_name: string) {
      this.nick_name = nick_name;
    },
    SET_ID(id: number) {
      this.id = id;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(async res => {
            if (res.code == 0) {
              setToken(res.result);
              this.SET_ID(Number(res.result.id));
              await this.saveUserInfo(res.result.id);
              // 获取用户信息进行存储
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 保存当前登录人信息
    async saveUserInfo() {
      const res = await getUserInfoById(this.getUserId);
      if (res.code == 0) {
        this.SET_AVATAR(res.result.avatar);
        this.SET_NICKNAME(res.result.nick_name);
        this.SET_ID(Number(res.result.id));
        storageSession().setItem<userInfoType>("blogCurrentUser", res.result);
      }
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
