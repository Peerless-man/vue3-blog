const ERRORCODE = {
  USER: "100001", // 用户错误码
  AUTH: "100002", // 主要是用户权限不足
  TAG: "100003",
  CATEGORY: "100004",
  ARTICLE: "100005",
  UPLOAD: "100006",
  CONFIG: "100007",
  STATISTIC: "100008",
  PHOTOALBUM: "100009",
  PHOTO: "100010",
  TALK: "100011", // 说说
  MESSAGE: "100012", // 留言
  RECOMMEND: "100012", // 推荐
  HEADER: "100013", // 背景图
  LINKS: "100014", // 友链
  COMMENT: "100015", // 评论
  AUTHTOKEN: "100016", // 用户登录过期
  NOTIFY: "100017", // 消息推送
  LIKE: "100018", // 点赞
  TIPS: "111111", // 提示
};

/**
 * 公共返回结果方法
 * @param {*} message 提示信息
 * @param {*} result 结果
 * @returns
 */
function result(message, result) {
  return {
    code: 0,
    message,
    result,
  };
}

/**
 * 公共返回提示方法
 * @param {*} message 提示信息
 * @param {*} result 结果
 * @returns
 */
function tipsResult(message) {
  return {
    code: 100,
    message,
  };
}

/**
 * 公共抛出错误方法
 * @param {*} code 错误码
 * @param {*} message 错误信息
 * @returns
 */
function throwError(code, message) {
  return {
    code,
    message,
  };
}

module.exports = {
  ERRORCODE,
  result,
  throwError,
  tipsResult,
};
