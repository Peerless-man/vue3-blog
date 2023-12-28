const { Op } = require("sequelize");
const TalkPhoto = require("../../model/talk/talkPhoto.js");
const { UPLOADTYPE } = require("../../config/config.default");
const { deleteImgs } = require("../../utils/qiniuUpload");
const { deleteOnlineImgs } = require("../../controller/utils/index.js");
const { deleteMinioImgs } = require("../../utils/minioUpload.js");

/**
 * 说说图片服务层
 */
class TalkPhotoService {
  /**
   * 新增说说图片
   * @param {*} imgList
   */
  async publishTalkPhoto(imgList) {
    const res = await TalkPhoto.bulkCreate(imgList);

    // 创建图片
    return res;
  }

  /**
   * 根据说说id删除图片
   * @param {*} talk_id
   */
  async deleteTalkPhoto(talk_id) {
    let urlList = await TalkPhoto.findAll({
      attributes: ["url"],
      where: {
        talk_id,
      },
    });
    // 远程删除图片
    let keys = urlList.map((v) => v.dataValues.url.split("/").pop());
    if (UPLOADTYPE == "qiniu") {
      await deleteImgs(keys);
    }
    if (UPLOADTYPE == "online") {
      await deleteOnlineImgs(keys);
    }
    if (UPLOADTYPE == "minio") {
      await deleteMinioImgs(keys);
    }
    const res = await TalkPhoto.destroy({
      where: {
        talk_id,
      },
    });

    // 创建图片
    return res;
  }

  /**
   * 根据说说id获取图片列表
   * @param {*} talk_id
   */
  async getPhotoByTalkId(talk_id) {
    const res = await TalkPhoto.findAll({
      where: {
        talk_id,
      },
    });

    return (
      res.length &&
      res.map((v) => {
        return {
          talk_id: v.dataValues.talk_id,
          url: v.dataValues.url,
        };
      })
    );
  }
}

module.exports = new TalkPhotoService();
