const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Links = seq.define(
  "blog_links",
  {
    site_name: {
      type: DataTypes.STRING(55),
      require: true,
      comment: "网站名称",
    },
    site_desc: {
      type: DataTypes.STRING, // STRING 默认255
      comment: "网站描述",
    },
    site_avatar: {
      type: DataTypes.STRING(555), // STRING 默认255
      comment: "网站头像",
    },
    url: {
      type: DataTypes.STRING, // STRING 默认255
      require: true,
      comment: "网站地址",
    },
    status: {
      type: DataTypes.INTEGER, // STRING 默认255
      require: true,
      comment: "友链状态 1 待审核 2 审核通过",
    },
    user_id: {
      type: DataTypes.STRING, // STRING 默认255
      require: true,
      comment: "申请者id",
    },
    createdAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    updatedAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss");
      },
    },
  },
  {
    freezeTableName: true, // 强制表名不转复数
  }
);

// Links.sync({ alter: true }); //同步数据表

module.exports = Links;
