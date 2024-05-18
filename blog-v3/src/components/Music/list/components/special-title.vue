<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 4,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="glitch"
    :style="{
      fontSize: size + 'rem',
      fontWeight: isSpecial ? '300' : '',
    }"
    :data-text="title"
  >
    {{ title }}
  </div>
</template>

<style lang="scss" scoped>
.glitch {
  text-align: center;
  color: white;
  font-size: 52px;
  position: relative;
  margin: 0 auto;
  z-index: 2000;
}
</style>
