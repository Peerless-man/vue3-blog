const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
var moment = require("moment");

const seq = require("../../db/seq");

const Chat = seq.define(
  "blog_chat",
  {
    user_id: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "用户id 用于判断是谁发送的",
    },
    content: {
      type: DataTypes.STRING(555),
      require: true,
      comment: "聊天内容",
    },
    content_type: {
      type: DataTypes.STRING(55),
      require: true,
      comment: "聊天的内容格式 如果是文本就是text 图片就是 img",
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

// Chat.sync({ alter: true }); //同步数据表

module.exports = Chat;
