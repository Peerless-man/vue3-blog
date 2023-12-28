export default {
  path: "/photo",
  redirect: "/photo/photoAlbum",
  meta: {
    icon: "list",
    title: "相册管理",
    rank: 4
  },
  children: [
    {
      path: "/photo/photoAlbum",
      name: "albumList",
      component: () => import("@/views/photo/photoAlbum/index.vue"),
      meta: {
        title: "相册列表"
      }
    },
    {
      path: "/photo/photoList",
      name: "photoList",
      component: () => import("@/views/photo/photoList/index.vue"),
      meta: {
        showLink: false,
        title: "图片列表"
      }
    },
    {
      path: "/photo/addPhotos",
      name: "addPhotos",
      component: () => import("@/views/photo/photoList/add-photos.vue"),
      meta: {
        showLink: false,
        title: "新增图片"
      }
    }
  ]
} as RouteConfigsTable;
