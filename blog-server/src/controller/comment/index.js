const { createComment, applyComment, thumbUpComment, cancelThumbUp, deleteComment, backGetCommentList, frontGetParentComment, frontGetChildrenComment, getCommentTotal } = require("../../service/comment/index");

const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.CATEGORY;
const { addNotify } = require("../notify/index");
const { getCurrentTypeName } = require("../../utils/tool")

const filterSensitive = require("../../utils/sensitive");

/**
 * 评论控制器
 */
class CommentController {
  /**
   * 新增评论
   */
  async addComment(ctx) {
    try {
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
      ctx.request.body.content = await filterSensitive(ctx.request.body.content);

      let res = await createComment({ ...ctx.request.body, ip: ip.split(":").pop() });
      // from_id表示当前大陆人id 发表评论的人和当前登录人不一样才进行消息提示 author_id表示当前被评论的作者的id
      let { type, for_id, author_id, from_name, from_id, content } = ctx.request.body;
      // 不是作者自己评论的才给作者消息提示
      if (from_id != author_id) {
        await addNotify({
          user_id: author_id,
          type: type,
          to_id: for_id,
          message: `您的${getCurrentTypeName(type)}收到了来自于：${from_name} 的评论: ${content}！`,
        });
      }

      ctx.body = result("新增评论成功", {
        res,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "新增评论失败"), ctx);
    }
  }

  /**
   * 回复评论
   */
  async applyComment(ctx) {
    try {
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;

      ctx.request.body.content = await filterSensitive(ctx.request.body.content);

      let res = await applyComment({ ...ctx.request.body, ip: ip.split(":").pop() });
      let { type, for_id, from_name, content, from_id, to_id } = ctx.request.body;

      if (from_id != to_id) {
        await addNotify({
          user_id: to_id,
          type: type,
          to_id: for_id,
          message: `您的收到了来自于：${from_name} 的评论回复: ${content}！`,
        });
      }

      ctx.body = result("回复评论成功", {
        res,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "回复评论失败"), ctx);
    }
  }

  /**
   * 点赞评论
   */
  async thumbUpComment(ctx) {
    try {
      let res = await thumbUpComment(ctx.params.id);
      ctx.body = result("点赞成功", {
        res,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "点赞失败"), ctx);
    }
  }

  /**
   * 取消点赞评论
   */
  async cancelThumbUp(ctx) {
    try {
      let res = await cancelThumbUp(ctx.params.id);
      ctx.body = result("取消点赞成功", {
        res,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "取消点赞失败"), ctx);
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(ctx) {
    try {
      const { id, parent_id } = ctx.params;
      let res = await deleteComment(id, parent_id);
      ctx.body = result("删除评论成功", {
        res,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除评论失败"), ctx);
    }
  }

  /**
   * 后台条件分页查找评论列表
   */
  async backGetCommentList(ctx) {
    try {
      const { current, size, content, to_name, from_name, time } = ctx.request.body;
      let res = await backGetCommentList({ current, size, content, to_name, from_name, time });
      ctx.body = result("分页查找评论成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页查找评论失败"), ctx);
    }
  }

  /**
   * 前台条件分页查找父级评论列表
   */
  async frontGetParentComment(ctx) {
    try {
      const { current, size, type, for_id, user_id, order } = ctx.request.body;
      let res = await frontGetParentComment({ current, size, type, for_id, user_id, order });
      ctx.body = result("分页查找评论成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页查找评论失败"), ctx);
    }
  }

  /**
   * 前台条件分页查找子级评论列表
   */
  async frontGetChildrenComment(ctx) {
    try {
      const { current, size, type, for_id, user_id, parent_id } = ctx.request.body;
      let res = await frontGetChildrenComment({ current, size, type, for_id, user_id, parent_id });
      ctx.body = result("分页查找子评论成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页查找子评论失败"), ctx);
    }
  }

  /**
  * 获取当前评论的总条数
  */
  async getCommentTotal(ctx) {
    try {
      const { for_id, type } = ctx.request.body;
      let res = await getCommentTotal({ for_id, type });
      ctx.body = result("获取评论总条数成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取评论总条数失败"), ctx);
    }
  }
}

module.exports = new CommentController();
