/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : online_blog

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 01/09/2024 12:26:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for blog_article
-- ----------------------------
DROP TABLE IF EXISTS `blog_article`;
CREATE TABLE `blog_article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_title` varchar(255) DEFAULT NULL COMMENT '文章标题 不能为空',
  `author_id` int DEFAULT '1' COMMENT '文章作者 不能为空',
  `category_id` int DEFAULT NULL COMMENT '分类id 不能为空',
  `article_content` text COMMENT '文章内容',
  `article_cover` varchar(1234) DEFAULT '	https://mrzym.gitee.io/blogimg/html/rabbit.png' COMMENT '文章缩略图',
  `is_top` int DEFAULT '2' COMMENT '是否置顶 1 置顶 2 取消置顶',
  `status` int DEFAULT '1' COMMENT '文章状态  1 公开 2 私密 3 草稿箱',
  `type` int DEFAULT '1' COMMENT '文章类型 1 原创 2 转载 3 翻译',
  `origin_url` varchar(255) DEFAULT NULL COMMENT '原文链接 是转载或翻译的情况下提供',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `view_times` int DEFAULT '0' COMMENT '文章访问次数',
  `article_description` varchar(255) DEFAULT NULL COMMENT '描述信息 不能为空',
  `thumbs_up_times` int DEFAULT '0' COMMENT '文章点赞次数',
  `reading_duration` double DEFAULT '0' COMMENT '文章阅读时长',
  `order` int DEFAULT NULL COMMENT '排序 1 最大 往后越小 用于置顶文章的排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_article_tag
-- ----------------------------
DROP TABLE IF EXISTS `blog_article_tag`;
CREATE TABLE `blog_article_tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int DEFAULT NULL COMMENT '文章id',
  `tag_id` int DEFAULT NULL COMMENT '标签id',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=356 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_category
-- ----------------------------
DROP TABLE IF EXISTS `blog_category`;
CREATE TABLE `blog_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(55) DEFAULT NULL COMMENT '分类名称 唯一',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `category_name` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_2` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_3` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_4` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_5` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_6` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_7` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_8` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_9` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_10` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_11` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_12` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_13` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_14` (`category_name`) USING BTREE,
  UNIQUE KEY `category_name_15` (`category_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_chat
-- ----------------------------
DROP TABLE IF EXISTS `blog_chat`;
CREATE TABLE `blog_chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT '用户id 用于判断是谁发送的',
  `content` varchar(555) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '聊天内容',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `content_type` varchar(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '聊天的内容格式 如果是文本就是text 图片就是 img',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for blog_comment
-- ----------------------------
DROP TABLE IF EXISTS `blog_comment`;
CREATE TABLE `blog_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL COMMENT '评论父级id',
  `for_id` int DEFAULT NULL COMMENT '评论的对象id 比如说说id、文章id等',
  `type` int DEFAULT NULL COMMENT '评论类型 1 文章 2 说说 3 留言 ...',
  `from_id` int DEFAULT NULL COMMENT '评论人id',
  `from_name` varchar(255) DEFAULT NULL COMMENT '评论人昵称',
  `from_avatar` varchar(555) DEFAULT NULL COMMENT '评论人头像',
  `to_id` int DEFAULT NULL COMMENT '被回复的人id',
  `to_name` varchar(255) DEFAULT NULL COMMENT '被回复人的昵称',
  `to_avatar` varchar(555) DEFAULT NULL COMMENT '被回复人的头像',
  `content` varchar(555) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '评论内容',
  `thumbs_up` int DEFAULT '0' COMMENT '评论点赞数',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL COMMENT 'ip地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=489 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for blog_config
