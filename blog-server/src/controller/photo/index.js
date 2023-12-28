const { result, ERRORCODE, throwError } = require("../../result/index");
const errorCode = ERRORCODE.PHOTO;

const { addPhotos, deletePhotos, getPhotosByAlbumId, revertPhotos, getAllPhotosByAlbumId } = require("../../service/photo/index");
const { UPLOADTYPE } = require("../../config/config.default");
const { deleteImgs } = require("../../utils/qiniuUpload");
const { deleteOnlineImgs } = require("../utils/index");
const { deleteMinioImgs } = require("../../utils/minioUpload");

class PhotoController {
  /**
   * 批量新增图片
   */
  async addPhotos(ctx) {
    try {
      let { photoList } = ctx.request.body;
      const res = await addPhotos(photoList);

      ctx.body = result("新增图片成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "新增图片失败"), ctx);
    }
  }

  /**
   * 批量删除图片
   */
  async deletePhotos(ctx) {
    try {
      const { imgList, type } = ctx.request.body;
      let idList = imgList.map((v) => v.id);
      const res = await deletePhotos(idList, type);

      // 远程删除图片
      let keys = imgList.map((v) => v.url.split("/").pop());
      if (UPLOADTYPE == "qiniu" && type == 2) {
        await deleteImgs(keys);
      }
      if (UPLOADTYPE == "online" && type == 2) {
        await deleteOnlineImgs(keys);
      }
      if (UPLOADTYPE == "minio" && type == 2) {
        deleteMinioImgs(keys);
      }

      ctx.body = result("删除图片成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "删除图片失败"), ctx);
    }
  }

  /**
   * 批量恢复图片
   */
  async revertPhotos(ctx) {
    try {
      const { idList } = ctx.request.body;
      const res = await revertPhotos(idList);

      ctx.body = result("恢复图片成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "恢复图片失败"), ctx);
    }
  }

  /**
   * 获取图片列表 分页
   */
  async getPhotosByAlbumId(ctx) {
    try {
      const res = await getPhotosByAlbumId(ctx.request.body);

      ctx.body = result("获取相册图片成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取相册图片失败"), ctx);
    }
  }

  // 获取相册的所有照片
  async getAllPhotosByAlbumId(ctx) {
    try {
      const res = await getAllPhotosByAlbumId(ctx.params.id);

      ctx.body = result("获取相册所有照片成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", throwError(errorCode, "获取相册所有照片失败"), ctx);
    }
  }
}

module.exports = new PhotoController();
