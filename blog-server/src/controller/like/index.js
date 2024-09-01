const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.LIKE;

const { addLike, cancelLike, getIsLikeByIdAndType, getIsLikeByIpAndType } = require("../../service/like/index");
const { articleLike, cancelArticleLike } = require("../../service/article/index");
const { talkLike, cancelTalkLike } = require("../../service/talk/index");
const { messageLike, cancelMessageLike } = require("../../service/message/index");
const { commentLike, cancelCommentLike } = require("../../service/comment/index");
class HeaderController {
  /**
   * 点赞
   */
  async addLike(ctx) {
    try {
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
      ip = ip.split(":").pop();
      const { for_id, type, user_id } = ctx.request.body;
      if (!for_id) {
        return ctx.app.emit("error", throwError(errorCode, "点赞对象不能为空"), ctx);
      }
      if (!type) {
        return ctx.app.emit("error", throwError(errorCode, "点赞类型不能为空"), ctx);
      }

      let res;
      if (!user_id) {
        let isLike = await getIsLikeByIpAndType({ for_id, type, ip });
        if (isLike) {
          return ctx.app.emit("error", throwError(errorCode, "您已经点过赞了"), ctx);
        }
        res = await addLike({ for_id, type, ip });
      } else {
        let isLike = await getIsLikeByIdAndType({ for_id, type, user_id });
        if (isLike) {
          return ctx.app.emit("error", throwError(errorCode, "您已经点过赞了"), ctx);
        }
        res = await addLike({ for_id, type, user_id });
      }

      if (!res) {
        return ctx.app.emit("error", throwError(errorCode, "点赞失败"), ctx);
      }

      // 在这里调用对应的 说说/文章/评论 的点赞方法
      // 点赞类型 1 文章 2 说说 3 留言 4 评论
      switch (type + "") {
        case "1":
          articleLike(for_id);
          break;
        case "2":
          talkLike(for_id);
          break;
        case "3":
          messageLike(for_id);
          break;
        case "4":
          commentLike(for_id);
          break;
      }

      ctx.body = result("点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "点赞失败"), ctx);
    }
  }

  /**
   * 取消点赞
   */
  async cancelLike(ctx) {
    try {
      const { for_id, type, user_id } = ctx.request.body;
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
      ip = ip.split(":").pop();
      if (!for_id) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞对象不能为空"), ctx);
      }
      if (!type) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞类型不能为空"), ctx);
      }
      let res;
      if (!user_id) {
        let isLike = await getIsLikeByIpAndType({ for_id, type, ip });
        if (!isLike) {
          return ctx.app.emit("error", throwError(errorCode, "您没有点过赞"), ctx);
        }
        res = await cancelLike({ for_id, type, ip });
      } else {
        let isLike = await getIsLikeByIdAndType({ for_id, type, user_id });
        if (!isLike) {
          return ctx.app.emit("error", throwError(errorCode, "您没有点过赞"), ctx);
        }
        res = await cancelLike({ for_id, type, user_id });
      }

      if (!res) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞失败"), ctx);
      }

      // 在这里调用对应的 说说/文章/评论 的点赞方法
      // 点赞类型 1 文章 2 说说 3 留言 4 评论
      switch (type + "") {
        case "1":
          cancelArticleLike(for_id);
          break;
        case "2":
          cancelTalkLike(for_id);
          break;
        case "3":
          cancelMessageLike(for_id);
          break;
        case "4":
          cancelCommentLike(for_id);
          break;
      }

      ctx.body = result("取消点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "取消点赞失败"), ctx);
    }
  }

  // 根据点赞类型和用户id、文章id 判断用户是否点赞
  async getIsLikeByIdOrIpAndType(ctx) {
    try {
      const { for_id, type, user_id } = ctx.request.body;
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
      ip = ip.split(":").pop();
      if (!for_id) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞对象不能为空"), ctx);
      }
      if (!type) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞类型不能为空"), ctx);
      }
      let res;
      if (!user_id) {
        res = await getIsLikeByIpAndType({ for_id, type, ip });
      } else {
        res = await getIsLikeByIdAndType({ for_id, type, user_id });
      }

      ctx.body = result("获取用户是否点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取用户是否点赞失败"), ctx);
    }
  }
}

module.exports = new HeaderController();