-- ----------------------------
DROP TABLE IF EXISTS `blog_config`;
CREATE TABLE `blog_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_name` varchar(55) DEFAULT '小张的博客' COMMENT '博客名称',
  `blog_avatar` varchar(255) DEFAULT 'https://mrzym.gitee.io/blogimg/html/rabbit.png' COMMENT '博客头像',
  `avatar_bg` varchar(255) DEFAULT NULL COMMENT '博客头像背景图',
  `personal_say` varchar(255) DEFAULT NULL COMMENT '个人签名',
  `blog_notice` varchar(255) DEFAULT NULL COMMENT '博客公告',
  `qq_link` varchar(255) DEFAULT NULL COMMENT 'qq链接',
  `we_chat_link` varchar(255) DEFAULT NULL COMMENT '微信链接',
  `github_link` varchar(255) DEFAULT NULL COMMENT 'github链接',
  `git_ee_link` varchar(255) DEFAULT NULL COMMENT 'git_ee链接',
  `bilibili_link` varchar(255) DEFAULT NULL COMMENT 'bilibili链接',
  `view_time` bigint DEFAULT '0' COMMENT '博客被访问的次数',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `we_chat_group` varchar(255) DEFAULT NULL COMMENT '微信群图片',
  `qq_group` varchar(255) DEFAULT NULL COMMENT 'qq群图片',
  `we_chat_pay` varchar(255) DEFAULT NULL COMMENT '微信收款码',
  `ali_pay` varchar(255) DEFAULT NULL COMMENT '支付宝收款码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_header
-- ----------------------------
DROP TABLE IF EXISTS `blog_header`;
CREATE TABLE `blog_header` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bg_url` varchar(255) DEFAULT NULL COMMENT '背景图',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `route_name` varchar(555) DEFAULT NULL COMMENT '路由名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for blog_like
-- ----------------------------
DROP TABLE IF EXISTS `blog_like`;
CREATE TABLE `blog_like` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int DEFAULT NULL COMMENT '点赞类型 1 文章 2 说说 3 留言 4 评论',
  `for_id` int DEFAULT NULL COMMENT '点赞的id 文章id 说说id 留言id',
  `user_id` int DEFAULT NULL COMMENT '点赞用户id',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL COMMENT '点赞ip',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=930 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for blog_links
-- ----------------------------
DROP TABLE IF EXISTS `blog_links`;
CREATE TABLE `blog_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_name` varchar(55) DEFAULT NULL COMMENT '网站名称',
  `site_desc` varchar(255) DEFAULT NULL COMMENT '网站描述',
  `site_avatar` varchar(555) DEFAULT NULL COMMENT '网站头像',
  `url` varchar(255) DEFAULT NULL COMMENT '网站地址',
  `status` int DEFAULT NULL COMMENT '友链状态 1 待审核 2 审核通过',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL COMMENT '申请者id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for blog_message
-- ----------------------------
DROP TABLE IF EXISTS `blog_message`;
CREATE TABLE `blog_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) DEFAULT NULL COMMENT '标签',
  `message` varchar(555) DEFAULT NULL COMMENT '留言内容',
  `color` varchar(255) DEFAULT '#676767' COMMENT '字体颜色',
  `font_size` int DEFAULT '12' COMMENT '字体大小',
  `bg_color` varchar(255) DEFAULT NULL COMMENT '背景颜色',
  `bg_url` varchar(255) DEFAULT NULL COMMENT '背景图片',
  `user_id` int DEFAULT NULL COMMENT '留言用户的id',
  `like_times` int DEFAULT '0' COMMENT '点赞次数',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `font_weight` int DEFAULT '500' COMMENT '字体宽度',
  `nick_name` varchar(255) DEFAULT NULL COMMENT '游客用户的昵称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3465 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for blog_notify
-- ----------------------------
DROP TABLE IF EXISTS `blog_notify`;
CREATE TABLE `blog_notify` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(555) DEFAULT NULL COMMENT '通知内容',
  `user_id` int DEFAULT NULL COMMENT '通知给谁',
  `type` int DEFAULT NULL COMMENT '通知类型 1 文章 2 说说 3 留言 4 友链',
  `to_id` int DEFAULT NULL COMMENT '说说或者是文章的id 用于跳转',
  `isView` int DEFAULT '1' COMMENT '是否被查看 1 没有 2 已经查看',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3839 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for blog_photo
