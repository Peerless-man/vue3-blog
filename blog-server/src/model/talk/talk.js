const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Talk = seq.define(
  "blog_talk",
  {
    content: {
      type: DataTypes.STRING(255),
      require: true,
      comment: "说说内容",
    },
    user_id: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "发布说说的用户id",
    },
    status: {
      type: DataTypes.INTEGER,
      require: true,
      defaultValue: 1,
      comment: "说说状态 1 公开 2 私密 3 回收站",
    },
    is_top: {
      type: DataTypes.INTEGER,
      require: true,
      defaultValue: 2,
      comment: "是否置顶 1 置顶 2 不置顶",
    },
    like_times: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "点赞次数",
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

// Talk.sync({ alter: true }); // 同步数据库表

module.exports = Talk;
