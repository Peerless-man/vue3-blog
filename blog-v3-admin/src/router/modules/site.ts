export default {
  path: "/site",
  redirect: "/site/siteManagement",
  meta: {
    icon: "setting",
    title: "网站管理",
    // showLink: false,
    rank: 11
  },
  children: [
    {
      path: "/site/siteManagement",
      name: "siteManagement",
      component: () => import("@/views/site/site.vue"),
      meta: {
        title: "博客网站信息管理"
      }
    },
    {
      path: "/site/headerManagement",
      name: "headerManagement",
      component: () => import("@/views/pageheader/index.vue"),
      meta: {
        title: "背景管理"
      }
    },
    {
      path: "/site/messageManagement",
      name: "messageManagement",
      component: () => import("@/views/message/index.vue"),
      meta: {
        title: "留言管理"
      }
    },
    {
      path: "/site/links",
      name: "linksManagement",
      component: () => import("@/views/links/index.vue"),
      meta: {
        title: "友链管理"
      }
    }
  ]
} as RouteConfigsTable;
