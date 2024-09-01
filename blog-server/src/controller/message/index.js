const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.MESSAGE;

const { addMessage, deleteMessage, getMessageList, getAllMessage, updateMessage, messageLike, cancelMessageLike, getMessageTag } = require("../../service/message/index");
const { addNotify } = require("../notify/index");

const filterSensitive = require("../../utils/sensitive");
const { randomNickname } = require("../../utils/tool");

class MessageController {
  /**
   * 发布留言
   */
  async addMessage(ctx) {
    try {
      let { user_id, message, nick_name, ...rest } = ctx.request.body;
      if (!user_id) {
        nick_name = randomNickname("游客", 5);
      }

      message = await filterSensitive(message);
      const res = await addMessage({ nick_name, user_id, message, ...rest });
      // 发布消息推送
      if (user_id != 1) {
        await addNotify({
          user_id: 1,
          type: 3,
          message: `您收到了来自于：${nick_name} 的留言: ${message}！`,
        });
      }

      ctx.body = result("发布成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "发布失败"), ctx);
    }
  }

  /**
   * 修改留言
   * @param {*} ctx
   */
  async updateMessage(ctx) {
    try {
      let { message } = ctx.request.body;

      message = await filterSensitive(message);
      const res = await updateMessage(ctx.request.body);

      ctx.body = result("修改成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改失败"), ctx);
    }
  }

  /**
   * 删除留言
   */
  async deleteMessage(ctx) {
    try {
      const { idList } = ctx.request.body;
      const res = await deleteMessage(idList);

      ctx.body = result("删除留言成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除留言失败"), ctx);
    }
  }

  /**
   * 留言点赞
   */
  async messageLike(ctx) {
    try {
      const res = await messageLike(ctx.params.id);

      ctx.body = result("留言点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "留言点赞失败"), ctx);
    }
  }

  /**
   * 取消留言点赞
   */
  async cancelMessageLike(ctx) {
    try {
      const res = await cancelMessageLike(ctx.params.id);

      ctx.body = result("取消留言点赞成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "取消留言点赞失败"), ctx);
    }
  }

  // 分页获取留言
  async getMessageList(ctx) {
    try {
      let ip = ctx.get("X-Real-IP") || ctx.get("X-Forwarded-For") || ctx.ip;
      ip = ip.split(":").pop();
      const res = await getMessageList({ ...ctx.request.body, ip });

      ctx.body = result("分页获取留言成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页获取留言失败"), ctx);
    }
  }

  async getAllMessage(ctx) {
    try {
      const res = await getAllMessage();
      ctx.body = result("获取留言成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取留言失败"), ctx);
    }
  }

  /**
   * 获取热门标签
   * @param {*} ctx
   */
  async getMessageTag(ctx) {
    try {
      const res = await getMessageTag();
      ctx.body = result("获取留言所有标签成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取留言所有标签失败"), ctx);
    }
  }
}

module.exports = new MessageController();
