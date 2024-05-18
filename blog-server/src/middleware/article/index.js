const { getArticleInfoByTitle } = require("../../service/article/index");

const { ERRORCODE, throwError } = require("../../result/index");

/**
 * 新增/编辑文章校验参数
 */
const verifyArticleParam = async (ctx, next) => {
  const { article_title, author_id, category, article_content, tagList } = ctx.request.body;
  if (!category) {
    console.error("文章分类必传");
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "文章分类必传"), ctx);
  }
  const { category_name } = category;
  if (!article_title || !author_id || !category_name || !article_content) {
    console.error("文章参数校验错误");
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "文章参数校验错误"), ctx);
  }
  if (!tagList.length) {
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "文章标签不能为空"), ctx);
  }

  await next();
};

/**
 * 新增文章判断标题是否已经存在过
 */
const createJudgeTitleExist = async (ctx, next) => {
  const { article_title } = ctx.request.body;
  let res = await getArticleInfoByTitle({ article_title });
  if (res) {
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "已存在相同的文章标题"), ctx);
  }
  await next();
};

/**
 * 编辑文章判断被修改的标题是否已经存在
 */
const updateJudgeTitleExist = async (ctx, next) => {
  const { id, article_title } = ctx.request.body;
  let res = await getArticleInfoByTitle({ id, article_title });
  if (res) {
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "已存在相同的文章标题"), ctx);
  }
  await next();
};

const verifyTopParam = async (ctx, next) => {
  const { id, is_top } = ctx.params;
  if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(is_top)) {
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "参数只能为数字"), ctx);
  }

  await next();
};
const verifyDelParam = async (ctx, next) => {
  const { id, status } = ctx.params;
  if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(status)) {
    return ctx.app.emit("error", throwError(ERRORCODE.ARTICLE, "参数只能为数字"), ctx);
  }

  await next();
};

module.exports = {
  verifyTopParam,
  verifyDelParam,
  createJudgeTitleExist,
  updateJudgeTitleExist,
  verifyArticleParam,
};
