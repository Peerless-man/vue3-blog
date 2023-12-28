<template>
  <div class="card-title">
    <i :class="['iconfont', props.icon]" :style="{ fontSize: props.size, color: props.color }"></i>
    <span> {{ props.title }}</span>
  </div>
  <slot></slot>
</template>
<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "-",
  },
  title: {
    type: String,
    default: "-",
  },
  size: {
    type: String,
    default: "1.2rem",
  },
  color: {
    type: String,
    default: "#676767",
  },
});
</script>
<style lang="scss" scoped>
.card-title {
  font-size: 1.2rem;
  line-height: 2.4;
  .iconfont {
    font-weight: 900;
  }
  span {
    margin-left: 0.3rem;
  }
}
</style>
