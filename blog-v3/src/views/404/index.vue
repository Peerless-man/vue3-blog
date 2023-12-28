<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeUnmount } from "vue";

const router = useRouter();

const goBack = (type) => {
  type == "back" ? router.go(-1) : router.push("/");
};

const time = ref(0);
const timer = setInterval(() => {
  time.value++;
  if (time.value >= 5) {
    goBack();
    timer && clearInterval(timer);
  }
}, 1000);

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<template>
  <div class="not-found">
    <div class="flex items-center">
      <el-button type="primary" size="small" @click="goBack('back')">返回上一页</el-button>
      <span class="!ml-[5px] cursor-pointer text-sm hover:text-primary-blue" @click="goBack"
        >返回首页</span
      >
    </div>
    <p class="!mt-[5px]">{{ 5 - time }} 秒后自动返回首页......</p>

    <svg-icon name="404" :width="30" :height="30"></svg-icon>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
