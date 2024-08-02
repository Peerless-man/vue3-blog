<script setup lang="ts">
import { ref, computed, type Ref } from "vue";
import { useDark, useECharts, type EchartOptions } from "@pureadmin/utils";
import { getTagDictionary } from "@/api/tag";

import "echarts-wordcloud";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const wordCloudRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(wordCloudRef as Ref<HTMLDivElement>, {
  theme
});
const data = ref([]);
const getTagList = async () => {
  const res = await getTagDictionary();
  if (res.code == 0) {
    data.value = res.result.map(v => {
      return {
        value: Math.random() * 4 + 8,
        name: v.tag_name
      };
    });
  }
};

const init = async () => {
  await getTagList();
  setOptions(
    {
      title: {
        text: ""
      },
      backgroundColor: "#fff",
      // tooltip: {
      //   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      // },
      series: [
        {
          type: "wordCloud",
          //用来调整词之间的距离
          gridSize: 10,
          //用来调整字的大小范围
          // Text size range which the value in data will be mapped to.
          // Default to have minimum 12px and maximum 60px size.
          sizeRange: [12, 28],
          // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
          //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
          // rotationRange: [-45, 0, 45, 90],
          // rotationRange: [ 0,90],
          rotationRange: [0, 0],
          //随机生成字体颜色
          // maskImage: maskImage,
          textStyle: {
            color: function () {
              return (
                "rgb(" +
                Math.round(Math.random() * 255) +
                ", " +
                Math.round(Math.random() * 255) +
                ", " +
                Math.round(Math.random() * 255) +
                ")"
              );
            }
          },
          //位置相关设置
          // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
          // Default to be put in the center and has 75% x 80% size.
          left: "center",
          top: "center",
          right: null,
          bottom: null,
          width: "100%",
          height: "100%",
          //数据
          data: data.value
        }
      ]
    },
    {
      name: "click",
      callback: params => {
        console.log("click", params);
      }
    }
  );
};

init();

defineExpose({
  resize
});
</script>

<template>
  <div ref="wordCloudRef" style="width: 100%; height: 35vh" />
</template>
