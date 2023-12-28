<script setup>
defineProps({
  size: {
    type: Number,
    default: 30,
  },
});
</script>
<template>
  <div
    :class="['loading', size > 30 ? 'big' : 'small']"
    :style="{
      width: size + 'px',
      height: size + 'px',
    }"
  >
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  position: relative;
}

/* 6个正方形 */
.loading span {
  height: 100%;
  width: 100%;
  position: absolute;
  animation: move 3.5s linear infinite;
}

@keyframes move {
  74% {
    transform: rotate(600deg);
  }

  79% {
    transform: rotate(720deg);
    opacity: 1;
  }

  80% {
    transform: rotate(720deg);
    opacity: 0;
  }

  100% {
    transform: rotate(810deg);
    opacity: 0;
  }
}

.loading span:nth-child(2) {
  animation-delay: 0.1s;
}

.loading span:nth-child(3) {
  animation-delay: 0.2s;
}

.loading span:nth-child(4) {
  animation-delay: 0.3s;
}

.loading span:nth-child(5) {
  animation-delay: 0.4s;
}

.loading span:nth-child(6) {
  animation-delay: 0.5s;
}

.big span::before {
  content: "";
  position: absolute;
  height: 5px;
  width: 5px;
  background-color: var(--primary);
  border-radius: 50%;
  bottom: 0px;
  left: calc(50% - 5px);
}

.small span::before {
  content: "";
  position: absolute;
  height: 3px;
  width: 3px;
  background-color: var(--primary);
  border-radius: 50%;
  bottom: 0px;
  left: calc(50% - 3px);
}
</style>
