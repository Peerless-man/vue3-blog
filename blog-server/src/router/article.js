/*
 * @Author: M
 * @Date: 2023-03-01 16:23:19
 * @Description: 用户路由
 * @LastEditTime: 2023-04-20 20:45:31
 * @LastEditors: M
 */

/**
 * @swagger
 * definitions:
 *   article:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: 文章id
 *      article_title:
 *        type: string
 *        description: 文章标题
 *      author_id:
 *        type: integer
 *        description: 作者id
 *      category_id:
 *        type: integer
 *        description: 分类id
 *      article_description:
 *        type: string
 *        description: 文章描述
 *      article_cover:
 *        type: string
 *        description: 文章封面
 *      is_top:
 *        type: integer
 *        description: 是否置顶 1 是 2 否
 *      order:
 *        type: integer
 *        description: 置顶的顺序 排序越小越靠前
 *      status:
 *        type: integer
 *        description: 文章状态 1 公开 2 私密 3 草稿
 *      type:
 *        type: integer
 *        description: 文章类型 1 原创 2 转载 3 翻译
 *      view_times:
 *        type: integer
 *        description: 文章访问次数
 *      thumbs_up_times:
 *        type: integer
 *        description: 文章点赞次数
 *      reading_duration:
 *        type: string
 *        description: 阅读时长
 *      categoryName:
 *        type: string
 *        description: 分类名称
 *      tagNameList:
 *        type: array
 *        items:
 *          type: string
 *        description: 标签列表
 *      createdAt:
 *        type: string
 *        description: 创建时间
 *      updatedAt:
 *        type: string
 *        description: 修改时间
 */

/**
 * @swagger
 * definitions:
 *   addOrEditArticle:
 *    type: object
 *    properties:
 *      article_title:
 *        type: string
 *        description: 文章标题
 *        required: true
 *      author_id:
 *        type: integer
 *        description: 作者id
 *        required: true
 *      article_description:
 *        type: string
 *        description: 文章描述
 *        required: true
 *      article_content:
 *        type: string
 *        description: 文章描述
 *        required: true
 *      article_cover:
 *        type: string
 *        description: 文章封面
 *        required: true
 *      is_top:
 *        type: integer
 *        description: 是否置顶 1 是 2 否
 *      order:
 *        type: integer
 *        description: 置顶的顺序 置顶才需要输入
 *      status:
 *        type: integer
 *        description: 文章状态 1 公开 2 私密 3 草稿
 *      type:
 *        type: integer
 *        description: 文章类型 1 原创 2 转载 3 翻译
 *      origin_url:
 *        type: string
 *        description: 原文链接 不是原创才加
 *      category:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 分类id
 *          category_name:
 *            type: string
 *            description: 分类名称
 *      tagList:
 *        type: array
 *        description: 标签列表
 *        items:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: 标签id
 *            tag_name:
 *              type: string
 *              description: 标签名称
 */
const Router = require("koa-router");

const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index");

const router = new Router({ prefix: "/article" });
const { createTimesLimiter } = require("../middleware/limit-request/index");

const {
  createArticle,
  updateArticle,
  updateTop,
  deleteArticle,
  revertArticle,
  toggleArticlePublic,
  getArticleList,
  getArticleInfoByTitle,
  getArticleById,
  blogHomeGetArticleList,
  blogTimelineGetArticleList,
  getArticleListByTagId,
  getArticleListByCategoryId,
  getRecommendArticleById,
  getArticleListByContent,
  getHotArticle,
  articleLike,
  cancelArticleLike,
  addReadingDuration,
} = require("../controller/article/index");

const { verifyArticleParam, verifyTopParam, verifyDelParam, updateJudgeTitleExist, createJudgeTitleExist } = require("../middleware/article/index");

const { updateUrl } = require("../service/article/index");

