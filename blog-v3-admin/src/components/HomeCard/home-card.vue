<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: ""
  },
  value: {
    type: [String, Number],
    default: ""
  }
});
</script>

<template>
  <el-card class="m-[5px]">
    <div class="flex justify-between items-center">
      <div class="icon">
        <slot />
      </div>
      <div class="flex flex-col justify-between items-center">
        <span class="label">{{ props.label }}</span>
        <div class="value">{{ props.value }}</div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.label {
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.value {
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
}

.icon {
  width: 48px;
  height: 48px;
  cursor: pointer;
}
</style>
