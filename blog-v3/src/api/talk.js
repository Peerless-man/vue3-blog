import http from "@/config/request";

/** 获取说说列表 */
export const getTalkList = (param) => {
  return new Promise((resolve, reject) => {
    http.post("/api/talk/blogGetTalkList", param).then((res) => {
      resolve(res);
    });
  });
};
