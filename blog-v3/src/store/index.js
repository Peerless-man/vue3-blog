import { defineStore } from "pinia"; //引入pinia
// _setLocalItem 封装的缓存本地的方法 remove和get分别对应缓存的删除和获取
import { _getLocalItem, _setLocalItem } from "@/utils/tool";

// 本地数据加密解密
import { _encrypt, _decrypt } from "@/utils/encipher";

// 可以去看看vueUse怎么使用useDark 这个可以快速切换主题
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: "useDarkKEY",
  // 暗黑class名字
  valueDark: "dark",
  // 高亮class名字
  valueLight: "light",
});
const toggle = useToggle(isDark);

export const staticData = defineStore("staticData", {
  // 数据存到store里刷新页面会重置，持久化就不会了
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "staticState", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
  state: () => {
    return {
      // md预览主题列表
      previewThemeList: ["default", "github", "vuepress", "mk-cute", "smart-blue", "cyanosis"],
      // md代码主题列表
      codeThemeList: [
        "atom",
        "a11y",
        "github",
        "gradient",
        "kimbie",
        "paraiso",
        "qtcreator",
        "stackoverflow",
      ],
      // md预览主题
      previewTheme: "default",
      // md代码主题
      codeTheme: "atom",
      // 整体主题 黑夜和白天
      theme: isDark.value,
      // 头部图片地址
      pageHeaderList: [],
      messageTypeIsCard: false,
    };
  },
  getters: {
    // 获取当前整体主题 黑夜/白天
    mainTheme() {
      return isDark.value;
    },
    // 获取每个页面背景图
    getPageHeaderList() {
      return this.pageHeaderList || _getLocalItem("pageHeaderList");
    },
    getMessageTypeIsCard() {
      return this.messageTypeIsCard;
    },
  },
  actions: {
    // 切换主题
    switchMainTheme() {
      toggle();
      this.theme = isDark.value;
      _setLocalItem("mainTheme", this.theme ? "dark" : "light");
    },
    // 缓存图片
    setPageHeaderLIst(list) {
      this.pageHeaderList = list;
      _setLocalItem("pageHeaderList", list);
    },
    setMessageTypeIsCard(type) {
      this.messageTypeIsCard = type;
    },
  },
});

export const user = defineStore("user", {
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "userState", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
  state: () => {
    return {
      blogAvatar: "",
      userInfo: {}, // 当前登陆人信息
      token: "",
      infoFlag: false,
      tokenFlag: false,
      showLogin: false,
    };
  },
  getters: {
    // 获取当前登录用户头像
    getBlogAvatar() {
      return this.blogAvatar;
    },
    // 获取当前登录人信息
    getUserInfo() {
      try {
        return this.infoFlag ? JSON.parse(_decrypt(this.userInfo)) : "";
      } catch (err) {
        console.error(err);
        // 防止由于 解密密码不一致 导致项目加载阻塞
        this.clearUserInfo();
      }
    },
    // 获取token
    getToken() {
      try {
        return this.tokenFlag ? _decrypt(this.token) : "";
      } catch (err) {
        console.error(err);
        this.clearUserInfo();
      }
    },
    getShowLogin() {
      return this.showLogin;
    },
  },
  actions: {
    // 设置头像
    setBlogAvatar(avatar) {
      this.blogAvatar = avatar;
    },
    // 设置用户信息
    setUserInfo(userInfo) {
      this.infoFlag = true;
      this.userInfo = _encrypt(userInfo);
    },
    // 设置token
    setToken(token) {
      this.tokenFlag = true;
      this.token = _encrypt(token);
    },
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = {};
      this.token = "";
      this.tokenFlag = false;
      this.infoFlag = false;
    },
    setShowLogin(val) {
      this.showLogin = val;
    },
  },
});
