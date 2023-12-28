<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";
import * as echarts from "echarts/core";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const barChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(barChartRef as Ref<HTMLDivElement>, {
  theme
});

setOptions(
  {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      bottom: "20px",
      right: "10px"
    },
    legend: {
      //@ts-expect-error
      right: true,
      data: ["watchers", "fork", "star"]
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0
          // width: "70",
          // overflow: "truncate"
        },
        data: ["2022", "2023"],
        triggerEvent: true
      }
    ],
    yAxis: [
      {
        type: "value",
        triggerEvent: true
      }
    ],
    series: [
      {
        name: "watchers",
        type: "bar",
        barWidth: "15%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#e6a23c"
            },
            {
              offset: 1,
              color: "#eebe77"
            }
          ])
        },
        data: [1, 1]
      },
      {
        name: "fork",
        type: "bar",
        barWidth: "15%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#f56c6c"
            },
            {
              offset: 1,
              color: "#f89898"
            }
          ])
        },
        data: [1, 1]
      },
      {
        name: "star",
        type: "bar",
        barWidth: "15%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#409EFF"
            },
            {
              offset: 1,
              color: "#53a7ff"
            }
          ])
        },
        data: [1, 1]
      }
    ],
    addTooltip: true
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
    }
  }
);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="barChartRef" style="width: 100%; height: 35vh" />
</template>
