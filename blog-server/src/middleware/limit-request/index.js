/*
 * @author: Zhang Yuming
 * @date: 2024-07-20 13:55:38
 * @params: ctx
 * @description: 限制自动化脚本测试网站
 */

const RateLimit = require("koa2-ratelimit").RateLimit;

/*
 * @author: Zhang Yuming
 * @params: time 限制时间内
 * @params: max 最多访问多少次
 * @params: prefix 路径
 * @params: message 消息提示
 * @description: 限制同一个 ip 多少时间内只能发送多少次请求
 */
const createTimesLimiter = (options) => {
  if (!Object.getOwnPropertyNames(options).includes("prefixKey")) {
    console.error("TimesLimiterError, prefixKey is required");
  }

  const defaultOptions = {
    interval: 1 * 60 * 1000, // 1 minutes
    max: 10,
    prefixKey: "", // to allow the bdd to Differentiate the endpoint
    message: "小黑子 压测我是吧",
    messageKey: "message",
  };
  Object.assign(defaultOptions, options);
  return RateLimit.middleware(defaultOptions);
};

module.exports = {
  createTimesLimiter,
};
