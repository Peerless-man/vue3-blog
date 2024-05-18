<!--优质网站分类  -->
<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { frontCategory, backCategory } from "./data";

const router = useRouter();
const route = useRoute();
const active = ref(0);
const activeType = ref(""); // 当前是哪个分类 前端、后端等
const routeType = ref(""); // 通过路由判断显示后端还是前端
const currenCategory = ref({});
const title = ref("");

const mouseEnterItem = (type, index) => {
  activeType.value = type;
  active.value = index;
};

const mouseLeaveItem = () => {
  activeType.value = "";
  active.value = 0;
};

const goToSiteList = (type, item) => {
  router.push({ path: "/siteList", query: { type, category: item } });
};

watch(
  () => route.path,
  (newV) => {
    routeType.value = newV.split("/").pop();
    switch (routeType.value) {
      case "front":
        title.value = "前端";
        currenCategory.value = frontCategory;
        break;
      case "back":
        title.value = "后端";
        currenCategory.value = backCategory;
        break;
      default:
        return;
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <PageHeader />
  <div class="center_box">
    <el-row class="category">
      <el-col :xs="12" :sm="6" v-for="(item, index) in Object.keys(currenCategory)" :key="index">
        <el-card class="card-hover">
          <div
            class="category-item animate__animated animate__fadeIn"
            @click="goToSiteList(routeType, item)"
          >
            <div
              class="left"
              @mouseenter="mouseEnterItem(routeType, index)"
              @mouseleave="mouseLeaveItem"
            >
              <span :class="['top', activeType && active == index ? 'top-animate' : '']"></span>
              <el-avatar :size="60"
                ><span>{{ currenCategory[item].name }}</span></el-avatar
              >
              <span
                :class="['bottom', activeType && active == index ? 'bottom-animate' : '']"
              ></span>
            </div>
            <div class="right">
              <span :title="currenCategory[item].name" class="name">{{
                currenCategory[item].name
              }}</span>
              <span :title="currenCategory[item].desc" class="desc">
                {{ currenCategory[item].desc }}</span
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.category {
  &-item {
    display: flex;
    justify-content: flex-start;
    padding: 20px 10px;
    cursor: pointer;

    .left {
      position: relative;
      width: 60px;
      height: 60px;
      transition: all 0.8s;

      &:hover {
        transform: scale(1.1);
      }

      .top {
        content: "";
        position: absolute;
        top: -3px;
        left: -3px;
        width: 66px;
        height: 33px;
        border-top-left-radius: 33px;
        border-top-right-radius: 33px;
        background: var(--shadow-button-bg);
      }

      .top-animate {
        animation-name: up;
        animation-duration: 0.8s;
        animation-fill-mode: forwards;
      }

      .bottom {
        content: "";
        position: absolute;
        bottom: -3px;
        left: -3px;
        width: 66px;
        height: 33px;
        border-bottom-left-radius: 33px;
        border-bottom-right-radius: 33px;
        background: var(--shadow-button-bg);
      }

      .bottom-animate {
        animation-name: down;
        animation-duration: 0.8s;
        animation-fill-mode: forwards;
      }
    }

    .right {
      width: 70%;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .name {
        width: 90%;
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.7;
        color: var(--font-color);
        white-space: nowrap(不换行);
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          color: var(--primary);
        }
      }

      .desc {
        display: -webkit-box;
        width: 90%;
        height: 2.4rem;
        color: var(--font-color);
        font-size: 0.8rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}

@keyframes up {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-33px);
    background: rgba(255, 255, 255, 0);
  }
}

@keyframes down {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(33px);
    background: rgba(255, 255, 255, 0);
  }
}
</style>