/** 后台 start */
/**
 * @swagger
 * /article/add:
 *   post:
 *     tags:
 *       - 文章/后台
 *     summary: 文章创建
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/addOrEditArticle'
 *     responses:
 *       200:
 *         description: 请求成功
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 文章创建
router.post("/add", auth, needAdminAuthNotNeedSuper, verifyArticleParam, createJudgeTitleExist, createArticle);
/**
 * @swagger
 * /article/update:
 *   put:
 *     tags:
 *       - 文章/后台
 *     summary: 文章修改
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           allOf:
 *              - type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: 文章id
 *              - $ref: '#/definitions/addOrEditArticle'
 *     responses:
 *       200:
 *         description: 请求成功
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 文章修改
router.put("/update", auth, needAdminAuthNotNeedSuper, verifyArticleParam, updateJudgeTitleExist, updateArticle);

/**
 * @swagger
 * /article/updateTop/{id}/{is_top}:
 *   put:
 *     tags:
 *       - 文章/后台
 *     summary: 修改文章置顶状态
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *       - name: is_top
 *         in: path
 *         required: true
 *         description: 是否置顶 1 是 2 否
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 修改文章置顶状态
router.put("/updateTop/:id/:is_top", auth, needAdminAuthNotNeedSuper, verifyTopParam, updateTop);

/**
 * @swagger
 * /article/delete/{id}/{status}:
 *   delete:
 *     tags:
 *       - 文章/后台
 *     summary: 删除文章
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *       - name: status
 *         in: path
 *         required: true
 *         description: 文章状态 文章是草稿才永久删除 否则状态变为草稿
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 删除文章
router.delete("/delete/:id/:status", auth, needAdminAuthNotNeedSuper, verifyDelParam, deleteArticle);

/**
 * @swagger
 * /article/revert/{id}:
 *   put:
 *     tags:
 *       - 文章/后台
 *     summary: 恢复文章
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 恢复文章
router.put("/revert/:id", auth, needAdminAuthNotNeedSuper, revertArticle);

/**
 * @swagger
 * /article/isPublic/{id}/{status}:
 *   put:
 *     tags:
 *       - 文章/后台
 *     summary: 切换文章私密性
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *       - name: status
 *         in: path
 *         required: true
 *         description: 文章状态 根据当前文章的状态来切换
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 切换文章私密性
router.put("/isPublic/:id/:status", auth, needAdminAuthNotNeedSuper, verifyDelParam, toggleArticlePublic);

/**
 * @swagger
 * /article/titleExist:
 *   post:
 *     tags:
 *       - 文章/后台
 *     summary: 根据文章标题判断文章是否被注册过
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           properties:
 *             id:
 *               type: integer
 *               description: 文章id 如果有id就判断除了和自己一样的名称以外还有没有重复的 如果 没有文章id就判断此标题和所有的标题是否重复了
 *             article_title:
 *               type: string
 *               description: 文章标题
 *     responses:
 *       200:
 *         description: 请求成功
 *         result:
 *           type: boolean
 *           description: true 表示重复 false 表示不重复
 *       500:
 *         description: 服务端错误
 */
// 根据文章标题判断文章是否被注册过
router.post("/titleExist", getArticleInfoByTitle);

/**
 * @swagger
 * /article/getArticleList:
 *   post:
 *     tags:
 *       - 文章/后台
 *     summary: 后台分页获取文章
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             current:
 *               type: integer
 *               default: 1
 *               description: 当前页码
 *             size:
 *               type: integer
 *               default: 10
 *               description: 分页大小
 *             article_title:
 *               type: string
 *               default: null
 *               description: 文章标题
 *             is_top:
 *               type: integer
 *               default: null
 *               description: 是否置顶 1 是 2 否
 *             status:
 *               type: integer
 *               default: null
 *               description: 文章状态 1 公开 2 私密 3 草稿箱
 *             tag_id:
 *               type: integer
 *               default: null
 *               description: 标签id
 *             category_id:
 *               type: integer
 *               default: null
 *               description: 分类id
 *             create_time:
 *               type: string
 *               default: null
 *               description: 创建时间
 *     responses:
 *       200:
 *         description: 请求成功
 *         schema:
 *           type: object
 *           properties:
 *             current:
 *               description: 当前页码
 *               type: integer
 *             size:
 *               description: 分页大小
 *               type: integer
 *             list:
 *               description: 文章列表
 *               type: array
 *               items:
 *                 $ref: '#/definitions/article'
 *             total:
 *               type: integer
 *               description: 总数
 *       401:
 *         description: 没有权限
 *       500:
 *         description: 服务端错误
 */
// 分页获取文章
router.post("/getArticleList", auth, getArticleList);
/** 后台 end */

