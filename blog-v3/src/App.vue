<script setup>
import { ref, reactive, onMounted, h } from "vue";
import { isMobile, getWelcomeSay } from "@/utils/tool";
import { addView, getAllPageHeader } from "@/api/config";
import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";

import { storeToRefs } from "pinia";
import { user, staticData } from "@/store/index.js";

import MusicPlayer from "@/components/Music/index";
import BackTop from "@/components/BackTop/index";

const userStore = user();
const router = useRouter();
const route = useRoute();
const { getUserInfo } = storeToRefs(userStore);
const backTopProps = reactive({
  right: "",
  svgWidth: 0,
});
const showGoBack = ref(false);

const goBack = () => {
  router.go(-1);
};
// 监听窗口大小变化 用于修改回到顶部大小
const resize = () => {
  // 当前视口宽度
  let w = document.documentElement.clientWidth || document.body.clientWidth;
  if (w > "1280") {
    backTopProps.right = "5%";
    backTopProps.svgWidth = 7;
    showGoBack.value = false;
  } else if (w > "798" && w <= "1280") {
    backTopProps.right = "0";
    backTopProps.svgWidth = 6;
    showGoBack.value = false;
  } else {
    backTopProps.right = "0";
    backTopProps.svgWidth = 5;
    showGoBack.value = true;
  }
};
// 获取所有的网站页面背景图
const getAllPageHeaderBg = async () => {
  const res = await getAllPageHeader();
  if (res.code == 0) {
    staticData().setPageHeaderLIst(res.result);
  } else {
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
    });
  }
};

const welcome = () => {
  // 欢迎
  let msg = getWelcomeSay(getUserInfo.value.nick_name);
  if (getUserInfo.value.id == 3) {
    msg = "小婷光临，真是三生有幸";
  }
  ElNotification({
    offset: 60,
    title: "欢迎～",
    message: h("div", { style: "font-weight: 600;" }, msg),
  });
};

onMounted(async () => {
  // 上传访问量
  await addView();
  if (window.name == "") {
    // 获取背景图片
    getAllPageHeaderBg();
    welcome();
  }

  // 首次判断是手机还是pc
  backTopProps.right = isMobile() ? "0" : "5%";
  backTopProps.svgWidth = isMobile() ? 6 : 7;
  showGoBack.value = isMobile() && route.path != "/" ? true : false;
  // 全局增加窗口变化事件，对backTop的边距进行适配
  window.addEventListener("resize", resize);
});
</script>

<template>
  <div class="app">
    <router-view></router-view>
    <BackTop :right="backTopProps.right" :svgWidth="backTopProps.svgWidth" :rotateDeg="-42" />
    <i v-if="showGoBack" class="iconfont icon-fanhui" @click="goBack"></i>
    <MusicPlayer />
  </div>
</template>

<style lang="scss">
.app {
  width: 100%;
  box-sizing: border-box;
}

.icon-fanhui {
  position: fixed;
  left: 5px;
  top: 60px;
  font-size: 2.2rem;
  color: var(--font-color);
  z-index: 999;
}
</style>
