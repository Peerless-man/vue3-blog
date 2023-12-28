/*
 * @Description: 获取一些统计信息
 * @Author: M
 * @Date: 2023-03-20 11:02:29
 * @LastEditTime: 2023-03-20 11:18:52
 * @LastEditors: M
 */
const { getArticleCount } = require("../../service/article/index")
const { getTagCount } = require("../../service/tag/index")
const { getCategoryCount } = require("../../service/category/index")
const { getUserCount } = require("../../service/user/index")

const { result, ERRORCODE, throwError } = require("../../result/index")
const errorCode = ERRORCODE.STATISTIC

class Statistic {
  async homeGetStatistic(ctx) {
    try {
      let articleCount = await getArticleCount()
      let tagCount = await getTagCount()
      let categoryCount = await getCategoryCount()
      let userCount = await getUserCount()
      ctx.body = result("获取数据统计成功", {
        articleCount,
        tagCount,
        categoryCount,
        userCount,
      })
    } catch (err) {
      console.error(err)
      return ctx.app.emit("error", throwError(errorCode, "获取数据统计失败"), ctx)
    }
  }
}

module.exports = new Statistic()
