<script setup>
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
</script>

<template>
  <div class="pc">
    <SkeletonItem variant="image" width="45%" height="20rem" />
    <div class="flex_c_around pc-text">
      <SkeletonItem variant="text" width="60%" height="50px" />
      <SkeletonItem variant="text" width="95%" height="40px" />
      <SkeletonItem variant="text" width="65%" height="30px" />
    </div>
  </div>
  <div class="mobile">
    <SkeletonItem variant="image" width="100%" height="18rem" />
    <div class="flex_c_around mobile-text">
      <SkeletonItem variant="text" width="60%" height="45px" />
      <SkeletonItem variant="text" width="95%" height="35px" />
      <SkeletonItem variant="text" width="65%" height="25px" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-text {
    width: 50%;
    height: 12rem;
  }
}
.mobile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  &-text {
    padding: 0.5rem 0;
    width: 90%;
    height: 12rem;
  }
}
@media screen and (min-width: 768px) {
  .mobile {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .pc {
    display: none;
  }
}
</style>
