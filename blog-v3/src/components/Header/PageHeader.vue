<script setup>
import { computed, nextTick, ref, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { staticData, user } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { ElNotification } from "element-plus";

import { numberFormate } from "@/utils/tool";
import { gsapTransFont } from "@/utils/transform";

import Tooltip from "../ToolTip/tooltip.vue";
import GsapCount from "@/components/GsapCount/index";

const staticStore = staticData();
const { codeTheme, previewTheme, getPageHeaderList } = storeToRefs(staticStore);
const { getUserInfo } = storeToRefs(user());
const route = useRoute();
const router = useRouter();

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  article: {
    type: Object,
    default: () => {},
  },
  bgUrl: {
    type: String,
    default: "",
  },
  photoAlbumList: {
    type: Array,
    default: () => {
      [];
    },
  },
});

const toggleMdTheme = (type, theme) => {
  staticStore[type] = theme;
};

const finalUrl = ref("");

const readingDuration = (times) => {
  if (times > 3.6e6) {
    const hours = (times / 3.6e6).toFixed(0);
    const minutes = ((times % 3.6e6) / 6e4).toFixed(0);
    return `${addZero(hours)} 时 ${addZero(minutes)} 分`;
  } else {
    const minutes = (times / 6e4).toFixed(0);
    return `${addZero(minutes)} 分`;
  }
};

// 时间小于10的补一个0
const addZero = (time) => {
  if (time > 0 && time < 10) {
    return `0${time}`;
  } else {
    return time;
  }
};

const getBgCover = computed(() => {
  const bgList = getPageHeaderList.value;
  // 做一个根据路由来判断判断页面背景图片
  let url;
  if (route.path == "/article") {
    url = props.article.article_cover || "https://mrzym.gitee.io/blogimg/cover/cute.jpg";
  } else if (props.bgUrl) {
    url = props.bgUrl || "https://mrzym.gitee.io/blogimg/cover/cute.jpg";
  } else {
    let index = bgList.findIndex((bg) => bg.route_name == route.name);
    url = index == -1 ? "https://mrzym.gitee.io/blogimg/cover/cute.jpg" : bgList[index].bg_url;
  }
  // eslint-disable-next-line
  finalUrl.value = url;
  return `background-image: url(${url});}`;
});
const getTitle = computed(() => {
  return route.query.pageTitle ? route.meta.name + " - " + route.query.pageTitle : route.meta.name;
});

const toggleAlbum = (item) => {
  router.push({
    path: "/photos",
    query: {
      id: item.id,
      pageTitle: item.album_name,
      bg: item.album_cover,
    },
  });
};

const applyLinks = () => {
  if (getUserInfo.value.id) {
    router.push("/link/apply");
  } else {
    ElNotification({
      offset: 60,
      title: "温馨提示",
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请先登录"),
    });
  }
};

