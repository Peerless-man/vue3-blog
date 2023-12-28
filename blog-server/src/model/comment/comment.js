const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");
// 评论表
const Comment = seq.define(
  "blog_comment",
  {
    parent_id: {
      type: DataTypes.INTEGER,
      require: false,
      comment: "评论父级id",
    },
    type: {
      type: DataTypes.INTEGER,
      require: false,
      comment: "评论类型 1 文章 2 说说 3 留言 ...",
    },
    for_id: {
      type: DataTypes.INTEGER,
      require: false,
      comment: "评论的对象id 比如说说id、文章id等",
    },
    from_id: {
      type: DataTypes.INTEGER,
      require: false,
      comment: "评论人id",
    },
    from_name: {
      type: DataTypes.STRING, // STRING 默认255
      require: false,
      comment: "评论人昵称",
    },
    from_avatar: {
      type: DataTypes.STRING(555), // STRING 默认255
      require: false,
      comment: "评论人头像",
    },
    to_id: {
      type: DataTypes.INTEGER,
      require: false,
      comment: "被回复的人id",
    },
    to_name: {
      type: DataTypes.STRING, // STRING 默认255
      require: false,
      comment: "被回复人的昵称",
    },
    to_avatar: {
      type: DataTypes.STRING(555), // STRING 默认255
      require: false,
      comment: "被回复人的头像",
    },
    content: {
      type: DataTypes.STRING(555), // STRING 默认255
      require: true,
      comment: "评论内容",
    },
    thumbs_up: {
      type: DataTypes.INTEGER,
      require: false,
      defaultValue: 0,
      comment: "评论点赞数",
    },
    ip: {
      type: DataTypes.STRING, // STRING 默认255
      require: false,
      comment: "ip地址",
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

// Comment.sync({ alter: true }); //同步数据表

module.exports = Comment;
