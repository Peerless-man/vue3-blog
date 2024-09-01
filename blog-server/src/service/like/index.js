const Like = require("../../model/like/like");
/**
 * 头部背景图服务层
 */
class LikeService {
  /**
   * 点赞
   */
  async addLike({ for_id, type, user_id, ip }) {
    let res;

    // 只有没点赞的用户才可以点赞
    res = await Like.create({ for_id, type, user_id, ip });

    return res ? true : false;
  }

  /**
   * 根据for_id、type、user_id取消点赞
   */
  async cancelLike({ for_id, type, user_id, ip }) {
    let whereOpt = {
      for_id,
      type,
    };
    ip && (whereOpt.ip = ip);
    user_id && (whereOpt.user_id = user_id);
    let res = await Like.destroy({
      where: whereOpt,
    });

    return res ? res : null;
  }

  /**
   * 获取当前用户对当前文章/说说/留言 是否点赞
   */
  async getIsLikeByIdAndType({ for_id, type, user_id }) {
    let like = await Like.findAll({
      where: {
        for_id,
        type,
        user_id,
      },
    });

    return like.length ? true : false;
  }

  /**
   * 获取当前ip对当前文章/说说/留言 是否点赞
   */
  async getIsLikeByIpAndType({ for_id, type, ip }) {
    let like = await Like.findAll({
      where: {
        for_id,
        type,
        ip,
      },
    });

    return like.length ? true : false;
  }
}

module.exports = new LikeService();
