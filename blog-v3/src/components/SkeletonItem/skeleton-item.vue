<template>
  <el-skeleton-item
    v-bind="$attrs"
    :style="`width: ${width}; height: ${height}; margin-left:${left};margin-top:${top};`"
  />
</template>
<script setup>
defineProps({
  // 宽度
  width: {
    type: [Number, String],
    default: "100%",
  },
  height: {
    type: [Number, String],
    default: "100%",
  },
  // margin-left
  left: {
    type: [Number, String],
    default: 0,
  },
  top: {
    type: [Number, String],
    default: 0,
  },
});
</script>
