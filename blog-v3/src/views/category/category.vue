<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getAllCategory } from "@/api/category";

import GsapCount from "@/components/GsapCount/index";
import PageHeader from "@/components/PageHeader/index.vue";

const router = useRouter();
const categoryList = ref([]);
const loading = ref(false);

const randomFontColor = () => {
  return `rgb(${Math.random() * 180 + 30},${Math.random() * 180 + 30},${Math.random() * 180 + 30})`;
};

const randomFontSize = () => {
  return Math.random() * 1.6 + 0.6;
};

const getCategoryList = async () => {
  loading.value = true;
  let res = await getAllCategory();
  if (res.code == 0) {
    categoryList.value = res.result.map((r) => {
      return {
        id: r.id,
        category_name: r.category_name,
        fontSize: randomFontSize(),
        fontColor: randomFontColor(),
      };
    });
    loading.value = false;
  }
};

onMounted(() => {
  getCategoryList();
});

const goToArticleList = (item) => {
  router.push({
    path: "/articleList",
    query: { id: item.id, type: "category", name: item.category_name },
  });
};
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="category center_box">
    <el-card class="category-card">
      <div class="category-total flex_center">
        分类 -
        <GsapCount :value="categoryList.length" />
      </div>
      <el-row v-if="loading">
        <el-skeleton v-if="loading" class="category-item" :loading="loading" :rows="1" animated />
      </el-row>
      <el-row v-else>
        <el-col :span="24" class="category-item">
          <span
            v-for="(item, i) in categoryList"
            :key="i"
            :style="{ fontSize: item.fontSize + 'rem', color: item.fontColor }"
            class="category-item__label scale animate__animated animate__fadeInDown"
            @click="goToArticleList(item)"
          >
            {{ item.category_name }}
          </span>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.category {
  &-card {
    padding: 40px 30px;
  }

  &-total {
    font-size: 1.4rem;
    line-height: 2;
    font-weight: 600;
    color: var(--font-color);
  }

  &-item {
    padding: 10px;
    box-sizing: border-box;
    text-align: center;

    &__label {
      display: inline-block;
      font-weight: bold;
      padding: 0 0.8rem;
    }
  }
}
</style>
