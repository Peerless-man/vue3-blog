const { Op } = require("sequelize");
const Message = require("../../model/message/message");
const { getOneUserInfo } = require("../user/index");
const { getIsLikeByIdAndType } = require("../like/index");
const { getCommentTotal } = require("../comment/index");

/**
 * 留言服务层
 */
class MessageService {
  /**
   * 发布留言
   */
  async addMessage({ message, color, font_size, font_weight, bg_color, bg_url, user_id, tag, nick_name }) {
    const res = await Message.create({ message, color, font_size, font_weight, bg_color, bg_url, user_id, tag, nick_name });

    return res ? true : false;
  }

  /**
   * 修改留言
   */
  async updateMessage({ id, message, color, font_size, font_weight, bg_color, bg_url, tag }) {
    const res = await Message.update(
      { message, color, font_size, font_weight, bg_color, bg_url, tag },
      {
        where: {
          id,
        },
      }
    );

    return res ? true : false;
  }

  /**
   * 根据id列表删除留言
   * @param {*} idList
   * @returns
   */
  async deleteMessage(idList) {
    let res = await Message.destroy({
      where: {
        id: idList,
      },
    });

    return res ? res : null;
  }

  /**
   * 点赞留言
   * @param { id }
   */
  async likeMessage(id) {
    let message = await Message.findByPk(id);
    if (message) {
      await message.increment("like_times", { by: 1 });
    }

    return message ? true : false;
  }

  /**
   * 取消点赞留言
   * @param { id }
   */
  async cancelLikeMessage(id) {
    let message = await Message.findByPk(id);
    if (message) {
      await message.decrement("like_times", { by: 1 });
    }

    return message ? true : false;
  }

  /**
   * 分页获取留言
   */
  async getMessageList({ current, size, message, time, tag, user_id }) {
    const offset = (current - 1) * size;
    const limit = size * 1;
    const whereOpt = {};
    tag &&
      Object.assign(whereOpt, {
        tag,
      });
    message &&
      Object.assign(whereOpt, {
        message: {
          [Op.like]: `%${message}%`,
        },
      });
    time &&
      Object.assign(whereOpt, {
        createdAt: {
          [Op.between]: time,
        },
      });
    const { rows, count } = await Message.findAndCountAll({
      limit,
      offset,
      where: whereOpt,
      order: [["createdAt", "DESC"]],
    });

    // 根据用户form_id获取用户当前的昵称和头像
    const promiseList = rows.map(async (row) => {
      let res;
      if (row.user_id) {
        res = await getOneUserInfo({ id: row.user_id });
        return res;
      } else {
        return {
          nick_name: row.nick_name,
          avatar: "",
        };
      }
    });

    await Promise.all(promiseList).then((result) => {
      result.forEach((r, index) => {
        if (r) {
          rows[index].dataValues.nick_name = r.nick_name;
          rows[index].dataValues.avatar = r.avatar;
        }
      });
    });

    // 判断当前登录用户是否点赞了
    if (user_id) {
      const promiseLikeList = rows.map((row) => {
        return getIsLikeByIdAndType({ for_id: row.id, type: 3, user_id });
      });
      await Promise.all(promiseLikeList).then((result) => {
        result.forEach((r, index) => {
          rows[index].dataValues.is_like = r;
        });
      });
    }

    // 获取每一条的评论条数
    const promiseCommentList = rows.map((row) => {
      return getCommentTotal({ for_id: row.id, type: 3 });
    });
    await Promise.all(promiseCommentList).then((result) => {
      result.forEach((r, index) => {
        rows[index].dataValues.comment_total = r;
      });
    });

    return {
      current,
      size,
      list: rows,
      total: count,
    };
  }

  /*
   * 获取所有留言
   */
  async getAllMessage() {
    const { rows, count } = await Message.findAndCountAll({
      order: [["createdAt", "DESC"]],
    });

    // 根据用户form_id获取用户当前的昵称和头像
    const promiseList = rows.map(async (row) => {
      let res;
      if (row.user_id) {
        res = await getOneUserInfo({ id: row.user_id });
        return res;
      } else {
        return {
          nick_name: row.nick_name,
          avatar: "",
        };
      }
    });

    await Promise.all(promiseList).then((result) => {
      result.forEach((r, index) => {
        if (r) {
          rows[index].dataValues.nick_name = r.nick_name;
          rows[index].dataValues.avatar = r.avatar;
        }
      });
    });

    return {
      list: rows,
      total: count,
    };
  }

  /**
   * 获取热门的标签
   */
  async getMessageTag() {
    let all = await Message.findAll();
    let arr = [];
    if (all.length) {
      all.forEach((v) => {
        if (v.dataValues.tag) {
          let index = arr.findIndex((item) => item.tag == v.dataValues.tag);
          if (index == -1) {
            arr.push({ tag: v.dataValues.tag, count: 1 });
          } else {
            arr[index].count++;
          }
        }
      });
    }

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].count > arr[i].count) {
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }

    return arr.slice(0, 10);
  }
}

module.exports = new MessageService();
