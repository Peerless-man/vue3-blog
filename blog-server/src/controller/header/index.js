const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.HEADER;

const { addOrUpdateHeader, deleteHeader, getAllHeader, getOneByPath } = require("../../service/header/index");
const { UPLOADTYPE } = require("../../config/config.default");
const { deleteImgs } = require("../../utils/qiniuUpload");
const { deleteOnlineImgs } = require("../utils/index");
const { deleteMinioImgs } = require("../../utils/minioUpload");

class HeaderController {
  /**
   * 新增/修改背景图
   */
  async addOrUpdateHeader(ctx) {
    try {
      const { id, route_name } = ctx.request.body;
      if (!id) {
        const flag = await getOneByPath(route_name);
        if (flag) {
          return ctx.app.emit("error", throwError(errorCode, "已经存在相同的背景路径"), ctx);
        }
      }
      if (id) {
        const flag = await getOneByPath(route_name);
        if (flag.id != id) {
          return ctx.app.emit("error", throwError(errorCode, "已经存在相同的背景路径"), ctx);
        }
      }
      const res = await addOrUpdateHeader(ctx.request.body);
      let msg = id ? "修改" : "新增";
      ctx.body = result(msg + "背景成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, msg + "背景失败"), ctx);
    }
  }

  /**
   * 删除背景图
   */
  async deleteHeader(ctx) {
    try {
      const { id, url } = ctx.request.body;
      const res = await deleteHeader(id);

      if (url) {
        // 远程删除图片
        const arr = [];
        arr.push(url.split("/").pop());
        if (UPLOADTYPE == "qiniu") {
          await deleteImgs(arr);
        }

        if (UPLOADTYPE == "online") {
          await deleteOnlineImgs(arr);
        }

        if (UPLOADTYPE == "minio") {
          await deleteMinioImgs(arr);
        }
      }

      ctx.body = result("删除背景成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除背景失败"), ctx);
    }
  }

  // 获取所有背景图
  async getAllHeader(ctx) {
    try {
      const res = await getAllHeader();

      ctx.body = result("获取所有背景成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取所有背景失败"), ctx);
    }
  }
}

module.exports = new HeaderController();
