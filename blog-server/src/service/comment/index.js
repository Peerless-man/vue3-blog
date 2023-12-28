const Comment = require("../../model/comment/comment");
const { Op } = require("sequelize");
const { getIpAddress } = require("../../utils/tool");
const { getOneUserInfo } = require("../user/index");
const { getIsLikeByIdAndType } = require("../like/index");

/**
 * 评论服务层
 */
class CommentService {
  /**
   * 新增评论
   * @param {*} comment
   * @returns Boolean
   */
  async createComment(comment) {
    const { type, for_id, from_id, from_name, from_avatar, content, ip } = comment;
    const res = await Comment.create({ type, for_id, from_id, from_name, from_avatar, content, ip });

    return res.dataValues;
  }

  /**
   * 回复评论
   * @param {*} comment
   * @returns Boolean
   */
  async applyComment(comment) {
    const { parent_id, type, for_id, from_id, from_avatar, from_name, to_id, to_name, to_avatar, content, ip } = comment;
    const res = await Comment.create({ parent_id, type, for_id, from_id, from_avatar, from_name, to_id, to_name, to_avatar, content, ip });

    return res.dataValues;
  }

  /**
   * 点赞评论
   * @param { id }
   */
  async thumbUpComment(id) {
    let comment = await Comment.findByPk(id);
    if (comment) {
      await comment.increment("thumbs_up", { by: 1 });
    }

    return comment ? true : false;
  }

  /**
   * 取消点赞评论
   * @param { id }
   */
  async cancelThumbUp(id) {
    let comment = await Comment.findByPk(id);
    if (comment) {
      await comment.decrement("thumbs_up", { by: 1 });
    }

    return comment ? true : false;
  }

  // 删除评论
  async deleteComment(id, parent_id) {
    let res;
    // 如果有父级评论 就只删除这一条
    if (parent_id > 0) {
      res = await Comment.destroy({
        where: {
          id,
        },
      });
    }
    // 如果没有父级评论 就删除这条评论 以及子级评论
    else {
      res = await Comment.destroy({
        where: {
          id,
        },
      });
      await Comment.destroy({
        where: {
          parent_id: id,
        },
      });
    }
    return res ? res : null;
  }

  /**
   * 后台分页获取评论列表
   * @param {*} content
   * @param {*} from_name 评论人昵称
   * @param {*} to_name 被回复人昵称
   * @param {*} time // 时间段
   * @returns
   */
  async backGetCommentList({ current, size, content, to_name, from_name, time }) {
    const whereOpt = {};
    const offset = (current - 1) * size;
    const limit = size * 1;

    content &&
      Object.assign(whereOpt, {
        content: {
          [Op.like]: `%${content}%`,
        },
      });
    to_name &&
      Object.assign(whereOpt, {
        name: {
          [Op.like]: `%${to_name}%`,
        },
      });
    from_name &&
      Object.assign(whereOpt, {
        name: {
          [Op.like]: `%${from_name}%`,
        },
      });
    time &&
      Object.assign(whereOpt, {
        createdAt: {
          [Op.between]: time,
        },
      });

    const { count, rows } = await Comment.findAndCountAll({
      offset,
      limit,
      where: whereOpt,
      order: [["createdAt", "DESC"]],
    });
    rows.forEach((r) => {
      r.dataValues.ipAddress = getIpAddress(r.dataValues.ip);
    });

    // 根据用户form_id获取用户当前的昵称和头像
    const promiseList1 = rows.map(async (row) => {
      let res;
      if (row.from_id) {
        res = await getOneUserInfo({ id: row.from_id });
      }
      return res;
    });

    await Promise.all(promiseList1).then((result) => {
      result.forEach((r, index) => {
        if (r) {
          rows[index].dataValues.from_avatar = r.avatar;
          rows[index].dataValues.form_name = r.nick_name;
        }
      });
    });

    // 根据用户to_id获取用户当前的昵称和头像
    const promiseList2 = rows.map(async (row) => {
      let res;
      if (row.to_id) {
        res = await getOneUserInfo({ id: row.to_id });
      }
      return res;
    });

    await Promise.all(promiseList2).then((result) => {
      result.forEach((r, index) => {
        if (r) {
          rows[index].dataValues.to_avatar = r.avatar;
          rows[index].dataValues.to_name = r.nick_name;
        }
      });
    });

    return {
      current: current,
      size: size,
      total: count,
      list: rows,
    };
  }

