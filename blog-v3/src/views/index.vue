<script setup>
import { shallowRef } from "vue";

import First from "@/components/WelcomeComps/first";
// import Second from "@/components/WelcomeComps/second";

let componentId = shallowRef(null);

// let flag = true;
componentId.value = First;
// const toggle = () => {
//   flag = !flag;
//   componentId.value = flag ? First : Second;
// };
</script>

<template>
  <div class="welcome-index">
    <!-- <div @click="toggle" class="toggle">toggle</div> -->
    <transition name="welcome">
      <component :is="componentId"></component>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.welcome-index {
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
}
// 进入前
.welcome-enter-from {
  opacity: 0;
}
.welcome-enter-to {
  opacity: 1;
}

// 设置进入和离开过程中的动画时长0.5s
.welcome-enter-active,
.welcome-leave-active {
  transition: all 0.5s;
}

// 进入前和离开后为透明，并在右侧20px位置
.welcome-leave-from {
  opacity: 1;
}

.welcome-leave-to {
  opacity: 0;
}

.toggle {
  position: fixed;
  bottom: 50px;
  right: 70px;
  color: #fff;
  z-index: 999;
  cursor: pointer;
}
</style>
