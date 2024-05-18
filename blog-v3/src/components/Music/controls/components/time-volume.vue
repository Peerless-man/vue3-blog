<!--
* @Author: Zhang Yuming
* @Date: 2023-07-03 11:48:49
* @Description: 展示音量、进度等 后续可能加随机播放等
-->
<script setup>
import { defineComponent, ref, watch, inject } from "vue";

import { MODELLIST } from "@/utils/enum";

import CustomMusicList from "../../list/components/custom-music-list.vue";
import { calcMusicTime } from "../../musicTool";

const musicGetters = inject("musicGetters");
const musicSetters = inject("musicSetters");

const { getPlayModel, getVolume, getCurrentTime, getDuration } = musicGetters;

defineComponent({
  name: "TimeVolume",
});

const myPlayModel = {
  RANDOM: "icon-suijibofang",
  LISTLOOP: "icon-liebiaoxunhuan",
  SINGLECYCLE: "icon-danquxunhuan",
};

defineEmits(["update:getVolume"]);

const currentVolume = ref(0);
const elPopoverRef = ref();
// 切换音乐播放模式
const changeModel = () => {
  let index = MODELLIST.findIndex((item) => item == getPlayModel.value);
  if (index != -1) {
    if (index == 2) {
      index = 0;
    } else {
      index = index + 1;
    }
  }
  musicSetters.setPlayModel(MODELLIST[index]);
};

// 手动关闭popover
const closePopover = () => {
  elPopoverRef.value.hide();
};

watch(
  () => getVolume.value,
  (newV) => {
    // 根据pina存的声音来改变播放器声音大小
    // 存的是除以了 100 的小数
    currentVolume.value = newV * 100;
  },
  {
    immediate: true,
  }
);
watch(
  () => currentVolume.value,
  () => {
    // 修改音乐大小 外面会根据音乐大小去调节音乐播放器的声音大小
    musicSetters.setVolume(currentVolume.value);
  }
);
</script>

<template>
  <div class="time-getVolume">
    <!-- 音乐模式 -->
    <i :class="['change-color', 'iconfont', myPlayModel[getPlayModel]]" @click="changeModel"></i>
    <!-- 时间显示 -->
    <span class="time">{{ calcMusicTime(getCurrentTime) }} / {{ calcMusicTime(getDuration) }}</span>
    <!-- 音量调节 -->
    <el-popover placement="top" trigger="click" :width="42">
      <template #reference>
        <i class="iconfont icon-yinliang change-color"> </i>
      </template>
      <template #default>
        <el-slider v-model="currentVolume" :show-tooltip="false" vertical height="60px" />
      </template>
    </el-popover>
    <!-- 歌曲列表 -->
    <el-popover
      ref="elPopoverRef"
      placement="top"
      :width="350"
      :show-arrow="false"
      :teleported="false"
      trigger="click"
      @touchmove.stop.prevent
    >
      <template #reference>
        <i class="iconfont icon-bofangliebiao change-color"></i>
      </template>
      <div class="pop">
        <i class="iconfont icon-off-search" @click="closePopover"></i>
        <CustomMusicList />
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.time-getVolume {
  position: relative;
  width: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .time {
    font-size: 1rem;
  }
}
.getVolume {
  position: absolute;
  top: -22px;
  right: -8px;
}
.icon-yinliang {
  font-size: 1.6rem;
}

.change-color:hover {
  cursor: pointer;
  color: var(--music-main-active);
}

.pop {
  position: relative;
  .icon-off-search {
    position: absolute;
    top: 0px;
    right: 10px;
    font-size: 1.2rem;
    color: var(--top);
    cursor: pointer;
    z-index: 3001;

    &:hover {
      transform: scale(1.1);
      color: var(--hot-color);
    }
  }
}

// mobile
@media screen and (max-width: 768px) {
  .icon-yinliang {
    display: none;
  }
}

:deep(.el-slider__bar) {
  background-color: var(--music-main-active);
}

:deep(.el-slider__button) {
  width: 8px;
  height: 8px;
  border: solid 2px var(--music-main-active);
}
:deep(.el-slider__runway) {
  margin: 6px 16px 4px 16px !important;
}
</style>
