import { defineStore } from "pinia";
import { store } from "@/store";

// 存放静态数据
export const useStaticStore = defineStore({
  id: "pure-static",
  state: () => ({
    articleTab: [
      {
        key: "",
        content: "所有文章",
        title: "所有文章"
      },
      {
        key: 1,
        content: "公开文章",
        title: "公开文章"
      },
      {
        key: 2,
        content: "私密文章",
        title: "私密文章"
      },
      {
        key: 3,
        content: "草稿箱",
        title: "草稿箱"
      }
    ],
    linksTab: [
      {
        key: "",
        content: "所有友链",
        title: "所有友链"
      },
      {
        key: 1,
        content: "待审核",
        title: "待审核"
      },
      {
        key: 2,
        content: "审核通过",
        title: "审核通过"
      }
    ],

    photoTab: [
      {
        key: 1,
        content: "相册图片",
        title: "相册图片"
      },
      {
        key: 2,
        content: "回收站",
        title: "回收站"
      }
    ]
  }),
  getters: {
    getArticleTab() {
      return this.articleTab;
    }
  },
  actions: {}
});

export function useStaticStoreHook() {
  return useStaticStore(store);
}
