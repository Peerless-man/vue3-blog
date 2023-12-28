import http from "@/config/request";

/** 获取说说列表 */
export const getTalkList = (param) => {
  return new Promise((resolve, reject) => {
    http.post("/api/talk/blogGetTalkList", param).then((res) => {
      resolve(res);
    });
  });
};

/** 说说点赞 */
export const talkLike = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/talk/like/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};

/** 取消说说点赞 */
export const cancelTalkLike = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/talk/cancelLike/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};
