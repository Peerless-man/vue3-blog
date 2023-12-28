export default {
  path: "/talk",
  redirect: "/talk/talkList",
  meta: {
    icon: "list",
    title: "说说",
    // showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/talk/talkList",
      name: "talkList",
      component: () => import("@/views/talk/talk-list/index.vue"),
      meta: {
        title: "说说列表"
      }
    },
    {
      path: "/talk/addTalk",
      name: "addTalk",
      component: () => import("@/views/talk/add-edit-talk/index.vue"),
      meta: {
        title: "发布说说",
        showLink: true
      }
    },
    {
      path: "/talk/editTalk",
      name: "editTalk",
      component: () => import("@/views/talk/add-edit-talk/index.vue"),
      meta: {
        showLink: false,
        title: "编辑说说"
      }
    }
  ]
} as RouteConfigsTable;
