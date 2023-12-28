import http from "@/config/request";

/** 获取首页数据统计 */
export const homeGetStatistic = () => {
  return new Promise((resolve, reject) => {
    http.get("/api/statistic", {}).then((res) => {
      resolve(res);
    });
  });
};

/** 一言api */
export const getSentence = (ColaKey) => {
  return new Promise((resolve, reject) => {
    http
      .post("https://luckycola.com.cn/tools/yiyan", {
        ColaKey,
      })
      .then((res) => {
        resolve(res);
      });
  });
};

export const getKey = () => {
  return new Promise((resolve, reject) => {
    http
      .post("https://luckycola.com.cn/ai/getColaKey", {
        uid: "xIlyH01695893781527LY3zhJGJ0n",
        appKey: "651549153295914ff09985c1",
      })
      .then((res) => {
        resolve(res);
      });
  });
};
