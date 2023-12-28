export default {
  path: "/personal",
  redirect: "/personal/personalManage",
  meta: {
    icon: "userFilled",
    title: "个人中心",
    // showLink: false,
    rank: 10
  },
  children: [
    {
      path: "/personal/personalManage",
      name: "personalManage",
      component: () => import("@/views/personal/index.vue"),
      meta: {
        title: "个人中心"
      }
    }
  ]
} as RouteConfigsTable;