watch(
  () => route.path,
  () => {
    nextTick(() => {
      gsapTransFont(".char");
    });
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="page-header fadeIn" :style="getBgCover">
    <div class="loading !pt-[80px]" v-image="finalUrl"></div>
    <div v-if="route.path != '/article'" class="route-font animate__animated animate__fadeIn">
      <span style="display: inline-block" class="char" v-for="i in getTitle.length" :key="i">
        {{ getTitle.charAt(i - 1) }}
      </span>
      <div class="image-list" v-if="route.path == '/photos' && photoAlbumList.length">
        <div
          :class="['image-box', route.query.id == item.id ? 'current' : '']"
          v-for="item in photoAlbumList"
          :key="item.id"
        >
          <el-image
            class="image"
            :src="item.album_cover"
            fit="cover"
            lazy
            @click="toggleAlbum(item)"
          >
            <template #error>
              <svg-icon name="image404" :width="4" :height="4"></svg-icon>
            </template>
          </el-image>
        </div>
      </div>
      <div style="text-shadow: none">
        <span class="apply-button" v-if="route.path == '/link/list'" @click="applyLinks"
          >友链申请</span
        >
      </div>
    </div>
    <div v-else class="article main-article">
      <div class="loading" v-image="props.article.article_cover"></div>
      <Tooltip
        width="80%"
        weight="500"
        size="2.4rem"
        color="#fff"
        align="center"
        :name="article.article_title"
      />
      <div class="animate__animated animate__fadeIn !mt-[20px]">
        <span class="to_pointer">
          <i class="iconfont icon-calendar2"></i>
          <span class="meta-label">发表于</span>
          <span class="meta-value">{{ article.createdAt }}</span>
        </span>
        <span class="to_pointer">
          <i class="iconfont icon-schedule"></i>
          <span class="meta-label">更新于</span>
          <span class="meta-value">{{ article.updatedAt }}</span>
        </span>
        <span class="meta-separator"></span>
        <span class="to_pointer">
          <i class="iconfont icon-folder"></i>
          <span class="meta-value">{{ article.categoryName }}</span>
        </span>
        <span class="meta-separator"></span>
        <span class="to_pointer">
          <i class="iconfont icon-label_fill"></i>
          <span class="meta-value" v-for="(item, index) in article.tagNameList" :key="item">{{
            index + 1 == article.tagNameList.length ? item : item + "、"
          }}</span>
        </span>
        <span class="meta-separator"></span>
        <span class="to_pointer">
          <i class="iconfont icon-icon1"></i>
          <span class="meta-label">点赞数</span>
          <GsapCount
            class="meta-value"
            v-if="article.thumbs_up_times - 0 < 1000"
            :value="article.thumbs_up_times"
          />
          <span v-else class="meta-value">
            {{ numberFormate(article.thumbs_up_times) }}
          </span>
        </span>
        <span class="meta-separator"></span>
        <span class="to_pointer">
          <i class="iconfont icon-chakan"></i>
          <span class="meta-label">浏览次数</span>
          <GsapCount
            class="meta-value"
            v-if="article.view_times - 0 < 1000"
            :value="article.view_times"
          />
          <span v-else class="meta-value">{{ numberFormate(article.view_times) }}</span>
        </span>
        <span class="meta-separator"></span>
        <span class="to_pointer">
          <i class="iconfont icon-speechbubble"></i>
          <span class="meta-label">阅读时长</span>
          <span class="meta-value">{{ readingDuration(article.reading_duration) }}</span>
        </span>
      </div>
      <div class="toggle-theme animate__animated animate__fadeIn">
        <el-dropdown class="theme-card-dropdown">
          <div class="flex_c_center">
            <span>预览主题</span>
            <span>{{ previewTheme }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in staticStore.previewThemeList"
                :key="index"
                @click="toggleMdTheme('previewTheme', item)"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown class="theme-card-dropdown">
          <div class="flex_c_center">
            <span>代码主题</span>
            <span>{{ codeTheme }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in staticStore.codeThemeList"
                :key="index"
                @click="toggleMdTheme('codeTheme', item)"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8a7e90;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 26rem;

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .route-font {
    font-size: 3.2rem;
    font-weight: 500;
    line-height: 2.4;
    text-align: center;
    color: var(--router-color);
    z-index: 999;
    cursor: pointer;
    transition: all 0.3s;

    text-shadow:
      0 1px 0 hsl(174, 5%, 80%),
      0 2px 0 hsl(174, 5%, 75%),
      0 3px 0 hsl(174, 5%, 70%),
      0 0 5px rgba(0, 0, 0, 0.05),
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 3px 5px rgba(0, 0, 0, 0.2),
      0 5px 10px rgba(0, 0, 0, 0.2),
      0 10px 10px rgba(0, 0, 0, 0.2),
      0 20px 20px rgba(0, 0, 0, 0.3);
  }

  .article {
    z-index: 999;
    background: transparent;
    font-size: 1.1rem;
    line-height: 1.4;
    margin-top: 5rem;
    color: transparent;
    text-align: center;
    color: #fff;

    .to_pointer {
      padding: 0 0.3rem;
    }

    .iconfont {
      margin-right: 0.3rem;
    }
  }

  .meta {
    .icon-speechbubble {
      font-size: 1rem;
    }

    &-separator {
      margin: 0 0.4rem;
      font-size: 1.1rem;
      position: relative;

      &::after {
        content: "|";
        position: absolute;
        top: -3px;
        right: 0;
      }
    }
    &-value {
      margin-left: 3px;
    }

    i {
      margin: 0 0.2rem 0 0;
    }
  }

  .apply-button {
    display: inline-block;
    padding: 0 20px;
    background-color: transparent;
    box-sizing: border-box;
    border-radius: 20px;
    font-weight: 900;
    font-size: 16px;
    border: 3px solid #dddddd;
    color: #dddddd;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #fff;
      border: 3px solid #fff;
      transform: scale(1.1);
    }
  }

  .toggle-theme {
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    h3 {
      line-height: 1.4;
    }

    .theme-card-dropdown {
      width: 8rem;
      overflow: auto;
      margin: 0.5rem;
      text-align: center;
      display: block;
      padding: 0.2rem 0;
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.5s;

      span {
        &:first-child {
          line-height: 1.2;
        }
      }
      &:hover {
        transform: translateY(-3px);
      }
    }
  }
}

.image-list {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  max-width: 100vw;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}
.image-box {
  margin: 3px;
  transition: all 0.3s;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 3px;

  &:hover {
    box-shadow: 0 0 8px #fff;
  }
}
.current {
  filter: saturate(2);
  box-shadow: 0 0 8px #fff;
}

.fadeIn {
  animation: fadeIn 0.6s ease-in-out forwards;
}

@keyframes fadeIn {
  0% {
    transform: translateY(-30px);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .main-article {
    max-width: 90%;
  }
  .image-box {
    width: 70px;
    height: 50px;
    .image {
      width: 64px;
      height: 44px;
      vertical-align: top;
    }
  }
}

@media screen and (min-width: 768px) {
  .main-article {
    max-width: 60%;
  }
  .image-box {
    width: 100px;
    height: 70px;
    .image {
      width: 94px;
      height: 64px;
      vertical-align: top;
    }
  }
}
</style>
