<script setup>
import { shallowRef } from "vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import First from "@/components/WelcomeComps/first";
import Second from "@/components/WelcomeComps/second";
import TypeWriter from "@/components/TypeWriter/type-writer";
import { getSentence, getKey } from "@/api/home";

const menuList = [
  {
    label: "首页",
    path: "/home",
  },
  {
    label: "相册",
    path: "/photoAlbum",
  },
  {
    label: "说说",
    path: "/talk",
  },
  {
    label: "留言",
    path: "/message/list",
  },
  {
    label: "友链",
    path: "/link/list",
  },
  {
    label: "切换",
  },
];
const saying = ref([]);
const router = useRouter();
const componentId = shallowRef(null);

let flag = true;
componentId.value = Second;
const toggle = () => {
  flag = !flag;
  componentId.value = flag ? Second : First;
};

const goMenu = (val) => {
  if (val) {
    router.push(val);
  } else {
    toggle();
  }
};

const getAppKey = async () => {
  let appRes = await getKey();
  try {
    if (appRes.code == 0) {
      let res = await getSentence(appRes.data.cola_key);
      if (res.code == 0) {
        saying.value = [res.data.note];
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (!saying.value.length) {
      saying.value = ["这次我不想逃，喝掉失忆毒药", "斯人若彩虹，遇上方知有"];
    }
  }
};

onMounted(() => {
  getAppKey();
});
</script>

<template>
  <div class="welcome-box">
    <div class="font">M's Blog</div>
    <TypeWriter class="type-writer" :typeList="saying"></TypeWriter>
    <ul class="home-tab">
      <li v-for="item in menuList" :key="item.path" @click="goMenu(item.path)">
        {{ item.label }}
      </li>
    </ul>
    <transition name="component">
      <component :is="componentId"></component>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.welcome-box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
}

.font {
  position: absolute;
  top: 45%;
  left: 50%;
  z-index: 999;
  font-style: italic;
  transform: translate(-50%, -50%);
  font-size: clamp(2em, 8vmin, 20em);
  color: var(--global-white);
  padding: 0.5rem;
  cursor: pointer;
}
.font:hover {
  animation: anime 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95) alternate forwards;
}

@keyframes anime {
  from {
    font-variation-settings:
      "wght" 300,
      "slnt" 15;
    text-shadow: none;
  }
  to {
    font-variation-settings:
      "wght" 800,
      "slnt" 0;
    text-shadow:
      3px 3px 0px #00e6e6,
      6px 6px 0px #01cccc,
      9px 9px 0px #00bdbd,
      12px 12px 8px #dda121;
  }
}

.type-writer {
  position: absolute;
  top: 55%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -50%);
}

.home-tab {
  position: absolute;
  top: 65%;
  left: 50%;
  z-index: 999;
  transform: translateX(-50%);
  min-height: 3rem;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  flex-wrap: nowrap;
  font-size: 1.2rem;
  color: var(--global-white);
  font-weight: 600;
  margin-bottom: 1rem;
  border-radius: 2rem;
  border: 2px solid var(--global-white);

  li {
    word-break: keep-all;
    margin-right: 1rem;
  }
}
</style>
