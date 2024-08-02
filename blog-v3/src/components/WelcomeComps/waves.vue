<script setup>
defineProps({
  height: {
    type: String,
    default: "6rem",
  },
});
</script>

<template>
  <svg
    class="waves"
    :style="{ height, minHeight: height }"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28"
    preserveAspectRatio="none"
    shape-rendering="auto"
  >
    <defs>
      <path
        id="gentle-wave"
        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
      />
    </defs>
    <g class="parallax">
      <use xlink:href="#gentle-wave" x="48" y="0" />
      <use xlink:href="#gentle-wave" x="48" y="3" />
      <use xlink:href="#gentle-wave" x="48" y="5" />
      <use xlink:href="#gentle-wave" x="48" y="7" />
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
  fill: var(--wave-one-color);
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
  fill: var(--wave-two-color);
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
  fill: var(--wave-four-color);
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
  fill: var(--wave-three-color);
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height: 5rem;
    min-height: 5rem;
  }
}
</style>
