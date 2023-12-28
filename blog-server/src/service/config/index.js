const Config = require("../../model/config/config");
/**
 * 网站设置服务层
 */
class ConfigService {
  async updateConfig(config) {
    const { id } = config;
    let one = await Config.findByPk(id);

    let res;
    if (one) {
      res = await Config.update(config, {
        where: {
          id,
        },
      });
    } else {
      res = await Config.create(config);
    }

    return res ? true : false;
  }

  async getConfig() {
    let res = await Config.findAll();
    // 这里不能反悔 res[0].dataValues 因为dataValues不能格式化时间
    return res.length ? res[0] : false;
  }

  async addView() {
    let res = await Config.findAll();
    let flag = false,
      config;
    if (res.length) {
      config = await Config.findByPk(res[0].dataValues.id);
      if (config) {
        config.increment(["view_time"], { by: 1 });
        flag = "添加成功";
      }
    } else {
      flag = "需要初始化";
    }

    return flag;
  }
}

module.exports = new ConfigService();
