import axios from "axios/dist/axios";
import { h } from "vue";
import { ElNotification } from "element-plus";
import { user } from "@/store/index";
import router from "../router/index";

// 创建一个 axios 实例
const http = axios.create({
  timeout: 10000, // 请求超时时间毫秒
  withCredentials: true, // 异步请求携带cookie
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    const userStore = user();
    if (userStore.getToken) {
      Object.assign(config.headers, {
        Authorization: userStore.getToken,
      });
    }
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data;
    const { code, message } = dataAxios;
    switch (code + "") {
      case "100":
        // 表示给用户一些提示
        ElNotification({
          offset: 60,
          title: "温馨提示",
          message: h("div", { style: "color: #e6c081; font-weight: 600;" }, message),
        });
        break;
    }

    return dataAxios;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const { status, data } = error.response;

    switch (status + "") {
      case "401":
        // 403 表示用户未登录，或者token过期了
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h(
            "div",
            { style: "color: #f56c6c; font-weight: 600;" },
            data.message || "登录过期"
          ),
        });
        // 进行重新登录
        // eslint-disable-next-line no-case-declarations
        const userStore = user();
        userStore.clearUserInfo();
        router.push("/login");
        break;
      case "403":
        // 403 表示权限不足
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h(
            "div",
            { style: "color: #f56c6c; font-weight: 600;" },
            data.message || "权限不足"
          ),
        });
        break;
      case "404":
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, "接口没有找到"),
        });
        break;
      case "408":
        // 205 表示给用户一些提示
        ElNotification({
          offset: 60,
          title: "温馨提示",
          message: h(
            "div",
            { style: "color: #e6c081; font-weight: 600;" },
            data.message || "服务端错误"
          ),
        });
        break;
      case "500":
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h(
            "div",
            { style: "color: #f56c6c; font-weight: 600;" },
            data.message || "服务端错误"
          ),
        });
        break;
      default:
        return;
    }
    return Promise.reject(error);
  }
);

export default http;
