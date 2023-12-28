<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { ElConfigProvider } from "element-plus";
import { addView } from "@/api/site";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});

onMounted(async () => {
  // 上传访问量
  await addView();
  if (window.name == "") {
    window.name = "isReload"; // 在首次进入页面时我们可以给window.name设置一个固定值,判断用户是刷新还是首次进入
  }
});
</script>
