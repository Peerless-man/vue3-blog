const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Message = seq.define(
  "blog_notify",
  {
    message: {
      type: DataTypes.STRING(555),
      require: true,
      comment: "通知内容",
    },
    user_id: {
      type: DataTypes.INTEGER, // STRING 默认255
      require: true,
      comment: "通知给谁",
    },
    type: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "通知类型 1 文章 2 说说 3 留言 4 友链",
    },
    to_id: {
      type: DataTypes.INTEGER, // STRING 默认255
      comment: "说说或者是文章的id 用于跳转",
    },
    isView: {
      type: DataTypes.INTEGER,
      require: true,
      defaultValue: 1,
      comment: "是否被查看 1 没有 2 已经查看",
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
// Message.sync({ alter: true }); //同步数据表

module.exports = Message;
