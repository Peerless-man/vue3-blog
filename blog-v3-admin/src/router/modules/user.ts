export default {
  path: "/user",
  redirect: "/user/userManagement",
  meta: {
    icon: "user",
    title: "用户管理",
    // showLink: false,
    rank: 8
  },
  children: [
    {
      path: "/user/userManagement",
      name: "userManagement",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
} as RouteConfigsTable;
