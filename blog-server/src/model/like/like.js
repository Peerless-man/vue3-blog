const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Like = seq.define(
  "blog_like",
  {
    type: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "点赞类型 1 文章 2 说说 3 留言 4 评论",
    },
    for_id: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "点赞的id 文章id 说说id 留言id",
    },
    user_id: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "点赞用户id",
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

// Like.sync({ alter: true }); //同步数据表

module.exports = Like;
