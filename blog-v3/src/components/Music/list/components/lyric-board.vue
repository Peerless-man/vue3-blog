<script setup>
import { watch, onMounted, onBeforeUnmount, nextTick, ref } from "vue";
import { music } from "@/store";
import { storeToRefs } from "pinia";
import { gsapTransLyric } from "@/utils/transform";

import SpecialTitle from "./special-title.vue";

let lyricBox, timer, timer1, timer2, timer3;

const {
  getMusicInfo,
  getIsToggleImg,
  getMusicDescription,
  getIsPaused,
  getCurrentLyticIndex,
  getShowLyricBoard,
  getLyricType,
} = storeToRefs(music());

const replaceUrl = ref("");
const fileList = ref([]);
const brightness = ref(0.3);

const scrollToMiddle = () => {
  nextTick(() => {
    let current = document.getElementById("currentLyticIndex");

    if (!current) return;

    let h = current
      ? current.offsetTop -
        Math.round(lyricBox.clientHeight / 2) +
        Math.round(current.offsetHeight / 2) +
        -30
      : 0;

    lyricBox &&
      lyricBox.scrollTo({
        top: h,
        behavior: "smooth",
      });
  });
};

const fullScreen = () => {
  const app = document.querySelector(".lyric-mask");
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    app.requestFullscreen();
  }
};

const goToIndex = (index) => {
  music().setCurrentTimeByClickLyric(index);
};

const toggleLyricType = (type) => {
  music().setLyricType(type);

  if (type == "COMMON") {
    nextTick(() => {
      scrollToMiddle();
    });
  } else {
    gsapTransLyric(".special-title", 0.8);
    animateTitle();
  }
};

const animateTitle = () => {
  nextTick(() => {
    if (timer3) {
      clearTimeout(timer3);
      timer3 = null;
    }
    timer3 = setTimeout(() => {
      gsapTransLyric(".special-title", 0.8, true);
    }, 3600);
  });
};

const calcLyricDuration = () => {
  const nextTime = getMusicInfo.value.lyricTimeList[getCurrentLyticIndex.value + 1];
  const currentTime = getMusicInfo.value.lyricTimeList[getCurrentLyticIndex.value];

  const duration = nextTime - currentTime;

  const fromDuration = duration >= 1500 ? 1.2 : 0;
  const leaveDuration = duration >= 1500 ? 0.3 : 0;

  return {
    duration,
    fromDuration,
    leaveDuration,
  };
};

const animateSpecial = () => {
  const { duration, fromDuration, leaveDuration } = calcLyricDuration();

  if (!duration || duration < 1500) {
    document.querySelector(".special-lyric").style.opacity = 1;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      document.querySelector(".special-lyric").style.opacity = 0;
    }, duration - 200);
  } else {
    if (timer1) {
      clearTimeout(timer1);
      timer1 = null;
    }
    timer1 = setTimeout(() => {
      gsapTransLyric(".special-lyric", fromDuration);
    });
    if (timer2) {
      clearTimeout(timer2);
      timer2 = null;
    }
    timer2 = setTimeout(
      () => {
        gsapTransLyric(".special-lyric", leaveDuration, true);
      },
      duration - leaveDuration * 1000
    );
  }
};

const replaceImage = (file) => {
  replaceUrl.value = URL.createObjectURL(file.raw);
};

const changeBrightness = (flag) => {
  if (flag) {
    if (brightness.value < 1) {
      brightness.value += 0.1;
    }
  } else {
    if (brightness.value > 0.1) {
      brightness.value -= 0.1;
    }
  }
};

watch(
  () => getCurrentLyticIndex.value,
  () => {
    if (getLyricType.value == "COMMON") {
      scrollToMiddle();
    } else {
      nextTick(() => {
        animateSpecial();
      });
    }
  }
);

watch(
  () => getShowLyricBoard.value,
  (newV) => {
    if (newV) {
      nextTick(() => {
        scrollToMiddle();
      });
    }
  }
);
watch(
  () => getMusicInfo.value.id,
  (newV) => {
    if (getLyricType.value == "SPECIAL") {
      if (newV) {
        gsapTransLyric(".special-title", 0.8);
        animateTitle();
      }
    }
  }
);

