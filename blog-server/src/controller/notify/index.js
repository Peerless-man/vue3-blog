const { createNotify, updateNotify, deleteNotifys, getNotifyList } = require("../../service/notify/index");

const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.NOTIFY;

/**
 * 消息通知控制器
 */
class NotifyController {
  /**
   * 新增消息通知
   */
  async addNotify({ user_id, type, to_id, message }) {
    try {
      await createNotify({ user_id, type, to_id, message });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 已阅消息通知
   */
  async updateNotify(ctx) {
    try {
      let res = await updateNotify(ctx.params.id);
      ctx.body = result("已阅消息通知成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "已阅消息通知失败"), ctx);
    }
  }

  /**
   * 删除消息通知
   */
  async deleteNotifys(ctx) {
    try {
      let res = await deleteNotifys(ctx.params.id);
      ctx.body = result("删除消息通知成功", {
        res,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除消息通知失败"), ctx);
    }
  }

  /**
   * 分页查找消息通知
   */
  async getNotifyList(ctx) {
    try {
      const { current, size, userId } = ctx.request.body;
      let res = await getNotifyList({ current, size, userId });
      ctx.body = result("分页查找消息通知成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页查询消息通知失败"), ctx);
    }
  }
}

module.exports = new NotifyController();
