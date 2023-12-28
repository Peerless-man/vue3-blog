const swaggerJson = {
  openapi: "3.0.0",
  info: {
    title: "博客网站的api接口",
    version: "1.0.0",
    description: "API",
  },
  host: "localhost:8888",
  basePath: "/",
  paths: {
    // 所有的东西都往path中放
  },
  components: {},
  tags: [],
};

/**
 *
 * @param {*} pathname 接口路径
 * @param {*} obj 接口传参 参考swagger文档
 */
function genOpenApiMark(pathname, obj) {
  swaggerJson.paths[pathname] = obj;
}

module.exports = {
  swaggerJson,
  genOpenApiMark,
};
