<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { _getLocalItem } from "@/utils/tool";
import { staticData } from "@/store/index.js";

import { Moon, Sunrise } from "@element-plus/icons-vue";

const staticStore = staticData();
const { mainTheme } = storeToRefs(staticStore);
const currentTheme = ref("");

onMounted(() => {
  const th = _getLocalItem("mainTheme");
  // 若存在缓存用缓存
  if (th) {
    const nowTh = mainTheme.value ? "dark" : "light";
    if (th !== nowTh) {
      changeSwitch();
    }
  } else {
    const now = new Date().getHours();
    // 判断是白天还是黑夜
    if (now >= 8 && now <= 18) {
      // 如果是白天，就要从黑夜切换为白天
      if (mainTheme.value) {
        changeSwitch();
      }
    } else {
      if (!mainTheme.value) {
        changeSwitch();
      }
    }
  }
  currentTheme.value = mainTheme.value;
});

const changeSwitch = () => {
  staticStore.switchMainTheme();
};
</script>

<template>
  <el-switch
    v-model="currentTheme"
    size="default"
    :active-icon="Sunrise"
    inline-prompt
    :inactive-icon="Moon"
    active-color="#000"
    inactive-color="#000"
    @change="changeSwitch"
  />
</template>

<style lang="scss" scoped></style>
