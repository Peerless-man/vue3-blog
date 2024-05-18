<script setup>
import { useRouter } from "vue-router";

import SkeletonItem from "../SkeletonItem/skeleton-item.vue";
import Pagination from "../Pagination/pagination.vue";

const emit = defineEmits(["pagination"]);

let layout = " prev, pager, next"; //分页组件会展示的功能项

defineProps({
  archives: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  param: {
    type: Object,
    default: () => {},
  },
  total: {
    type: Number,
    default: 0,
  },
});

const pagination = (page) => {
  emit("pagination", page);
};

const router = useRouter();

const goToArticle = (article) => {
  router.push({ path: "/article", query: { id: article.id } });
};
</script>
<template>
  <el-timeline class="my-timeline">
    <el-skeleton v-if="loading" :loading="loading" animated class="skeleton">
      <template #template>
        <SkeletonItem variant="text" width="4rem" height="2rem" />
        <SkeletonItem class="skeleton-left" variant="text" width="0.5rem" height="60rem" />
        <div class="flex_r_start skeleton-right" v-for="i in 10" :key="i">
          <SkeletonItem variant="image" width="8rem" height="8rem" />
          <div class="flex_c_center skeleton-right__item">
            <SkeletonItem variant="text" width="4rem" height="25px" />
            <SkeletonItem variant="text" width="6rem" top="1rem" height="15px" />
          </div>
        </div>
      </template>
    </el-skeleton>
    <template v-else>
      <div v-for="item in archives" :key="item.year">
        <div class="year to_pointer">{{ item.year }}</div>
        <el-timeline-item
          v-for="article in item.articleList"
          :key="article.id"
          size="large"
          :hollow="true"
          hide-timestamp
          :center="true"
          class="my-timeline-item border-orange"
        >
          <div class="flex_r_start timeline">
            <div class="timeline-cover scale" v-image="article.article_cover">
              <el-image
                class="w-[100%] h-[100%]"
                fit="cover"
                :src="article.article_cover"
                @click="goToArticle(article)"
              >
                <template #error>
                  <svg-icon name="image404" :width="5" :height="5"></svg-icon>
                </template>
              </el-image>
            </div>
            <div class="timeline-info" @click="goToArticle(article)">
              <div class="timeline-info__title">
                {{ article.article_title }}
              </div>
              <div class="timeline-info__time">
                {{ article.createdAt }}
              </div>
            </div>
          </div>
        </el-timeline-item>
      </div>
    </template>
  </el-timeline>
  <Pagination
    :size="param.size"
    :current="param.current"
    :layout="layout"
    :total="total"
    @pagination="pagination"
  />
</template>

<style lang="scss" scoped>
.year {
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--md-active);
}
.timeline {
  padding: 1rem 0;

  &-cover {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-info {
    flex: 1;
    &__total {
      font-size: 1.8rem;
      padding: 5px;
      font-weight: bold;
      color: var(--font-color);
    }
    &__title {
      font-size: 1.2rem;
      padding: 5px;
      font-weight: bold;
      color: var(--font-color);
      cursor: pointer;
      &:hover {
        color: var(--primary);
      }
    }
    &__time {
      padding: 5px;
      font-weight: bold;
      color: var(--font-color);
    }
  }
}
.border-orange {
  :deep(.el-timeline-item__node) {
    &.is-hollow {
      border-color: var(--primary) !important;
      &:hover {
        transform: scale(1.2);
        border-color: var(--second-font-color) !important;
      }
    }
  }
}
.my-timeline {
  width: 100%;
  margin-bottom: 2rem;
  .my-timeline-item {
    padding-top: 5px;
    :deep(.el-timeline-item__tail) {
      height: 100%;
      top: 32px;
      border-left: 3px solid var(--hr-border);
    }
    &:first-child {
      :deep(.el-timeline-item__node) {
        left: -5px;
        width: 1.4rem;
        height: 1.4rem;
        &.is-hollow {
          border-width: 4px;
          border-color: var(--border-color);
          background-color: var(--global-white);
        }
      }
    }
    &:last-child {
      :deep(.el-timeline-item__tail) {
        height: calc(100% - 30px);
      }
    }
    :deep(.el-timeline-item__node) {
      left: -2px;
      width: 1rem;
      height: 1rem;
      &.is-hollow {
        border-width: 3px;
        border-color: var(--border-color);
        background-color: var(--global-white);
        &:hover {
          border-color: var(--primary);
        }
      }
    }
    :deep(.el-timeline-item__wrapper) {
      display: flex;
      align-items: center;
      margin-left: 1rem;
    }
  }
}
.skeleton {
  position: relative;
  &-left {
    position: absolute;
    left: 0;
    top: 4rem;
  }
  &-right {
    margin-left: 30px;
    margin-top: 20px;
    &__item {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
