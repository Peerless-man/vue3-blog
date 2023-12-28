<p align="center">
  <a href="http://39.108.51.116:443/#/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://img.shields.io/badge/%E5%B0%8F%E5%BC%A0%E7%9A%84%E5%8D%9A%E5%AE%A2-v1.0.0-lightgrey" alt="Blog logo">
  </a>
</p>

<p align="center">
  <a href="https://nodejs.org/en/about/releases/">
    <img src="https://img.shields.io/badge/node-v18.17.0-green" alt="node compatibility">
  </a>
  <a href="https://element-plus.gitee.io/zh-CN/">
    <img src="https://img.shields.io/badge/ElementPlus-v2.2.17-blue" alt="Element Plus">
  </a>
  <a href="https://nodejs.org/en/about/releases/">
    <img src="https://img.shields.io/badge/vite-4.4.0-purple" alt="node compatibility">
  </a>
  <a href="https://cn.vuejs.org/">
    <img src="https://img.shields.io/badge/Vue-v3.3.4-brightgreen" alt="Vue.js">
  </a>
  <a href="https://imzbf.github.io/md-editor-v3/docs#%F0%9F%A7%B1%20toolbarsExclude">
    <img src="https://img.shields.io/badge/md--editor--v3-v2.7.2-lightgrey" alt="md-editor-v3">
  </a>
  <a href="https://pinia.web3doc.top/">
    <img src="https://img.shields.io/badge/pinia-v2.0.28-yellowgreen" alt="pinia">
  </a>
  <a href="https://router.vuejs.org/zh/guide/">
    <img src="https://img.shields.io/badge/vue--router-v4.0.3-green" alt="vue-router">
  </a>
  <a href="https://vueuse.org/">
    <img src="https://img.shields.io/badge/vueuse-v%5E9.10.0-red" alt="vue-use">
  </a>
  <a href="https://www.axios-http.cn/docs/intro">
    <img src="https://img.shields.io/badge/axios-v%5E1.2.0-blueviolet" alt="axios">
  </a>
  <a href="https://www.dowebok.com/demo/2014/98/">
    <img src="https://img.shields.io/badge/animate-v%5E4.1.1-orange" alt="animate">
  </a>
</p>

## ⚡ 简介 introduction

前后端分离的个人博客项目 博客前台

已适配移动端、PC端，适合新手用于学习。

#### 前台

博客前台基于 vue3、element plus、pinia、axios、vue-router、vite、vue-use、npm、scss、tailwind.css 等主流技术

前台线上预览地址：<http://mrzym.top>

gitee 仓库地址：<https://gitee.com/mrzym/blog-v3>

#### 管理后台

博客管理后台基于 pureadmin、vue3、element plus、pinia、axios、vue-router、vue-use、pnpm、vite、sass、tailwindcss 等主流技术

后台线上预览地址：<http://mrzym.top/admin>

gitee 仓库地址： <https://gitee.com/mrzym/blog-v3-admin>

测试账户: test

密码: test123

也可以自行注册用户

#### 后端

博客后端基于node.js、koa、koa-router、koa-body、seqlize、mysql、qiniu(七牛云对象存储)、bcryptjs、nodemon等主流技术

gitee仓库地址：<https://gitee.com/mrzym/blogServer>

## 🚀 博客前台下载运行

```git
# pnpm 版本 v7.27.0
# node 版本 v18.17.0

1、下载项目
git clone https://gitee.com/mrzym/blog-v3.git
tips: 也可以下载zip打开，这样不会和我的仓库关联，也可以自己去解除关联
2、打开项目，安装依赖（安装依赖报错可以降低自己的npm版本或者网上百度解决方法，一般情况下不会有问题）
pnpm i
3、运行项目
pnpm run serve
```

## ✔️ 预览

#### 功能总览

| 模块         | 功能                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| 首页         | 分页查看文章、展示博客网站基础信息、博客公告、博主信息等                                       |
| 文章详情     | 浏览文章详情，根据当前文章进行文章推荐                                                         |
| 时间轴       | 根据文章发布时间展示文章                                                                       |
| 标签         | 展示博客所有的标签，点击标签会搜索出当前点击标签下的文章列表                                   |
| 分类         | 展示博客所有的分类，点击分类会搜索出当前点击分类下的文章列表                                   |
| 相册         | 展示博主的所有相册                                                                             |
| 友链         | 展示友链                                                                                       |
| 推荐网站     | 推荐一些博主知道的前端框架、有趣的网站，对学习有帮助的网站                                     |
| 相册详情     | 展示相册里的所有图片（懒加载）                                                                 |
| 说说         | 类似微信朋友圈的功能，支持发图片                                                               |
| 留言         | 可以自定义要发布的类型、发布的内容样式、图片等，还允许自己编写html                             |
| 用户注册     | 用户通过输入用户名注册                                                                         |
| 用户登录     | 已注册用户输入账户密码登录                                                                     |
| 修改个人信息 | 用户可修改自己的昵称、头像                                                                     |
| 消息通知     | 在用户发表一些内容的时候有对被评论用户的一个通知，没有接通邮箱，感兴趣的可以自己尝试           |
| 音乐         | 使用网易云项目的接口，自己写了一个音乐播放器，有分类排行榜、搜索音乐、播放音乐、显示歌词等功能 |

#### 功能开发

目前的功能是满足个人使用的，如果有更好玩的功能，可以推荐给我哦

## 🌈部署

博客文章会出一系列的部署教程

教程地址：<http://mrzym.top/#/articleList?id=2&type=category&name=%E5%8D%9A%E5%AE%A2%E9%83%A8%E7%BD%B2>

## 🥰感谢

感谢我所使用的这些技术框架的开发者、维护者，每一个框架、库的开发，都需要长时间的技术沉淀，充分的思考与不断地踩坑。维护开源库所需要花费的时间和精力更是常人所难以想象的。

如果大家喜欢这个项目的话，麻烦大家点个star、fork，你们的鼓励是我最大的动力。
