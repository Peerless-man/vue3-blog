const { DataTypes } = require("sequelize")
const { Sequelize } = require("sequelize")
var moment = require("moment")

const seq = require("../../db/seq")

const Tag = seq.define(
  "blog_tag",
  {
    tag_name: {
      type: DataTypes.STRING(55),
      require: true,
      unique: true,
      comment: "标签名称 唯一",
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

// Tag.sync({ alter: true }) // 同步数据库表

module.exports = Tag
