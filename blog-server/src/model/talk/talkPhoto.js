const { DataTypes } = require("sequelize")
const { Sequelize } = require("sequelize")
var moment = require("moment")

const seq = require("../../db/seq")

const TalkPhoto = seq.define(
  "blog_talk_photo",
  {
    talk_id: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "说说的id",
    },
    url: {
      type: DataTypes.STRING(255),
      require: true,
      comment: "图片地址",
    },
    createdAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss")
      },
    },
    updatedAt: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss")
      },
    },
  },
  {
    freezeTableName: true, // 强制表名不转复数
  }
)

// TalkPhoto.sync({ alter: true }) // 同步数据库表

module.exports = TalkPhoto
