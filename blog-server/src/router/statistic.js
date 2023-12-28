/**
 * 数据统计路由
 * @author: M
 */
const Router = require("koa-router")
const router = new Router({ prefix: "/statistic" })

const { homeGetStatistic } = require("../controller/statistic/index")

// 获取数据统计
router.get("/", homeGetStatistic)

module.exports = router
