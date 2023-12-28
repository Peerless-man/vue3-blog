const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Header = seq.define(
  "blog_header",
  {
    route_name: {
      type: DataTypes.STRING(555),
      require: true,
      comment: "路由名称",
    },
    bg_url: {
      type: DataTypes.STRING, // STRING 默认255
      require: true,
      comment: "背景图",
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

// Header.sync({ alter: true }); //同步数据表

module.exports = Header;
