<script setup lang="ts" name="Home">
import { ref, onMounted, watch } from "vue";
import HomeCard from "@/components/HomeCard/home-card.vue";
import { getStatistic } from "@/api/home";
import Bar from "./components/Bar.vue";
import CodeMap from "./components/CodeMap.vue";
import WordCloud from "./components/WordCloud.vue";
import biaoqian from "@/assets/svg/biaoqian.svg?component";
import fenlei from "@/assets/svg/fenlei.svg?component";
import wenzhang from "@/assets/svg/wenzhang.svg?component";
import yonghu from "@/assets/svg/yonghu.svg?component";
import { getCommitList } from "@/api/site";
import { dayjs } from "element-plus";
import { debounce } from "@pureadmin/utils";
import { useAppStoreHook } from "@/store/modules/app";

const staticsData = ref({
  articleCount: 0,
  categoryCount: 0,
  tagCount: 0,
  userCount: 0,
  commitList: []
});

const codeMapChartRef = ref(null);
const barChartRef = ref(null);
const cloudChartRef = ref(null);

// 静态数据
const getStatisticData = async () => {
  const res = await getStatistic();
  if (res.code == 0) {
    Object.assign(staticsData.value, res.result);
  }
};

// 创建一个从去年到今年 12个月的数组 用于记录代码提交信息
const createDayArr = () => {
  const today = new Date();

  // 创建一个从今天开始到去年同一天的日期数组
  const dateArray = Array.from({ length: 366 }, (_, i) => {
    return [dayjs(today.getTime() - 8.64e7 * i).format("YYYY-MM-DD"), 0];
  });

  return dateArray;
};

// gitee代码提交记录
const getCodeCommit = async () => {
  const arr = createDayArr();
  const res: any = await getCommitList();

  res.length &&
    res.forEach(v => {
      const index = arr.findIndex(d => d[0] == v.created_at.split("T")[0]);
      if (index != -1) {
        v.commit_count = v.commit_count ? v.commit_count - 0 : 0;
        arr[index][1] += v.commit_count;
      }
    });

  staticsData.value.commitList = arr;
};

const resize = debounce(() => {
  // resize echarts
  codeMapChartRef.value && codeMapChartRef.value.init();
  barChartRef.value && barChartRef.value.resize();
  cloudChartRef.value && cloudChartRef.value.resize();
}, 300);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    resize();
  }
);

onMounted(() => {
  getStatisticData();
  getCodeCommit();

  window.addEventListener("resize", resize);
});
</script>

<template>
  <el-card class="home">
    <template #header> 首页 </template>
    <el-row>
      <el-col :xs="12" :sm="6">
        <home-card label="文章" :value="staticsData.articleCount">
          <wenzhang class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <home-card label="分类" :value="staticsData.categoryCount">
          <fenlei class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <home-card label="标签" :value="staticsData.tagCount">
          <biaoqian class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <home-card label="用户" :value="staticsData.userCount">
          <yonghu class="w-[48px] h-[48px] svg-fill" />
        </home-card>
      </el-col>
    </el-row>
    <el-row class="mt-4">
      <el-col :sm="24" :xs="0">
        <CodeMap ref="codeMapChartRef" :commit-list="staticsData.commitList" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-card class="m-[5px]">
          <Bar ref="barChartRef" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="m-[5px]">
          <WordCloud ref="cloudChartRef" />
        </el-card>
      </el-col>
    </el-row>
    <div class="filings">
      <a class="change-color" href="http://beian.miit.gov.cn/" target="_blank"
        >蜀ICP备2023007772号</a
      >
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.filings {
  margin-top: 20px;
  text-align: center;
  color: #333;
  font-size: 12px;

  .change-color {
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
      color: #000;
    }
  }
}

.svg-fill {
  transition: all 0.3s;
}
/* 鼠标悬停的样式 */
.svg-fill:hover {
  transform: scale(1.1);
}
</style>
