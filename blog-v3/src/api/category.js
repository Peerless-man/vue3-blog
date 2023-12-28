import http from "@/config/request";

/** 获取所有的category */
export const getAllCategory = () => {
  return new Promise((resolve, reject) => {
    http.get("/api/category/getCategoryDictionary", {}).then((res) => {
      resolve(res);
    });
  });
};
