<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { user } from "@/store/index.js";

import { homeGetArticleList } from "@/api/article";
import { homeGetConfig } from "@/api/config";
import { getAllTag } from "@/api/tag";
import { homeGetStatistic } from "@/api/home";
import { randomFontColor, numberFormate } from "@/utils/tool";

import HomeArticleList from "@/components/HomeArticle/home-article-list.vue";
import RightSide from "@/components/RightSide/right-side.vue";
import MobileTopSkeleton from "@/components/RightSide/components/skeleton/mobile-top-skeleton.vue";
import RightSideItem from "@/components/RightSide/components/item/right-side-item.vue";
import RightSideTop from "@/components/RightSide/components/item/right-side-top.vue";
import RightSideSkeletonItem from "@/components/RightSide/components/skeleton/right-side-skeleton-item.vue";
import { gsapTransY } from "@/utils/transform";

const userStore = user();

/** 文章 */
const param = reactive({
  current: 1, // 当前页
  size: 5, // 每页条目数
  loading: true, // 加载
});
const articleList = ref([]);
const articleTotal = ref();

const getHomeArticleList = async () => {
  try {
    let res = await homeGetArticleList(param.current, param.size);
    if (res.code == 0) {
      const { list, total } = res.result;
      articleList.value = list;
      articleTotal.value = total;
    }
  } finally {
    param.loading = false;
  }
};

const pagination = (page) => {
  param.current = page.current;
  getHomeArticleList();
};

/** 网站右侧 */
const rightSizeLoading = ref(false);
const runtime = ref(0);
let configDetail = ref({});
let tags = ref([]);

// 获取网站详细信息
const getConfigDetail = async () => {
  try {
    let res = await homeGetConfig();
    if (res.code == 0 && typeof res.result != "string") {
      configDetail.value = res.result;
      userStore.setBlogAvatar(res.result.blog_avatar);
      calcRuntimeDays(configDetail.value.createdAt);
    }
  } finally {
    rightSizeLoading.value = false;
  }
};
// 获取文章数、分类数、标签数
const getStatistic = async () => {
  let res = await homeGetStatistic();
  if (res.code == 0) {
    Object.assign(configDetail.value, res.result);
  }
};

// 获取所有的标签
const getAllTags = async () => {
  let res = await getAllTag();
  if (res.code == 0) {
    tags.value = res.result.map((r) => {
      r.color = randomFontColor();
      return r;
    });
  }
};
// 计算出网站运行天数
const calcRuntimeDays = (time) => {
  if (time) {
    // eslint-disable-next-line
    time = time.replace(/\-/g, "/"); // 解决ios系统上格式化时间出现NAN的bug
    const now = new Date().getTime();
    const created = new Date(time).getTime();
    const days = Math.floor((now - created) / 8.64e7);
    runtime.value = days;
  }
};

const init = async () => {
  param.loading = true;
  rightSizeLoading.value = true;
  await getHomeArticleList("init");
  await getConfigDetail();
  await getStatistic();
  await getAllTags();
};

const observeMobileBox = () => {
  nextTick(() => {
    gsapTransY([".mobile-top-card", ".mobile-bottom-card"], -30, 0.5, "bounce.in");
    gsapTransY([".mobile-bottom-card"], 30, 0.6, "none");
  });
};

onMounted(async () => {
  await init();
  await observeMobileBox();
});
</script>

