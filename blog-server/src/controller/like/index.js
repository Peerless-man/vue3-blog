const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.LIKE;

const { addLike, cancelLike, getIsLikeByIdAndType } = require("../../service/like/index");

class HeaderController {
  /**
   * 点赞
   */
  async addLike(ctx) {
    try {
      const { for_id, type, user_id } = ctx.request.body;
      if (!for_id) {
        return ctx.app.emit("error", throwError(errorCode, "点赞对象不能为空"), ctx);
      }
      if (!type) {
        return ctx.app.emit("error", throwError(errorCode, "点赞类型不能为空"), ctx);
      }
      let res
      if (!user_id) {
        res = false
      } else {
        res = await addLike({ for_id, type, user_id });

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
      if (!for_id) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞对象不能为空"), ctx);
      }
      if (!type) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞类型不能为空"), ctx);
      }
      let res
      if (!user_id) {
        res = false
      } else {
        res = await cancelLike({ for_id, type, user_id });
      }


      ctx.body = result("取消点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "取消点赞失败"), ctx);
    }
  }

  // 根据点赞类型和用户id、文章id 判断用户是否点赞
  async getIsLikeByIdAndType(ctx) {
    try {
      const { for_id, type, user_id } = ctx.request.body;
      if (!for_id) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞对象不能为空"), ctx);
      }
      if (!type) {
        return ctx.app.emit("error", throwError(errorCode, "取消点赞类型不能为空"), ctx);
      }
      let res
      if (!user_id) {
        res = false
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
