const Header = require("../../model/header/header");
/**
 * 头部背景图服务层
 */
class HeaderService {
  /**
   * 新增 / 修改 背景
   */
  async addOrUpdateHeader({ id, route_name, bg_url }) {
    let res;
    if (id) {
      res = await Header.update(
        { route_name, bg_url },
        {
          where: {
            id,
          },
        }
      );
    } else {
      res = await Header.create({ route_name, bg_url });
    }

    return res ? true : false;
  }

  /**
   * 根据id删除背景
   * @param {*} id
   * @returns
   */
  async deleteHeader(id) {
    let res = await Header.destroy({
      where: {
        id,
      },
    });

    return res ? res : null;
  }

  /**
   * 获取所有背景
   */
  async getAllHeader() {
    let header = await Header.findAll({
      attributes: ["id", "route_name", "bg_url"],
    });

    return header;
  }

  /**
   * 根据
   */
  async getOneByPath(route_name) {
    let header = await Header.findOne({
      where: {
        route_name,
      },
    });

    return header ? header.dataValues : null;
  }
}

module.exports = new HeaderService();
