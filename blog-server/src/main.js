const path = require("path");

const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const logger = require("koa-logger");
const parameter = require("koa-parameter");
const { koaBody } = require("koa-body"); // 新用法
const swagger = require("./utils/swagger"); // 存放swagger.js的位置，可以自行配置
const { koaSwagger } = require("koa2-swagger-ui");

const errorHandler = require("./app/errorHandler"); // 错误处理公共方法
const { UPLOADTYPE } = require("./config/config.default"); // 上传类型

const { initWebsocket } = require("./utils/websocket");

// error handler
onerror(app);

// 初始化文件上传
if (UPLOADTYPE == "qiniu" || UPLOADTYPE == "minio") {
  // middlewares
  app.use(
    koaBody({
      multipart: true, // 支持文件上传
    })
  );
} else if (UPLOADTYPE == "online") {
  // 上传到服务器
  app.use(
    koaBody({
      multipart: true, // 支持文件上传
      formidable: {
        uploadDir: path.join(__dirname, "./upload/online"), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      },
    })
  );
} else {
  // 本地上传
  app.use(
    koaBody({
      multipart: true, // 支持文件上传
      formidable: {
        uploadDir: path.join(__dirname, "./upload/local"), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      },
    })
  );
}

app.use(json());
app.use(logger());
// koa-static 博客图片静态访问
app.use(require("koa-static")(path.join(__dirname, "./upload")));

app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);

initWebsocket(); // 初始化websocket

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// router
// app.use(router.routes()).use(router.allowedMethods());
// 接口文档配置
app.use(swagger.routes(), swagger.allowedMethods());
// 接口文档
app.use(
  koaSwagger({
    routePrefix: "/swagger", // 接口文档访问地址
    swaggerOptions: {
      url: "/swagger.json", // example path to json 其实就是之后swagger-jsdoc生成的文档地址
    },
  })
);

// parameter
app.use(parameter(app));

// error-handling
app.on("error", errorHandler);

module.exports = app;
