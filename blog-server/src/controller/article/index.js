/*
 * @Description: 文章控制器
 * @Author: M
 * @Date: 2023-03-07 16:46:12
 * @LastEditTime: 2023-04-03 15:20:53
 */
const seq = require("../../db/seq");

const { deleteArticleTag } = require("../../service/article/articleTag");
const {
  createArticle,
  updateArticle,
  updateTop,
  deleteArticle,
  revertArticle,
  toggleArticlePublic,
  getArticleList,
  getArticleInfoByTitle,
  getArticleById,
  blogHomeGetArticleList,
  blogTimelineGetArticleList,
  getArticleListByTagId,
  getArticleListByCategoryId,
  getRecommendArticleById,
  getArticleListByContent,
  getHotArticle,
  articleLike,
  cancelArticleLike,
  addReadingDuration,
  getArticleCoverById,
} = require("../../service/article/index");
const { createCategoryOrReturn, createArticleTagByArticleId } = require("./common");

const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.ARTICLE;
const { UPLOADTYPE } = require("../../config/config.default");
const { deleteImgs } = require("../../utils/qiniuUpload");
const { deleteMinioImgs } = require("../../utils/minioUpload");
const { deleteOnlineImgs } = require("../utils/index");

class ArticleController {
  /**
   * 新增文章
   */
  async createArticle(ctx) {
    // 创建事务 方便回滚
    const t = await seq.transaction();
    try {
      const { tagList, category, ...articleRest } = ctx.request.body;
      // 若分类不存在 就先创建分类
      const { id, category_name } = category;
      articleRest.category_id = await createCategoryOrReturn(id, category_name);

      let newArticle, newArticleTagList;
      // 先创建文章 拿到文章的id
      newArticle = await createArticle(articleRest);

      // tag和标签进行关联
      newArticleTagList = await createArticleTagByArticleId(newArticle.id, tagList);

      ctx.body = result("新增文章成功", {
        article: newArticle,
        articleTagList: newArticleTagList,
      });
      await t.commit();
    } catch (err) {
      await t.rollback();
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "新增文章失败"), ctx);
    }
  }

  /**
   * 根据id修改文章
   */
  async updateArticle(ctx) {
    const t = await seq.transaction();
    try {
      const { tagList, category, ...articleRest } = ctx.request.body;
      let oldCover = await getArticleCoverById(articleRest.id);
      // 服务器删除图片
      if (oldCover && oldCover != articleRest.article_cover) {
        if (UPLOADTYPE == "qiniu") {
          await deleteImgs([oldCover.split("/").pop()]);
        }
        if (UPLOADTYPE == "online") {
          await deleteOnlineImgs([oldCover.split("/").pop()]);
        }
        if (UPLOADTYPE == "minio") {
          await deleteMinioImgs([oldCover.split("/").pop()]);
        }
      }

      // 先删除这个文章与标签之前的关联
      await deleteArticleTag(articleRest.id);
      // 判断新的分类是新增的还是已经存在的 并且返回分类id
      articleRest.category_id = await createCategoryOrReturn(category.id, category.category_name);

      let newArticleTagList = await createArticleTagByArticleId(articleRest.id, tagList);

      let res = await updateArticle(articleRest);

      ctx.body = result("修改文章成功", {
        res,
        newArticleTagList,
      });
      t.commit();
    } catch (err) {
      await t.rollback();
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改文章失败"), ctx);
    }
  }

  /**
   * 修改文章置顶状态
   */
  async updateTop(ctx) {
    try {
      const { id, is_top } = ctx.params;
      let res = await updateTop(id, is_top);

      ctx.body = result("修改文章置顶状态成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改文章置顶状态失败"), ctx);
    }
  }

  /**
   * 删除文章 3状态下直接删除 其他状态回退
   * @memberof ArticleController
   */
  async deleteArticle(ctx) {
    try {
      const { id, status } = ctx.params;

      if (Number(status) === 3) {
        let oldCover = await getArticleCoverById(id);
        if (UPLOADTYPE == "qiniu") {
          // 七牛云删除图片
          oldCover && (await deleteImgs([oldCover.split("/").pop()]));
        }
        if (UPLOADTYPE == "online") {
          // 服务器删除图片
          oldCover && (await deleteOnlineImgs([oldCover.split("/").pop()]));
        }

        if (UPLOADTYPE == "minio") {
          oldCover && (await deleteMinioImgs([oldCover.split("/").pop()]));
        }
      }

      let res = await deleteArticle(id, status);
      ctx.body = result("删除文章成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除文章失败"), ctx);
    }
  }

  /**
   * 恢复文章
   */
  async revertArticle(ctx) {
    try {
      const { id } = ctx.params;
      let res = await revertArticle(id);

      ctx.body = result("恢复文章成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "恢复文章失败"), ctx);
    }
  }

  /**
   * 公开或隐藏文章
   */
  async toggleArticlePublic(ctx) {
    try {
      const { id, status } = ctx.params;
      let res = await toggleArticlePublic(id, status);

      let message = Number(status) === 1 ? "隐藏文章" : "公开文章";
      ctx.body = result(message + "成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, message + "失败"), ctx);
    }
  }

  /**
   * 条件分页获取文章
   */
  async getArticleList(ctx) {
    try {
      let res = await getArticleList(ctx.request.body);

      ctx.body = result("查询文章成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "查询文章失败"), ctx);
    }
  }

  /**
   * 根据标题获取文章是否已经存在
   */
  async getArticleInfoByTitle(ctx) {
    try {
      const { id, article_title } = ctx.request.body;

      let res = await getArticleInfoByTitle({ id, article_title });
      ctx.body = result("文章查询结果", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "根据标题查询文章失败"), ctx);
    }
  }

  /**
   * 根据id获取文章信息
   */
  async getArticleById(ctx) {
    try {
      const { id } = ctx.params;

      let res = await getArticleById(id);
      ctx.body = result("查询文章详情成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "查询文章详情失败"), ctx);
    }
  }

  /**
   * 前台获取文章列表
   */
  async blogHomeGetArticleList(ctx) {
    try {
      const { current, size } = ctx.params;

      let res = await blogHomeGetArticleList(current, size);
      ctx.body = result("获取文章列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取文章列表失败"), ctx);
    }
  }

  /**
   * 前台获取时间轴列表
   */
  async blogTimelineGetArticleList(ctx) {
    try {
      const { current, size } = ctx.params;

      let res = await blogTimelineGetArticleList(current, size);
      ctx.body = result("获取文章时间轴列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取文章列表失败"), ctx);
    }
  }

  /**
   * 根据标签获取该标签下所有文章的简略信息
   */
  async getArticleListByTagId(ctx) {
    try {
      const { id, current, size } = ctx.request.body;
      if (!id) {
        return ctx.app.emit("error", throwError(errorCode, "标签id不能为空"), ctx);
      }

      let res = await getArticleListByTagId(current, size, id);
      ctx.body = result("根据标签获取文章列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "根据标签获取文章列表失败"), ctx);
    }
  }
  /**
   * 根据分类获取该分类下所有文章的简略信息
   */
  async getArticleListByCategoryId(ctx) {
    try {
      const { id, current, size } = ctx.request.body;
      if (!id) {
        return ctx.app.emit("error", throwError(errorCode, "分类id不能为空"), ctx);
      }

      let res = await getArticleListByCategoryId(current, size, id);
      ctx.body = result("根据分类获取文章列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "根据分类获取文章列表失败"), ctx);
    }
  }

  /**
   * 根据文章获取上下一篇文章 和推荐文章
   */
  async getRecommendArticleById(ctx) {
    try {
      const { id } = ctx.params;
      if (!id) {
        return ctx.app.emit("error", throwError(errorCode, "文章id不能为空"), ctx);
      }

      let res = await getRecommendArticleById(id);
      ctx.body = result("获取推荐文章成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取推荐文章失败"), ctx);
    }
  }

  /**
   * 全局搜索文章
   */
  async getArticleListByContent(ctx) {
    try {
      const { content } = ctx.params;

      let res = await getArticleListByContent(content);
      ctx.body = result("按照内容搜索文章成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "按照内容搜索文章失败"), ctx);
    }
  }

  // 获取热门文章
  async getHotArticle(ctx) {
    try {
      let res = await getHotArticle();
      ctx.body = result("获取热门文章成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取热门文章失败"), ctx);
    }
  }

  // 文章点赞
  async articleLike(ctx) {
    try {
      const { id } = ctx.params;
      let res = await articleLike(id);
      ctx.body = result("点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "点赞失败"), ctx);
    }
  }
  // 取消文章点赞
  async cancelArticleLike(ctx) {
    try {
      const { id } = ctx.params;
      let res = await cancelArticleLike(id);
      ctx.body = result("取消点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "取消点赞失败"), ctx);
    }
  }

  async addReadingDuration(ctx) {
    try {
      const { id, duration } = ctx.params;
      let res = await addReadingDuration(id, duration);
      ctx.body = result("增加阅读时长成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "增加阅读时长失败"), ctx);
    }
  }
}

module.exports = new ArticleController();
