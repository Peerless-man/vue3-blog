<script setup>
import { ref, onMounted } from "vue";
import { getAllMessage } from "@/api/message";
import VueDanmaku from "vue3-danmaku";

const vueDanmakuRef = ref(null);
const danmus = ref([]);
const loop = ref(false);

const addDanmu = (danmu) => {
  vueDanmakuRef.value && vueDanmakuRef.value.add(danmu);
};

const init = () => {
  danmus.value = [];
  getAllMessage().then((res) => {
    danmus.value = res.result.list;
    if (danmus.value.length > 100) {
      loop.value = true;
    }
  });
};

onMounted(() => {
  init();
});

defineExpose({
  addDanmu,
  init,
});
</script>

<template>
  <vue-danmaku
    v-if="danmus.length"
    ref="vueDanmakuRef"
    class="!absolute !top-[60px] left-0 w-[100%] !z-[2] h-[calc(100vh-60px)]"
    v-model:danmus="danmus"
    :loop="loop"
    useSlot
    :speeds="60"
    :isSuspend="true"
  >
    <template v-slot:dm="{ danmu }">
      <div class="danmu-item">
        <el-avatar :src="danmu.avatar">{{ danmu.nick_name }}</el-avatar> :
        <span class="new-item" v-if="danmu.isNew" v-html="danmu.message"></span>
        <span v-else v-html="danmu.message"></span>
      </div>
    </template>
  </vue-danmaku>
  <div class="shooting_stars !z-[1]">
    <div class="night">
      <span v-for="i in 20" :key="i" class="shooting_star"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.danmu-item {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #fff;

  .new-item {
    position: relative;
    display: inline-block;
    padding: 3px 60px 3px 3px;
    border-radius: 8px;

    &::after {
      content: "new";
      position: absolute;
      top: -5px;
      right: 0;
      color: #fff;
      background: #ff1900;
      padding: 2px 3px;
      border-radius: 8px;
    }
  }
}

.shooting_stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  height: 100vh;
  overflow: hidden;
  display: flex;
  font-family: "Anton", sans-serif;
  justify-content: center;
  align-items: center;
}

.night {
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotateZ(45deg);
}

.shooting_star {
  position: absolute;
  left: 10%;
  top: 20%;
  height: 2px;
  background: linear-gradient(-45deg, rgba(95, 145, 255, 1), rgba(0, 0, 255, 0));
  border-radius: 999px;
  filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
  animation:
    tail 5s ease-in-out infinite,
    shooting 5s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(
      -45deg,
      rgba(0, 0, 255, 0),
      rgba(95, 145, 255, 1),
      rgba(0, 0, 255, 0)
    );
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    animation: shining 3000 ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(
      -45deg,
      rgba(0, 0, 255, 0),
      rgba(95, 145, 255, 1),
      rgba(0, 0, 255, 0)
    );
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    animation: shining 3000 ease-in-out infinite;
    transform: translateX(50%) rotateZ(-45deg);
  }

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      $delay: random(9999) + 0ms;
      top: calc(50% - #{random(400) - 200px});
      left: calc(30% - #{random(300) + 0px});
      animation-delay: $delay;
      // opacity: random(50) / 100 + 0.5;

      &::before,
      &::after {
        animation-delay: $delay;
      }
    }
  }
}

@keyframes tail {
  0% {
    width: 0;
  }

  30% {
    width: 100px;
  }

  100% {
    width: 0;
  }
}

@keyframes shining {
  0% {
    width: 0;
  }

  50% {
    width: 30px;
  }

  100% {
    width: 0;
  }
}

@keyframes shooting {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(800px);
  }
}

@keyframes sky {
  0% {
    transform: rotate(45deg);
  }

  100% {
    transform: rotate(45 + 360deg);
  }
}
</style>
