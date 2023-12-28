<script setup>
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
</script>
<template>
  <div class="flex_r_start">
    <SkeletonItem variant="circle" width="1.8rem" height="1.8rem" />
    <SkeletonItem width="35%" height="1.8rem" left="0.3rem" />
  </div>
  <div style="margin-top: 1rem">
    <SkeletonItem width="40%" height="1.2rem" />
    <SkeletonItem width="90%" height="1.2rem" />
    <SkeletonItem width="60%" height="1.2rem" />
  </div>
</template>