  /**
   * 前台分页获取父级评论
   * @param {*} type 说说还是评论 talk/article
   * @param {*} id 说说/评论id
   */
  async frontGetParentComment({ current, size, type, for_id, user_id, order }) {
    const whereOpt = {};
    const offset = (current - 1) * size;
    const limit = size * 1;
    type && Object.assign(whereOpt, { type });
    for_id && Object.assign(whereOpt, { for_id });
    Object.assign(whereOpt, { parent_id: null });

    const orderArr = order == "new" ? ["createdAt", "DESC"] : ["thumbs_up", "DESC"];
    const { count, rows } = await Comment.findAndCountAll({
      offset,
      limit,
      where: whereOpt,
      order: [orderArr],
    });
    rows.forEach((r) => {
      r.dataValues.ipAddress = getIpAddress(r.dataValues.ip);
    });
    // 根据用户id获取用户当前的昵称和头像
    const promiseList = rows.map(async (row) => {
      let res;
      if (row.dataValues.from_id) {
        res = await getOneUserInfo({ id: row.from_id });
      }
      return res;
    });

    await Promise.all(promiseList).then((result) => {
      result.forEach((r) => {
        if (r) {
          let index = rows.findIndex((row) => row.from_id == r.id);
          if (index != -1) {
            rows[index].dataValues.from_avatar = r.avatar;
            rows[index].dataValues.form_name = r.nick_name;
          }
        }
      });
    });
    // 判断当前登录用户是否点赞了
    if (user_id) {
      const promiseLikeList = rows.map((row) => {
        return getIsLikeByIdAndType({ for_id: row.id, type: 4, user_id });
      });
      await Promise.all(promiseLikeList).then((result) => {
        result.forEach((r, index) => {
          rows[index].dataValues.is_like = r;
        });
      });
    }

    return {
      current: current,
      size: size,
      total: count,
      list: rows,
    };
  }

  /**
   * 前台分页获取子评论
   * @param {*} parent_id 根据parent_id来查询
   * @param {*} type 说说还是评论 talk/article
   * @param {*} id 说说/评论id
   */
  async frontGetChildrenComment({ current, size, type, for_id, user_id, parent_id }) {
    const whereOpt = {};
    const offset = (current - 1) * size;
    const limit = size * 1;
    Object.assign(whereOpt, { type });
    Object.assign(whereOpt, { for_id });
    Object.assign(whereOpt, { parent_id: parent_id });

    const { count, rows } = await Comment.findAndCountAll({
      offset,
      limit,
      where: whereOpt,
      order: [["createdAt", "ASC"]],
    });
    rows.forEach((r) => {
      r.dataValues.ipAddress = getIpAddress(r.dataValues.ip);
    });

    // 根据用户form_id获取用户当前的昵称和头像
    const promiseList1 = rows.map(async (row) => {
      let res;
      if (row.dataValues.from_id) {
        res = await getOneUserInfo({ id: row.from_id });
      }
      return res;
    });

    await Promise.all(promiseList1).then((result) => {
      result.forEach((r, index) => {
        if (r) {
          rows[index].dataValues.from_avatar = r.avatar;
          rows[index].dataValues.form_name = r.nick_name;
        }
      });
    });

    // 根据用户to_id获取用户当前的昵称和头像
    const promiseList2 = rows.map(async (row) => {
      let res;
      if (row.dataValues.to_id) {
        res = await getOneUserInfo({ id: row.dataValues.to_id });
      }
      return res;
    });

    await Promise.all(promiseList2).then((result) => {
      result.forEach((r, index) => {
        if (r) {
          rows[index].dataValues.to_avatar = r.avatar;
          rows[index].dataValues.to_name = r.nick_name;
        }
      });
    });

    // 判断当前登录用户是否点赞了
    if (user_id) {
      const promiseLikeList = rows.map((row) => {
        return getIsLikeByIdAndType({ for_id: row.id, type: 4, user_id });
      });
      await Promise.all(promiseLikeList).then((result) => {
        result.forEach((r, index) => {
          rows[index].dataValues.is_like = r;
        });
      });
    }

    return {
      current: current,
      size: size,
      total: count,
      list: rows,
    };
  }

  // 根据 评论类型 和 类型对应的id获取评论总数
  async getCommentTotal({ for_id, type }) {
    const res = await Comment.count({
      where: {
        for_id,
        type
      }
    })

    return res
  }
}

module.exports = new CommentService();
