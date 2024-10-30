<!--网站列表  -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { frontSite, backSite, frontCategory, backCategory } from "./data";
import PageHeader from "@/components/PageHeader/index.vue";

const route = useRoute();
const active = ref(0);
const activeType = ref("");

const siteList = ref([]);
const currenType = ref("");
const currenCategory = ref("");

const mouseEnterItem = (type, index) => {
  activeType.value = type;
  active.value = index;
};

const mouseLeaveItem = () => {
  activeType.value = "";
  active.value = 0;
};
const goToSite = (url) => {
  window.open(url);
};

const returnUrl = (url) => {
  const end = url.substring(url.length - 1);
  return end != "/" ? url + "/favicon.ico" : url + "favicon.ico";
};

const currentTitle = computed(() => {
  let res = "";
  switch (currenType.value) {
    case "front":
      res = "前端";
      break;
    case "back":
      res = "后端";
      break;
  }
  return res;
});

onMounted(() => {
  if (route.query) {
    const { type, category } = route.query;
    currenType.value = type;
    switch (type) {
      case "front":
        currenCategory.value = frontCategory[category].name;
        siteList.value = frontSite[category];
        break;
      case "back":
        currenCategory.value = backCategory[category].name;
        siteList.value = backSite[category];
        break;
    }
  }
});
</script>

<template>
  <PageHeader />
  <div class="center_box">
    <div class="title">{{ currentTitle }} - {{ currenCategory }}</div>
    <div style="margin-top: 30px">
      <el-row class="site">
        <el-col :xs="12" :sm="6" v-for="(item, index) in siteList" :key="index">
          <el-card class="card-hover">
            <div class="site-item animate__animated animate__fadeIn" @click="goToSite(item.url)">
              <div
                class="left"
                @mouseenter="mouseEnterItem('site', index)"
                @mouseleave="mouseLeaveItem"
              >
                <span
                  :class="['top', activeType == 'site' && active == index ? 'top-animate' : '']"
                ></span>
                <el-avatar fit="scale-down" :size="60" :src="returnUrl(item.url)">
                  <span class="avatar-font" :title="item.name">{{ item.name }}</span></el-avatar
                >
                <span
                  :class="[
                    'bottom',
                    activeType == 'site' && active == index ? 'bottom-animate' : '',
                  ]"
                ></span>
              </div>
              <div class="right">
                <a :title="item.name" :href="item.url" target="_blank" class="name">{{
                  item.name
                }}</a>
                <span :title="item.desc" class="desc"> {{ item.desc }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: var(--font-color);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}
.site {
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
        background: rgba(255, 255, 255, 0.3);
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
        background: rgba(255, 255, 255, 0.3);
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;

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

.avatar-font {
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
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