watch(
  () => getIsPaused.value,
  (newV) => {
    if (getLyricType.value == "SPECIAL") {
      if (newV) {
        gsapTransLyric(".special-title", 0.5);
        clearTimeout(timer2);
        timer2 = null;
      } else {
        animateTitle();
      }
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  lyricBox = document.getElementById("lyricBox");
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  clearTimeout(timer1);
  clearTimeout(timer2);
  clearTimeout(timer3);
  timer = null;
  timer1 = null;
  timer2 = null;
  timer3 = null;
});
</script>

<template>
  <div
    :class="['lyric-mask', getShowLyricBoard ? 'lyric-mask-show' : 'lyric-mask-hide']"
    :style="{
      backgroundImage:
        getLyricType == 'SPECIAL' ? `url(${replaceUrl || getMusicDescription.al.picUrl})` : '',
    }"
  >
    <div
      v-if="getLyricType == 'SPECIAL'"
      class="special-mask"
      :style="{ backgroundColor: `rgba(0,0,0, ${brightness})` }"
    ></div>
    <div class="toggle-type">
      <span class="type-btn mr-[10px]" v-show="getLyricType == 'SPECIAL'">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          :multiple="false"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="replaceImage"
        >
          ReplaceBg
        </el-upload>
      </span>
      <span class="type-btn" v-show="getLyricType == 'SPECIAL'" @click="toggleLyricType('COMMON')"
        >Normal</span
      >
      <span class="type-btn" v-show="getLyricType == 'COMMON'" @click="toggleLyricType('SPECIAL')"
        >Special</span
      >
    </div>
    <div
      v-show="getLyricType == 'COMMON'"
      class="!w-[100%] !h-[100%] flex justify-between items-center"
    >
      <div class="left">
        <div class="text-4xl font-semibold">
          {{ getMusicDescription?.name }}
        </div>
        <div class="disc-box">
          <img
            :class="[
              'music-img',
              'animate__animated',
              'animate__fadeIn',
              getIsToggleImg ? '' : 'disc-rotate',
              getIsPaused ? 'paused' : '',
            ]"
            :src="getMusicDescription?.al?.picUrl"
            @click="fullScreen"
          />
        </div>
      </div>
      <div id="lyricBox" class="right">
        <div class="!p-[10px]">
          <div>
            <div class="text-2xl leading-loose text-center">
              {{ getMusicDescription?.name }}
            </div>
          </div>
          <div
            :id="getCurrentLyticIndex == index ? 'currentLyticIndex' : ''"
            :class="['lyric-word', getCurrentLyticIndex == index ? 'current' : '']"
            v-for="(item, index) in getMusicInfo.lyricList"
            :key="index"
            @click="goToIndex(index)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="getLyricType == 'SPECIAL'"
      class="special !w-[100%] !h-[100%] flex flex-col justify-center items-center"
    >
      <div class="special-title">
        <SpecialTitle :title="`《 ${getMusicDescription?.name} 》`" @click="fullScreen" />

        <div class="author text-2xl">
          <span class="brightness" @click="changeBrightness(false)"></span> --
          {{ getMusicDescription?.ar[0]?.name }}
          <span class="brightness" @click="changeBrightness(true)"></span>
        </div>
      </div>
      <span class="special-lyric text-3xl">
        {{ getMusicInfo.lyricList[getCurrentLyticIndex] }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lyric-mask {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: -5px;
  z-index: 2000;
  padding-top: 35px;
  background-color: #fff;
  overflow: hidden;
  display: none;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;

  .special-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
  }

  .toggle-type {
    position: absolute;
    top: 10px;
    right: 60px;
    z-index: 1;
    display: flex;

    .type-btn {
      cursor: pointer;
      color: #62c28a;

      &:hover {
        color: #62c28a;
      }
    }
  }

  .left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .right {
    padding: 20% 5%;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.special {
  &-title {
    color: #fff;
    cursor: pointer;
    z-index: 2;
    height: 180px;
  }

  .author {
    line-height: 2.8;
    color: #fff;
    text-shadow: 0px 0px 5px #ffffff;
    cursor: pointer;
    text-align: center;
  }

  .brightness {
    cursor: pointer;
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  .special-lyric {
    color: #fff;
    text-align: center;
    z-index: 2;
    font-smooth: never;
    height: 60px;
    line-height: 60px;
    text-shadow: 0px 0px 5px #ffffff;
  }
}

.lyric-mask-show {
  display: block;
  animation: showBoard 0.3s ease-in-out forwards;
}
.lyric-mask-hide {
  animation: hideBoard 0.3s ease-in-out forwards;
}
@keyframes showBoard {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

@keyframes hideBoard {
  0% {
    top: 0;
    display: block;
  }
  100% {
    top: 100%;
  }
}

.disc-rotate {
  animation: rotate360 36s infinite linear;
}

.paused {
  animation-play-state: paused;
}

.disc-box {
  position: relative;
  width: 30rem;
  height: 30rem;
  display: grid;
  place-items: center;

  .disc {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .music-img {
    width: 20rem;
    height: 20rem;
    border-radius: 10rem;
    object-fit: cover;
    cursor: pointer;
  }
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.lyric-word {
  text-align: center;
  line-height: 2;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
  opacity: 0.5;
}
.current {
  font-size: 1.5rem;
  font-weight: bold;
  opacity: 1;
}

// mobile
@media screen and (max-width: 768px) {
  .lyric-mask {
    .right {
      width: 100%;
    }
    .left {
      display: none;
    }
  }

  .toggle-type {
    top: 60px !important;
  }
}

:fullscreen {
  /* 代码 */
  .toggle-type {
    display: none !important;
  }
}
</style>