/** 前台 start */
/**
 * @swagger
 * /article/blogHomeGetArticleList/{current}/{size}:
 *   get:
 *     tags:
 *       - 文章/前台
 *     summary: 分页获取文章 按照置顶和发布时间倒序排序
 *     parameters:
 *       - name: current
 *         in: path
 *         required: true
 *         description: 当前页码
 *         type: integer
 *       - name: size
 *         in: path
 *         required: true
 *         description: 分页大小
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 分页获取文章 按照置顶和发布时间倒序排序
router.get("/blogHomeGetArticleList/:current/:size", blogHomeGetArticleList);

/**
 * @swagger
 * /article/blogTimelineGetArticleList/{current}/{size}:
 *   get:
 *     tags:
 *       - 文章/前台
 *     summary: 分页获取时间轴信息
 *     parameters:
 *       - name: current
 *         in: path
 *         required: true
 *         description: 当前页码
 *         type: integer
 *       - name: size
 *         in: path
 *         required: true
 *         description: 分页大小
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 分页获取时间轴信息
router.get("/blogTimelineGetArticleList/:current/:size", blogTimelineGetArticleList);

/**
 * @swagger
 * /article/getArticleListByTagId:
 *   post:
 *     tags:
 *       - 文章/前台
 *     summary: 分页获取该标签下文章的简略信息
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           properties:
 *             id:
 *               type: integer
 *               description: 标签id
 *             current:
 *               type: integer
 *               description: 当前页码
 *             size:
 *               type: integer
 *               description: 分页大小
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 分页获取该标签下文章的简略信息
router.post("/getArticleListByTagId", getArticleListByTagId);

/**
 * @swagger
 * /article/getArticleListByCategoryId:
 *   post:
 *     tags:
 *       - 文章/前台
 *     summary: 分页获取该分类下文章的简略信息
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           properties:
 *             id:
 *               type: integer
 *               description: 分类id
 *             current:
 *               type: integer
 *               description: 当前页码
 *             size:
 *               type: integer
 *               description: 分页大小
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 分页获取该分类下文章的简略信息
router.post("/getArticleListByCategoryId", getArticleListByCategoryId);

/**
 * @swagger
 * /article/getRecommendArticleById/{id}:
 *   get:
 *     tags:
 *       - 文章/前台
 *     summary: 根据文章id获取上下一篇文章 和推荐文章
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 根据文章id获取上下一篇文章 和推荐文章
router.get("/getRecommendArticleById/:id", getRecommendArticleById);

/**
 * @swagger
 * /article/getArticleListByContent/{content}:
 *   get:
 *     tags:
 *       - 文章/前台
 *     summary: 根据文章id获取上下一篇文章 和推荐文章
 *     parameters:
 *       - name: content
 *         in: path
 *         required: true
 *         description: 搜索内容
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 文章全局搜索
router.get("/getArticleListByContent/:content", getArticleListByContent);

/**
 * @swagger
 * /article/getHotArticle:
 *   get:
 *     tags:
 *       - 文章/前台
 *     summary: 获取热门文章
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 获取热门文章
router.get("/getHotArticle", getHotArticle);

/**
 * @swagger
 * /article/like/{id}:
 *   put:
 *     tags:
 *       - 文章/前台
 *     summary: 文章点赞
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 文章点赞
router.put(
  "/like/:id",
  createTimesLimiter({
    prefixKey: "put/article/like/:id",
    message: "文章点赞过于频繁 请稍后再试",
    max: 10,
  }),
  articleLike
);

/**
 * @swagger
 * /article/cancelLike/{id}:
 *   put:
 *     tags:
 *       - 文章/前台
 *     summary: 取消点赞
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 取消点赞
router.put(
  "/cancelLike/:id",
  createTimesLimiter({
    prefixKey: "put/article/cancelLike/:id",
    message: "取消文章点赞过于频繁 请稍后再试",
    max: 10,
  }),
  cancelArticleLike
);

/**
 * @swagger
 * /article/addReadingDuration/{id}/{duration}:
 *   put:
 *     tags:
 *       - 文章/前台
 *     summary: 取消点赞
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *       - name: duration
 *         in: path
 *         required: true
 *         description: 阅读时长 ms
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 增加文章阅读时长 毫秒
router.put("/addReadingDuration/:id/:duration", addReadingDuration);

/** 前台 end */

/** 公共 start */

/**
 * @swagger
 * /article/getArticleById/{id}:
 *   get:
 *     tags:
 *       - 文章/前台
 *     summary: 根据id获取文章详情
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 文章id
 *         type: integer
 *     responses:
 *       200:
 *         description: 请求成功
 *       500:
 *         description: 服务端错误
 */
// 根据id获取文章详情
router.get("/getArticleById/:id", getArticleById);
/** 公共 end */

// 批量替换url
// 文章cover图片地址整体迁移 修改全部文章的url地址 主要是之前七牛云的域名不是当前的
router.post("/updateUrl", updateUrl);

module.exports = router;
