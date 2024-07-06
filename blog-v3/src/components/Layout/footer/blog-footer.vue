<template>
  <!-- 最外层 div 是占位置的 -->
  <div
    v-if="route.path !== '/message/chat'"
    class="footer_box flex flex-col items-center justify-center"
  >
    <!-- eslint-disable-next-line -->
    <div class="footer-color">&copy 小张的博客 2023</div>
    <a class="footer-color change-color mt-[5px]" href="http://beian.miit.gov.cn/" target="_blank"
      >蜀ICP备2023007772号</a
    >
    <div class="footer-color mt-[5px] flex justify-center flex-wrap">
      <a
        class="p-[3px]"
        href="https://www.aliyun.com/?spm=5176.28055625.J_3207526240.1.6a27154aw7v5VK"
        target="_blank"
      >
        <img
          src="https://img.shields.io/badge/%E9%98%BF%E9%87%8C%E4%BA%91-ECS%E6%9C%8D%E5%8A%A1%E5%99%A8-orange"
          alt=""
      /></a>
      <a class="p-[3px]" href="https://imzbf.github.io/md-editor-v3/docs/index" target="_blank">
        <img
          src="https://img.shields.io/badge/MdEditorV3-MD%E7%BC%96%E8%BE%91%E5%99%A8-159957"
          alt=""
      /></a>
      <a class="p-[3px]" href="https://butterfly.js.org/" target="_blank">
        <img src="https://img.shields.io/badge/HEXO-BUTTERFLY-blue" alt="" />
      </a>
      <a class="p-[3px]" href="https://min.io/" target="_blank">
        <img
          src="https://img.shields.io/badge/minio-%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E7%B3%BB%E7%BB%9F-purple
"
          alt=""
        />
      </a>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style lang="scss" scoped>
.footer-color {
  color: var(--font-color);
  text-align: center;
}

.change-color {
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    color: var(--global-black);
  }
}
</style>
