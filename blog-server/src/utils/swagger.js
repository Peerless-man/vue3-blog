const { APP_PORT } = require("../config/config.default");
const router = require("../router");

const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const swaggerDefinition = {
  //swagger-ui显示的基本信息，如标题、版本、描述
  info: {
    title: "小张的个人博客接口文档",
    version: "1.0.0",
    description: "API文档",
  },
  // 安全设置，支持apikey的方式直接定义http请求头
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  // 声明后，每个api右上角会出现一个小锁，支持输入API Key
  security: [
    {
      bearerAuth: [],
    },
  ],
  host: "localhost:" + APP_PORT, // 想着改这里，如果不修改，那么接口文档访问地址为：localhost:3000/swagger
  // 根路由
  basePath: "/", // Base path (optional)
  schemes: ["http", "https"],
};
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../router/*.js")], // 写有注解的router的存放地址, 最好path.join()
};
const swaggerSpec = swaggerJSDoc(options);
// 通过路由获取生成的注解文件
router.get("/swagger.json", async function (ctx) {
  ctx.set("Content-Type", "application/json");
  ctx.body = swaggerSpec;
});
module.exports = router;
