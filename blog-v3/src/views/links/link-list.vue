<!--友链列表  -->
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, h } from "vue";
import { getFriendLinks } from "@/api/links";
import { homeGetConfig } from "@/api/config";
import { Edit } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";

import { user } from "@/store/index.js";
import { storeToRefs } from "pinia";

import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
import linkApply from "./link-apply.vue";
import { _removeLocalItem, _setLocalItem } from "@/utils/tool";

const { getUserInfo } = storeToRefs(user());

const active = ref(0);
const activeType = ref("");
const loading = ref(false);
const scrollLoading = ref(false);
const params = reactive({
  current: 1,
  size: 6,
  status: 2,
});

const linksList = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const applyType = ref("add");
const blogName = ref("");
let observe;
let box;

// 鼠标进入触发
const mouseEnterItem = (type, index) => {
  activeType.value = type;
  active.value = index;
};
// 鼠标离开触发
const mouseLeaveItem = () => {
  activeType.value = "";
  active.value = 0;
};
const goToSite = (url) => {
  window.open(url);
};

const updateLink = (item) => {
  _setLocalItem("blog-link-update", item);
  dialogVisible.value = true;
  applyType.value = "edit";
};

const observeBox = () => {
  // 获取要监听的元素
  box = document.querySelector(".observer");
  observe = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (e) => {
        if (e.isIntersecting && e.intersectionRatio > 0) {
          if (total.value > linksList.value.length) {
            params.current++;
            pageGetLinksList(e);
          }
        }
      });
    },
    { rootMargin: "0px 0px 300px 0px" }
  );
  observe.observe(box);
};

const returnUrl = (url) => {
  const end = url.substring(url.length - 1);
  return end != "/" ? url + "/favicon.ico" : url + "favicon.ico";
};

const pageGetLinksList = async () => {
  try {
    if (params.current == 1) {
      loading.value = true;
    } else {
      scrollLoading.value = true;
    }
    const res = await getFriendLinks(params);
    if (res && res.code == 0) {
      linksList.value =
        params.current == 1 ? res.result.list : linksList.value.concat(res.result.list);
      total.value = res.result.total - 0;
    }
  } finally {
    loading.value = false;
    scrollLoading.value = false;
  }
};

const applyLinks = () => {
  if (getUserInfo.value.id) {
    dialogVisible.value = true;
    applyType.value = "add";
  } else {
    ElNotification({
      offset: 60,
      title: "温馨提示",
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请先登录"),
    });
  }
};

// 获取网站详细信息
const getConfigDetail = async () => {
  let res = await homeGetConfig();
  if (res.code == 0 && typeof res.result != "string") {
    blogName.value = res.result.blog_name;
  }
};

onMounted(async () => {
  _removeLocalItem("blog-link-update");
  await getConfigDetail();
  await pageGetLinksList();
  if (linksList.value.length < total.value) {
    observeBox();
  }
});

