const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Message = seq.define(
  "blog_message",
  {
    message: {
      type: DataTypes.STRING(555),
      require: true,
      comment: "留言内容",
    },
    color: {
      type: DataTypes.STRING, // STRING 默认255
      comment: "字体颜色",
      defaultValue: '#676767'
    },
    font_size: {
      type: DataTypes.INTEGER, // STRING 默认255
      comment: "字体大小",
      defaultValue: 12,
    },
    font_weight: {
      type: DataTypes.INTEGER, // STRING 默认255
      comment: "字体宽度",
      defaultValue: 500,
    },
    bg_color: {
      type: DataTypes.STRING, // STRING 默认255
      comment: "背景颜色",
    },
    bg_url: {
      type: DataTypes.STRING, // STRING 默认255
      comment: "背景图片",
    },
    user_id: {
      type: DataTypes.INTEGER,
      comment: "留言用户的id",
    },
    nick_name: {
      type: DataTypes.STRING,
      comment: "游客用户的昵称",
    },
    tag: {
      type: DataTypes.STRING,
      comment: "标签",
    },
    like_times: {
      type: DataTypes.INTEGER,
      comment: "点赞次数",
      defaultValue: 0
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
