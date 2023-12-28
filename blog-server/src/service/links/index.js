const { Op } = require("sequelize");
const Links = require("../../model/links/links");
/**
 * 友链服务层
 */
class LinksService {
  /**
   * 新增/编辑友链
   */
  async addOrUpdateLinks({ id, site_name, site_desc, site_avatar, url, status, user_id }) {
    let res;
    if (id) {
      res = await Links.update(
        { site_name, site_desc, site_avatar, url, status },
        {
          where: {
            id,
          },
        }
      );
    } else {
      res = await Links.create({ site_name, site_desc, site_avatar, url, status: 1, user_id });
    }

    return res ? true : false;
  }

  /**
   * 批量删除友链
   * @param {*} idList
   * @returns
   */
  async deleteLinks(idList) {
    let res = await Links.destroy({
      where: {
        id: idList,
      },
    });

    return res ? res : null;
  }

  /**
   * 批量审核友链
   * @param {*} idList
   * @returns
   */
  async approveLinks(idList) {
    let res = await Links.update(
      { status: 2 },
      {
        where: {
          id: idList,
        },
      }
    );

    return res ? res : null;
  }

  /**
   * 分页获取友链
   */
  async getLinksList({ current, size, time, status, site_name }) {
    const offset = (current - 1) * size;
    const limit = size * 1;
    const whereOpt = {};
    site_name &&
      Object.assign(whereOpt, {
        site_name: {
          [Op.like]: `%${site_name}%`,
        },
      });
    status &&
      Object.assign(whereOpt, {
        status,
      });
    time &&
      Object.assign(whereOpt, {
        createdAt: {
          [Op.between]: time,
        },
      });
    const { rows, count } = await Links.findAndCountAll({
      limit,
      offset,
      where: whereOpt,
      order: [["createdAt", "ASC"]],
    });

    return {
      current,
      size,
      list: rows,
      total: count,
    };
  }
}

module.exports = new LinksService();
