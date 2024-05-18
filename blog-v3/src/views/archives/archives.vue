<script setup>
import { ref, reactive, onMounted } from "vue";

import { blogTimelineGetArticleList } from "@/api/article";

import PageHeader from "@/components/PageHeader/index.vue";
import TimeLine from "@/components/TimeLine/time-line.vue";

const archives = ref([]);
let param = reactive({
  // 放置页码及相关数据
  current: 1, //当前页
  size: 5, //每页条目数
});
let archivesTotal = ref(0); // 记录总数
const loading = ref(false);

const pagination = (page) => {
  param.current = page.current;
  getArchives();
};

// 获取时间轴
const getArchives = async () => {
  try {
    let res = await blogTimelineGetArticleList(param.current, param.size);
    if (res.code == 0) {
      const { total, list } = res.result;
      archives.value = list;
      archivesTotal.value = total;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loading.value = true;
  getArchives();
});
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="archives">
    <el-row class="center_box">
      <el-col :span="24">
        <el-card class="archives-card">
          <TimeLine
            :archives="archives"
            :total="archivesTotal"
            :loading="loading"
            :param="param"
            @pagination="pagination"
          ></TimeLine>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.archives {
  &-card {
    padding: 40px 50px;
  }
}
</style>
