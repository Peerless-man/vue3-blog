const { DataTypes } = require("sequelize")
const { Sequelize } = require("sequelize")
var moment = require("moment")

const seq = require("../../db/seq")

const Photo = seq.define(
  "blog_photo",
  {
    album_id: {
      type: DataTypes.INTEGER,
      require: true,
      comment: "相册 id 属于哪个相册",
    },
    url: {
      type: DataTypes.STRING(555),
      require: true,
      comment: "图片地址",
    },
    status: {
      type: DataTypes.INTEGER,
      require: true,
      defaultValue: 1,
      comment: "状态 1 正常 2 回收站",
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

//Photo.sync({ alter: true }) // 同步数据库表

module.exports = Photo
