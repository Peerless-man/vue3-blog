const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.PHOTOALBUM;

const { addAlbum, deleteAlbum, updateAlbum, getAlbumList, getOneAlbum, getAllAlbumList } = require("../../service/photoAlbum/index");
const { UPLOADTYPE } = require("../../config/config.default");
const { deleteImgs } = require("../../utils/qiniuUpload");
const { deleteOnlineImgs } = require("../../controller/utils/index");
const { deleteMinioImgs } = require("../../utils/minioUpload");

class PhotoAlbumController {
  /**
   * 新增相册
   */
  async addAlbum(ctx) {
    try {
      const { album_name } = ctx.request.body;
      let one = await getOneAlbum({ album_name });
      if (one) {
        return ctx.app.emit("error", throwError(errorCode, "已经存在相同的相册名称，换一个试试"), ctx);
      }
      const res = await addAlbum(ctx.request.body);

      ctx.body = result("创建相册成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "创建相册失败"), ctx);
    }
  }

  /**
   * 删除相册
   */
  async deleteAlbum(ctx) {
    try {
      const { id } = ctx.params;
      let one = await getOneAlbum({ id });
      if (UPLOADTYPE == "qiniu") {
        await deleteImgs([one.album_cover.split("/").pop()]);
      }
      if (UPLOADTYPE == "online") {
        await deleteOnlineImgs([one.album_cover.split("/").pop()]);
      }

      if (UPLOADTYPE == "minio") {
        await deleteMinioImgs([one.album_cover.split("/").pop()]);
      }

      const res = await deleteAlbum(id);

      ctx.body = result("删除相册成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除相册失败"), ctx);
    }
  }

  /**
   * 修改相册
   */
  async updateAlbum(ctx) {
    try {
      const { id, album_name, album_cover } = ctx.request.body;

      let one = await getOneAlbum({ album_name });
      if (one && one.id != id) {
        return ctx.app.emit("error", throwError(errorCode, "已经存在相同的相册名称，换一个试试"), ctx);
      }

      let album = await getOneAlbum({ id });

      // 删除原来存储的照片
      if (UPLOADTYPE == "qiniu" && album_cover != album.album_cover) {
        await deleteImgs([album.album_cover.split("/").pop()]);
      }
      if (UPLOADTYPE == "online") {
        await deleteOnlineImgs([one.album_cover.split("/").pop()]);
      }
      if (UPLOADTYPE == "minio") {
        await deleteMinioImgs([one.album_cover.split("/").pop()]);
      }

      const res = await updateAlbum(ctx.request.body);

      ctx.body = result("修改相册成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "修改相册失败"), ctx);
    }
  }

  /**
   * 获取相册列表
   */
  async getAlbumList(ctx) {
    try {
      const { current, size, album_name } = ctx.request.body;
      const res = await getAlbumList({ current, size, album_name });

      ctx.body = result("获取相册列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取相册列表失败"), ctx);
    }
  }

  /**
   * 获取相册列表
   */
  async getAllAlbumList(ctx) {
    try {
      const res = await getAllAlbumList();

      ctx.body = result("获取所有相册列表成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取所有相册列表失败"), ctx);
    }
  }
}

module.exports = new PhotoAlbumController();
