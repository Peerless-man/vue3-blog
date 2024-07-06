const { Op } = require("sequelize");
const Chat = require("../../model/chat/chat");
const { getOneUserInfo } = require("../user/index.js");

/**
 * 聊天服务层
 */
class ChatService {
  /**
   * 新增聊天
   * @param {*} chat
   * @returns Boolean
   */
  async createChat(chat) {
    const { content_type, user_id, content } = chat;
    const res = await Chat.create({ content_type, content, user_id });

    return res.dataValues;
  }

  /**
   * 删除聊天
   */
  async deleteChats() {
    const res = await Chat.destroy({
      where: {}, // 这里指定删除条件，空对象表示删除所有记录
      truncate: true, // 删除主键自增
    });

    return res;
  }

  /**
   * 删除单挑聊天 就是撤销聊天
   */
  async deleteOneChat(id) {
    const res = await Chat.destroy({
      where: {
        id: [id],
      },
    });

    return res;
  }

  /**
   * 根据id获取聊天信息
   */
  async getOneChat(id) {
    const res = await Chat.findOne({
      where: {
        id: [id],
      },
    });

    return res.dataValues;
  }

  /**
   * 获取所有的聊天记录
   */

  async getAllChats() {
    const res = await Chat.findAll({
      where: {
        content_type: "image",
      },
      attributes: ["content"],
    });
    return res.map((v) => v.dataValues);
  }

  // 分页获取聊天列表
  async getChatList({ size, last_id }) {
    const whereOpt = {};
    let current = null;
    if (last_id) {
      Object.assign(whereOpt, {
        id: {
          [Op.lt]: last_id,
        },
      });
      current = last_id;
    } else {
      await Chat.findOne({
        order: [["id", "DESC"]],
        limit: 1,
      }).then((res) => {
        if (res) {
          res &&
            res.dataValues &&
            Object.assign(whereOpt, {
              id: {
                [Op.lte]: res.dataValues.id,
              },
            });
          current = res.dataValues.id;
        }
      });
    }
    const limit = size * 1;

    const { count, rows } = await Chat.findAndCountAll({
      limit,
      where: whereOpt,
      order: [["id", "DESC"]],
    });

    let promiseList = rows.map(async (message) => {
      if (message.user_id) {
        let item = message.dataValues;
        const user = await getOneUserInfo({ id: message.user_id });
        const { nick_name, avatar } = user;
        item.nick_name = nick_name;
        item.avatar = avatar;
        return item;
      }
    });

    let list = [];
    // list 就是带有用户最新信息的message
    await Promise.all(promiseList).then((res) => {
      list = res;
    });

    return {
      current,
      size: list.length,
      total: count,
      list: list.reverse(),
    };
  }
}

module.exports = new ChatService();
