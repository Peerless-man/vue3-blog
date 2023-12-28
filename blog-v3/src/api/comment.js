import http from "@/config/request";

/** 发表评论 */
export const addComment = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/comment/add", data).then((res) => {
      resolve(res);
    });
  });
};

/** 回复评论 */
export const applyComment = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/comment/apply", data).then((res) => {
      resolve(res);
    });
  });
};

/** 点赞评论 */
export const thumbUpComment = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/comment/thumbUp/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};

/** 取消点赞评论 */
export const cancelThumbUp = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/comment/cancelThumbUp/" + id, {}).then((res) => {
      resolve(res);
    });
  });
};

/** 删除自己的评论 */
export const deleteComment = (id, parent_id = 0) => {
  return new Promise((resolve, reject) => {
    http.delete(`/api/comment/delete/${id}/${parent_id}`, {}).then((res) => {
      resolve(res);
    });
  });
};

/** 获取父级评论 */
export const frontGetParentComment = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/comment/frontGetParentComment", data).then((res) => {
      resolve(res);
    });
  });
};

/** 获取子级评论 */
export const frontGetChildrenComment = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/comment/frontGetChildrenComment", data).then((res) => {
      resolve(res);
    });
  });
};

// 获取评论总条数
export const frontGetCommentTotal = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/comment/getCommentTotal", data).then((res) => {
      resolve(res);
    });
  });
};
