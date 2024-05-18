<script setup>
import { nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";

import { numberFormate } from "@/utils/tool";
import { gsapTransY } from "@/utils/transform";

import RightSideSkeletonItem from "@/components/RightSide/components/skeleton/right-side-skeleton-item.vue";
import RightSideTopSkeleton from "@/components/RightSide/components/skeleton/right-side-top-skeleton.vue";
import RightSideItem from "@/components/RightSide/components/item/right-side-item.vue";
import RightSideTop from "@/components/RightSide/components/item/right-side-top.vue";
import GsapCount from "@/components/GsapCount/index";

defineProps({
  configDetail: {
    type: Object,
    default: () => {},
  },
  runtime: {
    type: [String, Number],
    default: "两年半",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: Array,
    default: () => {},
  },
});

const router = useRouter();
const goToArticleList = (item) => {
  router.push({ path: "articleList", query: { id: item.id, type: "tag", name: item.tag_name } });
};

onMounted(() => {
  let list = [];
  for (let i = 1; i <= 5; i++) {
    if (i > 1) {
      list.push(".right-side-space" + i);
    }
  }
  nextTick(() => {
    gsapTransY(list, 30, 0.6, "none");
  });
});
</script>

<template>
  <div class="right-side">
    <el-row>
      <el-col :span="24" class="right-side-space right-side-space1">
        <el-card class="info-card card-hover animate__animated animate__fadeIn" shadow="hover">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <RightSideTopSkeleton />
            </template>
            <template #default>
              <RightSideTop :configDetail="configDetail" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="0" :sm="24" class="right-side-space right-side-space2">
        <el-card
          class="right-card card-hover flex_c_center animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="loading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem icon="icon-gonggao" title="公告" color="#f00">
                <div class="notice-text">{{ configDetail.blog_notice }}</div>
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="0" :sm="24" class="right-side-space right-side-space3">
        <el-card
          class="right-card card-hover flex_c_center animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="loading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem size="1.5rem" color="#76d703" icon="icon-jiaoliuye" title="交流">
                <div class="group">
                  交流群
                  <div class="flex justify-end items-start flex-nowrap">
                    <div class="grid place-items-center" v-image="configDetail.we_chat_group">
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
                    <div class="grid place-items-center" v-image="configDetail.qq_group">
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
                    <div class="grid place-items-center" v-image="configDetail.ali_pay">
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
                    <div class="grid place-items-center" v-image="configDetail.we_chat_pay">
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
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="0" :sm="24" class="right-side-space right-side-space4">
        <el-card
          class="right-card card-hover flex_c_center animate__animated animate__fadeIn"
          shadow="hover"
        >
          <el-skeleton :loading="loading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem icon="icon-localoffer" title="标签">
                <div class="notice-text">
                  <span
                    class="notice-text__item"
                    v-for="(tag, index) in tags"
                    :key="index"
                    :style="{ color: tag.color }"
                    @click="goToArticleList(tag)"
                    >{{
                      index + 1 == tags.length ? tag.tag_name : tag.tag_name + "&nbsp;&nbsp;"
                    }}</span
                  >
                </div>
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="0" :sm="24" class="right-side-space right-side-space5">
        <el-card class="right-card card-hover flex_c_center" shadow="hover">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <RightSideSkeletonItem />
            </template>
            <template #default>
              <RightSideItem icon="icon-zixun" size="1.4rem" title="网站资讯">
                <div class="site-info">
                  <div class="flex_r_between">
                    <span>文章数目：</span>
                    <GsapCount class="value" :value="configDetail.articleCount" />
                  </div>
                  <div class="flex_r_between">
                    <span>运行时间：</span>
                    <span>
                      <GsapCount class="value" :value="runtime" />
                      天
                    </span>
                  </div>
                  <div class="flex_r_between">
                    <span>博客访问次数：</span>
                    <GsapCount
                      v-if="configDetail.view_time - 0 < 1000"
                      class="value"
                      :value="configDetail.view_time"
                    />
                    <span v-else class="value">{{ numberFormate(configDetail.view_time) }}</span>
                  </div>
                </div>
              </RightSideItem>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.right-side {
  width: 100%;

  .info-card {
    height: 29rem;
  }

  .right-card {
    padding: 1rem 1.8rem;
    color: var(--font-color);
    min-height: 10rem;

    .card-title {
      font-size: 1.2rem;
      line-height: 2.4;

      .icon-gonggao {
        font-weight: 900;
        color: #f00;
      }

      .icon-speechbubble,
      .icon-schedule,
      .icon-localoffer {
        font-weight: 900;
      }

      span {
        margin-left: 0.3rem;
      }
    }

    .notice-text {
      min-height: 6rem;
      font-size: 1.1rem;
      line-height: 1.2;
      white-space: pre-line;

      &__item {
        display: inline-block;
        font-weight: bold;
        cursor: pointer;
      }
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