-- ----------------------------
DROP TABLE IF EXISTS `blog_photo`;
CREATE TABLE `blog_photo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `album_id` int DEFAULT NULL COMMENT '相册 id 属于哪个相册',
  `url` varchar(555) DEFAULT NULL COMMENT '图片地址',
  `status` int DEFAULT '1' COMMENT '状态 1 正常 2 回收站',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_photo_album
-- ----------------------------
DROP TABLE IF EXISTS `blog_photo_album`;
CREATE TABLE `blog_photo_album` (
  `id` int NOT NULL AUTO_INCREMENT,
  `album_name` varchar(26) DEFAULT NULL COMMENT '相册名称',
  `description` varchar(55) DEFAULT NULL COMMENT '相册描述信息',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `album_cover` varchar(555) DEFAULT NULL COMMENT '相册封面',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_recommend
-- ----------------------------
DROP TABLE IF EXISTS `blog_recommend`;
CREATE TABLE `blog_recommend` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(55) DEFAULT NULL COMMENT '推荐网站标题',
  `link` varchar(255) DEFAULT NULL COMMENT '网站地址',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_tag
-- ----------------------------
DROP TABLE IF EXISTS `blog_tag`;
CREATE TABLE `blog_tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(55) DEFAULT NULL COMMENT '标签名称 唯一',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `tag_name` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_2` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_3` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_4` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_5` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_6` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_7` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_8` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_9` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_10` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_11` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_12` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_13` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_14` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_15` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_16` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_17` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_18` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_19` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_20` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_21` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_22` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_23` (`tag_name`) USING BTREE,
  UNIQUE KEY `tag_name_24` (`tag_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_talk
-- ----------------------------
DROP TABLE IF EXISTS `blog_talk`;
CREATE TABLE `blog_talk` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT '发布说说的用户id',
  `content` varchar(255) DEFAULT NULL COMMENT '说说内容',
  `status` int DEFAULT '1' COMMENT '说说状态 1 公开 2 私密 3 回收站',
  `is_top` int DEFAULT '2' COMMENT '是否置顶 1 置顶 2 不置顶',
  `like_times` int DEFAULT '0' COMMENT '点赞次数',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_talk_photo
-- ----------------------------
DROP TABLE IF EXISTS `blog_talk_photo`;
CREATE TABLE `blog_talk_photo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `talk_id` int DEFAULT NULL COMMENT '说说的id',
  `url` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for blog_user
-- ----------------------------
DROP TABLE IF EXISTS `blog_user`;
CREATE TABLE `blog_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '账号，唯一',
  `password` char(64) NOT NULL COMMENT '密码',
  `role` int NOT NULL DEFAULT '2' COMMENT '用户角色 1 管理员 2 普通用户',
  `nick_name` varchar(255) DEFAULT '' COMMENT '用户昵称',
  `avatar` varchar(255) DEFAULT '' COMMENT '用户头像',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `qq` varchar(255) DEFAULT '' COMMENT '用户QQ 用于联系',
  `ip` varchar(255) DEFAULT '' COMMENT 'ip属地',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `username_2` (`username`) USING BTREE,
  UNIQUE KEY `username_3` (`username`) USING BTREE,
  UNIQUE KEY `username_4` (`username`) USING BTREE,
  UNIQUE KEY `username_5` (`username`) USING BTREE,
  UNIQUE KEY `username_6` (`username`) USING BTREE,
  UNIQUE KEY `username_7` (`username`) USING BTREE,
  UNIQUE KEY `username_8` (`username`) USING BTREE,
  UNIQUE KEY `username_9` (`username`) USING BTREE,
  UNIQUE KEY `username_10` (`username`) USING BTREE,
  UNIQUE KEY `username_11` (`username`) USING BTREE,
  UNIQUE KEY `username_12` (`username`) USING BTREE,
  UNIQUE KEY `username_13` (`username`) USING BTREE,
  UNIQUE KEY `username_14` (`username`) USING BTREE,
  UNIQUE KEY `username_15` (`username`) USING BTREE,
  UNIQUE KEY `username_16` (`username`) USING BTREE,
  UNIQUE KEY `username_17` (`username`) USING BTREE,
  UNIQUE KEY `username_18` (`username`) USING BTREE,
  UNIQUE KEY `username_19` (`username`) USING BTREE,
  UNIQUE KEY `username_20` (`username`) USING BTREE,
  UNIQUE KEY `username_21` (`username`) USING BTREE,
  UNIQUE KEY `username_22` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=522 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
