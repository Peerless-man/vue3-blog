import http from "@/config/request";
import { user } from "@/store/index.js";
import { h } from "vue";
import { ElNotification } from "element-plus";
import { imageConversion } from "@/utils/tool";

/** 登录 */
export const reqLogin = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/user/login", data).then((res) => {
      resolve(res);
    });
  });
};

/** 注册 */
export const reqRegister = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/user/register", data).then((res) => {
      resolve(res);
    });
  });
};

/** 用户修改个人信息 */
export const updateUserInfo = (data) => {
  return new Promise((resolve, reject) => {
    http.put("/api/user/updateOwnUserInfo", data).then((res) => {
      resolve(res);
    });
  });
};

/** 用户修改密码 */
export const updateUserPassword = (data) => {
  return new Promise((resolve, reject) => {
    http.put("/api/user/updatePassword", data).then((res) => {
      resolve(res);
    });
  });
};

/** 获取当前登录人的信息 */
export const getUserInfoById = (id) => {
  return new Promise((resolve, reject) => {
    http.get("/api/user/getUserInfoById/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};

/** 图片上传 */
/** 图片上传接口 */
export const imgUpload = async (data) => {
  // 文件压缩 太大了上传不了，我的服务器比较垃圾
  let res;
  // 没有raw.size 就表示已经压缩过了（多图片上传那里我压缩了一次） 有的话小于800不用压缩
  if (data.raw.size / 1024 > 800) {
    const file = await imageConversion(data.raw);
    if (!file) {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, "图片上传失败"),
      });
      return;
    } else {
      res = file;
    }
  } else {
    res = data.raw;
  }
  const formData = new FormData();
  formData.append("file", res);
  const userStore = user();

  return new Promise((resolve) => {
    http
      .post("/api/upload/img", formData, {
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": userStore.getToken,
          },
        },
      })
      .then((res) => {
        resolve(res);
      });
  });
};
