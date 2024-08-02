<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { staticData } from "@/store/index.js";
import { debounce } from "@/utils/tool.js";

const { mainTheme } = storeToRefs(staticData());
const isFirst = ref(true);
const props = defineProps({
  bottom: {
    type: [String, Number],
    default: "20px",
  },
  right: {
    type: [String, Number],
    default: "0px",
  },
  // 图标
  svgName: {
    type: String,
    default: "Rocket",
  },
  svgWidth: {
    type: Number,
    default: 6,
  },
  animation: {
    type: Boolean,
    default: true,
  },
  rotateDeg: {
    type: Number,
    default: 0,
  },
});

const backTopProps = reactive({
  bottom: "",
  right: "",
  width: "",
});

watch(
  () => props,
  () => {
    backTopProps.bottom = /^[\d|.]*$/g.test(props.bottom) ? props.bottom + "rem" : props.bottom;
    backTopProps.right = /^[\d|.]*$/g.test(props.right) ? props.right + "rem" : props.right;
  },
  {
    immediate: true,
    deep: true,
  }
);

const svgThemeName = computed(() => {
  return mainTheme.value ? "dark" + props.svgName : "light" + props.svgName;
});

const backTopShow = ref(false);
const scroll = debounce(() => {
  let scrollTop = ref(0);
  scrollTop.value =
    window.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop.value > 200) {
    // 大于200显示
    backTopShow.value = true;
    isFirst.value = false;
  } else {
    backTopShow.value = false;
  }
}, 10);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  // 注册滚动
  window.addEventListener("scroll", scroll);
});

onBeforeUnmount(() => {
  // 取消注册
  window.removeEventListener("scroll", scroll);
});
</script>

<template>
  <div
    v-if="!isFirst"
    :class="[backTopShow ? 'back-top-show' : 'back-top-hidden', 'back-top']"
    :style="`bottom: ${backTopProps.bottom};right:${backTopProps.right};height: ${backTopProps.width};width:${backTopProps.width};`"
  >
    <svg-icon
      :style="{ transform: `rotateZ(${props.rotateDeg}deg)` }"
      :name="svgThemeName"
      :width="svgWidth"
      @click="scrollToTop"
    ></svg-icon>
  </div>
</template>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  overflow: hidden;
  transition: all ease-in-out 0.3s;
  &-show {
    animation: show 0.8s ease-in-out forwards;
  }
  &-hidden {
    animation: hide 0.8s ease-in-out forwards;
  }
}
@keyframes show {
  0% {
    transform: translateX(0);
    transform: translateY(100px);
    opacity: 0;
  }

  80% {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
    transform: translateX(0px);
  }

  80% {
    opacity: 0;
    transform: translateY(300px);
  }

  100% {
    transform: translateX(300px);
  }
}
</style>
