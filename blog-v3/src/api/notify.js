import http from "@/config/request";

/** 分页获取消息列表 */
export const getNotifylist = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/notify/getNotifyList", data).then((res) => {
      resolve(res);
    });
  });
};

/** 阅读消息列表 */
export const updateNotify = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/notify/update/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};

/** 删除消息列表 */
export const deleteNotify = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/notify/delete/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};
