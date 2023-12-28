export default {
  path: "/article",
  redirect: "/article/articleList",
  meta: {
    icon: "list",
    title: "文章",
    // showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/article/articleList",
      name: "articleList",
      component: () => import("@/views/article/article-manage/index.vue"),
      meta: {
        title: "文章列表"
      }
    },
    {
      path: "/article/addArticle",
      name: "addArticle",
      component: () => import("@/views/article/add-edit-article/index.vue"),
      meta: {
        title: "新增文章"
      }
    },
    {
      path: "/article/editArticle",
      name: "editArticle",
      component: () => import("@/views/article/add-edit-article/index.vue"),
      meta: {
        showLink: false,
        title: "编辑文章"
      }
    },
    {
      path: "/article/tagManagement",
      name: "tagManagement",
      component: () => import("@/views/tag/index.vue"),
      meta: {
        title: "标签管理"
      }
    },
    {
      path: "/article/categoryManagement",
      name: "categoryManagement",
      component: () => import("@/views/category/index.vue"),
      meta: {
        title: "分类管理"
      }
    }
  ]
} as RouteConfigsTable;
