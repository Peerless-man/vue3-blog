const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Config = seq.define(
  "blog_config",
  {
    blog_name: {
      type: DataTypes.STRING(55),
      require: true,
      comment: "博客名称",
      defaultValue: "小张的博客",
    },
    blog_avatar: {
      type: DataTypes.STRING, // STRING 默认255
      require: true,
      comment: "博客头像",
      defaultValue: "https://mrzym.gitee.io/blogimg/html/rabbit.png",
    },
    avatar_bg: {
      type: DataTypes.STRING,
      require: true,
      comment: "博客头像背景图",
    },
    personal_say: {
      type: DataTypes.STRING,
      require: true,
      comment: "个人签名",
    },
    blog_notice: {
      type: DataTypes.STRING,
      comment: "博客公告",
    },
    qq_link: {
      type: DataTypes.STRING,
      require: true,
      comment: "qq链接",
    },
    we_chat_link: {
      type: DataTypes.STRING,
      require: true,
      comment: "微信链接",
    },
    github_link: {
      type: DataTypes.STRING,
      require: true,
      comment: "github链接",
    },
    git_ee_link: {
      type: DataTypes.STRING,
      require: true,
      comment: "git_ee链接",
    },
    bilibili_link: {
      type: DataTypes.STRING,
      require: true,
      comment: "bilibili链接",
    },
    view_time: {
      type: DataTypes.BIGINT,
      require: true,
      defaultValue: 0,
      comment: "博客被访问的次数",
    },
    we_chat_group: {
      type: DataTypes.STRING,
      comment: "微信群图片",
    },
    qq_group: {
      type: DataTypes.STRING,
      comment: "qq群图片",
    },
    we_chat_pay: {
      type: DataTypes.STRING,
      comment: "微信收款码",
    },
    ali_pay: {
      type: DataTypes.STRING,
      comment: "支付宝收款码",
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

// Config.sync({ alter: true }); //同步数据表

module.exports = Config;
