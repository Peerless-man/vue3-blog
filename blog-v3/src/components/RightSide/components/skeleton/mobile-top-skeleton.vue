<script setup>
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
</script>
<template>
  <SkeletonItem variant="image" height="12rem" />
  <div class="flex_r_start">
    <SkeletonItem variant="circle" width="60px" height="60px" top="-2rem" left="2rem" />
    <SkeletonItem width="40%" height="1rem" left="0.3rem" />
  </div>
  <div style="padding: 5px">
    <SkeletonItem height="1rem" width="50%" left="2rem" />
    <SkeletonItem height="1rem" width="80%" left="2rem" />
    <SkeletonItem height="1rem" width="30%" left="2rem" />
  </div>
  <div class="flex_r_around" style="padding: 1.2rem 3rem">
    <SkeletonItem v-for="i in 3" :key="i" width="14%" height="3rem" />
  </div>
  <div style="padding: 0 4rem">
    <SkeletonItem variant="text" height="2.5rem" />
  </div>
  <div class="flex_r_around" style="padding: 0.5rem 5rem">
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
    <SkeletonItem variant="circle" width="2rem" height="2rem" />
  </div>
</template>