onBeforeUnmount(() => {
  observe && observe.unobserve(box);
  observe = null;
});
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="center_box">
    <el-card class="!m-[3px] !p-[10px]">
      <el-descriptions :column="1">
        <template #title>
          <div class="desc-title">{{ "欢迎来到" + blogName }}</div>
        </template>
        <el-descriptions-item label="博客链接"
          ><span v-copy="'http://mrzym.top/'" class="!cursor-pointer">http://mrzym.top/</span>
        </el-descriptions-item>
        <el-descriptions-item label="QQ">
          <span v-copy="'2715158815'" class="!cursor-pointer">2715158815</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <span class="desc-remark" style="text-shadow: none">
            快来申请小张的友链吧
            <span class="apply-button" @click="applyLinks">友链申请</span>
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-skeleton :loading="loading" style="height: 100%" animated>
      <template #template>
        <div class="flex justify-start w-[100%] !mt-[10px]" v-for="i in 2" :key="i">
          <div class="flex justify-between w-[100%]">
            <div
              class="link-skeleton w-[33%] flex justify-center items-center h-[11rem] rounded-md"
            >
              <SkeletonItem variant="circle" width="80px" height="80px" />
            </div>
            <div
              class="link-skeleton w-[33%] flex justify-center items-center h-[11rem] rounded-md"
            >
              <SkeletonItem variant="circle" width="80px" height="80px" />
            </div>
            <div
              class="link-skeleton w-[33%] flex justify-center items-center h-[11rem] rounded-md"
            >
              <SkeletonItem variant="circle" width="80px" height="80px" />
            </div>
          </div>
        </div>
      </template>
      <el-row class="site" v-if="linksList.length">
        <el-col :xs="24" :sm="8" v-for="(item, index) in linksList" :key="item.id">
          <el-card class="card-hover animate__animated animate__fadeIn">
            <div
              :key="item.id"
              :style="{
                backgroundImage: `url(${
                  item.site_avatar || 'http://img.mrzym.top/FgTOrGUz5WJwswSLhPsiGL4DOXe3'
                })`,
              }"
              :class="['site-item', activeType == 'site' && active == index ? 'site-mask' : '']"
              @mouseenter="mouseEnterItem('site', index)"
              @mouseleave="mouseLeaveItem"
            >
              <div class="left">
                <el-avatar
                  :key="item.id"
                  :class="[activeType == 'site' && active == index ? 'avatar-hover' : 'avatar']"
                  fit="cover"
                  :size="80"
                  :src="item.site_avatar || returnUrl(item.url)"
                >
                  <span class="avatar-font">{{ item.site_name }}</span></el-avatar
                >
              </div>
              <div :class="['right', activeType == 'site' && active == index ? 'right-hover' : '']">
                <div class="w-[100%] flex justify-between items-center">
                  <span :title="item.site_name" class="name" @click="goToSite(item.url)">{{
                    item.site_name
                  }}</span>
                </div>
                <span
                  :style="{ height: activeType == 'site' && active == index ? '4.6rem' : '0' }"
                  :title="item.site_desc"
                  class="desc"
                >
                  {{ item.site_desc }}</span
                >
              </div>
              <div class="op-icon" v-if="getUserInfo.id">
                <el-icon
                  v-if="getUserInfo.id == 1 || getUserInfo.id == item.user_id"
                  style="font-size: 16px"
                  class="left-icon"
                  @click="updateLink(item)"
                  ><Edit
                /></el-icon>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="observer">
        <Loading :size="32" v-if="scrollLoading" />
        <template v-else>
          {{ linksList.length >= total ? "已经到底了~" : "下拉加载更多～" }}
        </template>
      </div>
    </el-skeleton>
  </div>
  <linkApply v-model:show="dialogVisible" :type="applyType"></linkApply>
</template>

<style lang="scss" scoped>
.desc {
  &-title {
    font-size: 1.8rem;
  }
  &-remark {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}

.site {
  transition: height 0.8s ease;
  &-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    cursor: pointer;
    position: relative;
    height: 11rem;
    background-position: center;
    background-size: cover;

    .left {
      position: absolute;
      left: 10px;
      top: 10px;
      transition: all 0.8s;
      opacity: 0.8;

      .avatar-hover {
        animation: avatarHover 0.8s forwards;
      }

      .avatar {
        animation: avatar 0.8s forwards;
      }
    }

    .right {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      z-index: 2;

      .name {
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 1.7;
        color: var(--font-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;

        &:hover {
          color: var(--primary);
        }
      }

      .desc {
        transition: all 0.5s;
        display: -webkit-box;
        width: 100%;
        font-weight: bold;
        height: 4.6rem;
        color: var(--global-white);
        line-height: 1.2;
        font-size: 1.3rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .op-icon {
      position: absolute;
      top: 3px;
      right: 10px;
      font-size: 24px;
      font-weight: 600;
      z-index: 3333;
    }
  }
}

.link-skeleton {
  background-color: rgba(255, 255, 255, 0.5);
}

.right-hover {
  .name {
    color: var(--global-white) !important;
  }
  .op-icon {
    color: var(--global-white) !important;
    .left-icon:hover,
    .right-icon:hover {
      color: #c6b4e9 !important;
    }
  }
  .desc {
    color: var(--global-white) !important;
  }
}

.site-mask::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: maskChange 0.5s ease-in-out forwards;
  background-color: rgba(0, 0, 0, 0.2);
}

@keyframes maskChange {
  0% {
    background-color: rgba(0, 0, 0, 0.2);
  }

  100% {
    background-color: var(--shadow-mask-bg);
  }
}

@keyframes avatarHover {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100px);
  }
}

@keyframes avatar {
  0% {
    transform: translateY(-100px);
  }

  100% {
    transform: translateY(0);
  }
}

.observer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: var(--font-color);
  margin-top: 30px;
  letter-spacing: 1px;
}
</style>
