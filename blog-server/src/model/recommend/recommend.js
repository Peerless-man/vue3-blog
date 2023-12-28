const { DataTypes } = require("sequelize")
const { Sequelize } = require("sequelize")
var moment = require("moment")

const seq = require("../../db/seq")

const Recommend = seq.define(
  "blog_recommend",
  {
    title: {
      type: DataTypes.STRING(55),
      require: true,
      comment: "推荐网站标题",
    },
    link: {
      type: DataTypes.STRING, // STRING 默认255
      require: true,
      comment: "网站地址",
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

Recommend.sync({ alter: true }) //同步数据表

module.exports = Recommend
