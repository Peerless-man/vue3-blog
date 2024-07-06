const { createChat, deleteChats, deleteOneChat, getChatList, getOneChat, getAllChats } = require("../../service/chat/index");

const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.CHAT;

const { UPLOADTYPE } = require("../../config/config.default.js");
const { deleteImgs } = require("../../utils/qiniuUpload.js");
const { deleteMinioImgs } = require("../../utils/minioUpload");
const { deleteOnlineImgs } = require("../utils/index");
/**
 * 聊天控制器
 */
class ChatController {
  /**
   * 新增聊天
   */
  async createChat(ctx) {
    try {
      let res = await createChat(ctx.request.body);
      ctx.body = result("新增聊天成功", {
        content: res.content,
      });
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "新增聊天失败"), ctx);
    }
  }

  /**
   * 删除聊天
   */
  async deleteChats(ctx) {
    try {
      // 寻找所有的聊天记录 依次删除图片
      let arr = await getAllChats();
      if (arr.length) {
        arr = arr.map((item) => {
          return item.content.split("/").pop();
        });
        if (UPLOADTYPE == "qiniu") {
          deleteImgs(arr); // 这里就不等待删了再去删数据库了 直接删
        }
        if (UPLOADTYPE == "online") {
          deleteOnlineImgs(arr);
        }
        if (UPLOADTYPE == "minio") {
          deleteMinioImgs(arr);
        }
      }

      await deleteChats();
      ctx.body = result("删除聊天成功");
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除聊天失败"), ctx);
    }
  }

  /**
   * 删除单条聊天记录 就是撤回消息
   */
  async deleteOneChat(ctx) {
    try {
      // 先删除图片
      const one = await getOneChat(ctx.params.id);
      if (one.content_type == "image") {
        const { content } = one;
        const arr = [];
        arr.push(content.split("/").pop());
        if (UPLOADTYPE == "qiniu") {
          deleteImgs(arr); // 这里就不等待删了再去删数据库了 直接删
        }

        if (UPLOADTYPE == "online") {
          deleteOnlineImgs(arr);
        }

        if (UPLOADTYPE == "minio") {
          deleteMinioImgs(arr);
        }
      }
      await deleteOneChat(ctx.params.id);
      ctx.body = result("撤回聊天成功");
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "撤回聊天失败"), ctx);
    }
  }

  /**
   * 条件分页查找聊天列表
   */
  async getChatList(ctx) {
    try {
      let res = await getChatList(ctx.request.body);
      ctx.body = result("分页查找聊天成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "分页查找聊天失败"), ctx);
    }
  }
}

module.exports = new ChatController();
