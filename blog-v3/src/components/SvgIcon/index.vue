<script setup>
import { watch, reactive } from "vue";

const props = defineProps({
  name: { type: String },
  customClass: { type: String },
  width: {
    type: [String, Number],
    default: "3rem",
  },
  height: {
    type: [String, Number],
    default: "3rem",
  },
});

const svgProps = reactive({
  width: "",
  height: "",
  customClass: "",
  name: "",
});

watch(
  () => props,
  () => {
    // 判断给单位没有
    svgProps.width = /^[\d|.]*$/g.test(props.width) ? props.width + "rem" : props.width;
    svgProps.height = /^[\d|.]*$/g.test(props.height) ? props.height + "rem" : props.height;
    svgProps.name = props.name ? `#icon-${props.name}` : "#icon";
    svgProps.customClass = props.customClass ? "svg-icon " + props.customClass : "svg-icon";
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <svg
    :class="svgProps.customClass"
    :style="`width: ${svgProps.width};height: ${svgProps.width || svgProps.height};`"
    aria-hidden="true"
  >
    <use :xlink:href="svgProps.name"></use>
  </svg>
</template>

<style scoped>
.svg-icon {
  vertical-align: -0.15rem;
  fill: currentColor;
  overflow: hidden;
}
</style>