<template>
  <div class="home_center_box">
    <el-row>
      <el-col :xs="24" :sm="18">
        <el-card
          class="mobile-top-card mobile-card info-card animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="rightSizeLoading" animated>
            <template #template>
              <MobileTopSkeleton />
            </template>
            <template #default>
              <RightSideTop :configDetail="configDetail" />
            </template>
          </el-skeleton>
        </el-card>
        <!-- 博客文章 -->
        <HomeArticleList
          :articleList="articleList"
          :param="param"
          :articleTotal="articleTotal"
          @pageChange="pagination"
        ></HomeArticleList>
        <el-card
          class="mobile-bottom-card card-hover mobile-card info-card animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="rightSizeLoading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem icon="icon-zixun" size="1.4rem" title="网站资讯">
                <div class="site-info">
                  <div class="flex_r_between">
                    <span>文章数目：</span>
                    <span class="value">{{ configDetail.articleCount }}</span>
                  </div>
                  <div class="flex_r_between">
                    <span>运行时间：</span>
                    <span class="value">{{ runtime }} 天</span>
                  </div>
                  <div class="flex_r_between">
                    <span>博客访问次数：</span>
                    <span class="value">{{ numberFormate(configDetail.view_time) }}</span>
                  </div>
                  <div class="group">
                    交流群
                    <div class="flex justify-end items-start flex-nowrap">
                      <div v-image="configDetail.we_chat_group">
                        <el-image
                          class="img"
                          :src="configDetail.we_chat_group"
                          fit="cover"
                          :preview-src-list="[configDetail.we_chat_group]"
                          preview-teleported
                          lazy
                        >
                          <template #error>
                            <div class="w-[100%] h-[100%] grid place-items-center">
                              <svg-icon name="image404" :width="4" :height="4"></svg-icon>
                            </div>
                          </template>
                        </el-image>
                      </div>
                      <div v-image="configDetail.qq_group">
                        <el-image
                          class="img !ml-[10px]"
                          :src="configDetail.qq_group"
                          fit="cover"
                          :preview-src-list="[configDetail.qq_group]"
                          preview-teleported
                          lazy
                        >
                          <template #error>
                            <div class="w-[100%] h-[100%] grid place-items-center">
                              <svg-icon name="image404" :width="4" :height="4"></svg-icon>
                            </div>
                          </template>
                        </el-image>
                      </div>
                    </div>
                  </div>
                  <div class="group">
                    支持作者
                    <div class="flex justify-end items-start flex-nowrap">
                      <div v-image="configDetail.ali_pay">
                        <el-image
                          class="img"
                          :src="configDetail.ali_pay"
                          fit="cover"
                          :preview-src-list="[configDetail.ali_pay]"
                          preview-teleported
                          lazy
                        >
                          <template #error>
                            <div class="w-[100%] h-[100%] grid place-items-center">
                              <svg-icon name="image404" :width="4" :height="4"></svg-icon>
                            </div>
                          </template>
                        </el-image>
                      </div>
                      <div v-image="configDetail.we_chat_pay">
                        <el-image
                          class="img !ml-[10px]"
                          :src="configDetail.we_chat_pay"
                          fit="cover"
                          :preview-src-list="[configDetail.we_chat_pay]"
                          preview-teleported
                          lazy
                        >
                          <template #error>
                            <div class="w-[100%] h-[100%] grid place-items-center">
                              <svg-icon name="image404" :width="4" :height="4"></svg-icon>
                            </div>
                          </template>
                        </el-image>
                      </div>
                    </div>
                  </div>
                </div>
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="0" :sm="6">
        <!-- 博客我的信息 -->
        <RightSide
          :configDetail="configDetail"
          :tags="tags"
          :runtime="runtime"
          :loading="rightSizeLoading"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.mobile-top-card {
  height: 31rem;
  margin: 4px;
  :deep(.info-avatar) {
    padding: 0 2rem;
  }
  :deep(.personal-say) {
    padding-left: 1rem;
  }
  :deep(.info-background) {
    height: 12rem;
    width: 100%;
  }
  :deep(.common-menu) {
    padding: 1rem 5.5rem;
  }
  :deep(.git-ee) {
    padding: 0 4rem;
  }
  :deep(.personal-link) {
    padding: 1rem 6rem;
  }
}
.mobile-bottom-card {
  margin: 4px;
  padding: 1rem;
  .icon-localoffer {
    font-weight: 900;
  }
  span {
    margin-left: 0.3rem;
  }
  .site-info {
    padding: 0.3rem 1rem;
    line-height: 2;
    font-size: 1rem;

    .value {
      font-weight: 600;
    }
  }
}

.group {
  margin-left: 0.3rem;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .img {
    width: 80px;
    height: 80px;
  }
}
</style>
