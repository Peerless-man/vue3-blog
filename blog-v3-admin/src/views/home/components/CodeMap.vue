<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";

const { isDark } = useDark();

const props = defineProps({
  commitList: {
    type: Array,
    default: () => {}
  }
});

const loading = ref(true);

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const codeMapChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(
  codeMapChartRef as Ref<HTMLDivElement>,
  {
    theme
  }
);
const init = () => {
  setOptions({
    tooltip: {
      formatter: function (params) {
        return params.value[0] + " : " + params.value[1];
      }
    },
    visualMap: {
      show: false,
      min: 0,
      max: 5,
      inRange: {
        color: ["#ebedf0", "#d6e685", "#8cc665", "#1e6823"]
      }
    },
    calendar: {
      itemStyle: {
        color: "#f1f1f1",
        borderWidth: 3,
        borderColor: "#fff"
      },
      cellSize: ["auto", 18],
      range: [
        props.commitList[props.commitList.length - 1][0],
        props.commitList[0][0]
      ],
      splitLine: {
        show: false
      },
      dayLabel: {
        firstDay: 7,
        nameMap: "ZH"
      },
      monthLabel: {
        nameMap: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ]
      },
      yearLabel: {
        show: false
      }
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: props.commitList
    }
  });
};

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);

watch(
  () => props.commitList,
  newV => {
    if (newV.length > 0) {
      loading.value = false;
      init();
    } else {
      loading.value = true;
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <el-skeleton :rows="5" animated :loading="loading">
    <div ref="codeMapChartRef" style="width: 100%; height: 35vh" />
  </el-skeleton>
</template>
