<script setup>
import { nextTick, reactive, ref, watch, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

//接收需要实现滚动的数据
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 1,
  },
});
const id = ref(null);
//初始值
const d = reactive({
  num: 0,
});
//实现动画的方法
function AnimateToValue() {
  gsap.to(d, {
    scrollTrigger: ".num-" + id.value,
    duration: props.duration,
    num: props.value,
  });
}

onMounted(() => {
  id.value = Math.random().toString(16).slice(2);

  nextTick(() => {
    gsap.registerPlugin(ScrollTrigger);
    AnimateToValue();
  });
});

//监听传过来的值是否变化，如果变化了，就执行一次
watch(
  () => props.value,
  () => {
    nextTick(() => {
      gsap.registerPlugin(ScrollTrigger);
      AnimateToValue();
    });
  }
);
</script>

<template>
  <span :class="'num-' + id">
    {{ d.num.toFixed(0) }}
  </span>
</template>
