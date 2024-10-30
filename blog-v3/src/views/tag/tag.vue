<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllTag } from "@/api/tag";

import GsapCount from "@/components/GsapCount/index";
import PageHeader from "@/components/PageHeader/index.vue";

const router = useRouter();
const tagList = ref([]);
const total = ref(0);
const loading = ref(false);

const randomFontSize = () => {
  return Math.random() * 1.4 + 0.6;
};

const randomFontColor = () => {
  return `rgb(${Math.random() * 180 + 30},${Math.random() * 180 + 30},${Math.random() * 180 + 30})`;
};

const goToArticleList = (item) => {
  router.push({ path: "articleList", query: { id: item.id, type: "tag", name: item.tag_name } });
};

const getTagList = async () => {
  loading.value = true;
  let res = await getAllTag();
  if (res.code == 0) {
    total.value = res.result.length;
    tagList.value = res.result.map((tag) => {
      return {
        id: tag.id,
        tag_name: tag.tag_name,
        fontSize: randomFontSize(),
        fontColor: randomFontColor(),
      };
    });
    loading.value = false;
  }
};

onMounted(() => {
  getTagList();
});
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="tag">
    <el-row class="center_box">
      <el-col :span="24">
        <el-card class="tag-card">
          <div class="tag-total flex_center">标签 - <GsapCount :value="total" /></div>
          <el-skeleton v-if="loading" class="tag-item" :loading="loading" :rows="1" animated />
          <el-row v-else>
            <el-col :span="24" class="tag-item">
              <span
                v-for="(item, i) in tagList"
                :key="i"
                :style="{ fontSize: item.fontSize + 'rem', color: item.fontColor }"
                class="tag-item__label scale animate__animated animate__fadeInDown"
                @click="goToArticleList(item)"
              >
                {{ item.tag_name }}
              </span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  &-card {
    padding: 40px 50px;
  }

  &-total {
    font-size: 2.2rem;
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
