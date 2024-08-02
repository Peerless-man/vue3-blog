<script setup>
import { ref, h, onActivated } from "vue";
import { useRouter } from "vue-router";
import { user, staticData } from "@/store/index";
import { storeToRefs } from "pinia";

import TypeWriter from "@/components/TypeWriter/type-writer";
import CardMessage from "./components/card-message";
import DanmuMessage from "./components/danmu-message";
import PageHeader from "@/components/PageHeader";
import { ElNotification } from "element-plus";

import { addMessage } from "@/api/message";

const router = useRouter();
const { getUserInfo } = storeToRefs(user());
const { getMessageTypeIsCard } = storeToRefs(staticData());

const messageRef = ref(null);
const message = ref("");
const showMessageInput = ref(false);
const isLoaded = ref(false);

const toggle = () => {
  staticData().setMessageTypeIsCard(!getMessageTypeIsCard.value);
};

const userAddMessage = () => {
  if (getMessageTypeIsCard.value) {
    router.push({ path: "/message/publish", query: { type: "add" } });
  } else {
    if (!message.value) {
      ElNotification({
        offset: 60,
        title: "温馨提示",
        duration: 3000,
        message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请输入留言内容"),
      });
      return;
    }
    const form = {
      id: 0,
      message: message.value,
      color: "",
      font_size: 16,
      font_weight: 500,
      bg_color: "transparent",
      bg_url: "",
      user_id: getUserInfo.value.id,
      tag: "赞不绝口",
      nick_name: getUserInfo.value.nick_name || "游客",
      avatar: getUserInfo.value.avatar || "游客",
      isNew: true,
    };
    // 保存弹幕
    addMessage(form).then((res) => {
      if (res.code == 0) {
        messageRef.value && messageRef.value.addDanmu(form);
        message.value = "";
        ElNotification({
          offset: 60,
          title: "提示",
          message: h(
            "div",
            { style: "color: #7ec050; font-weight: 600;" },
            form.id ? "修改成功" : "留言成功"
          ),
        });
      }
    });
  }
};

const hideSearchInput = () => {
  getMessageTypeIsCard.value && messageRef.value && messageRef.value.hideSearchInput();
};

onActivated(() => {
  if (isLoaded.value && !getMessageTypeIsCard.value) {
    messageRef.value && messageRef.value.init();
  }
  isLoaded.value = true;
});
</script>

<template>
  <PageHeader v-if="getMessageTypeIsCard">
    <template #route>
      <el-popover
        placement="top-start"
        :width="110"
        trigger="hover"
        :content="`切换成${getMessageTypeIsCard ? '弹幕' : '卡片'}模式`"
      >
        <template #reference>
          <div class="message-title cursor-pointer !z-[9999]" @click="toggle">留言板</div>
        </template>
      </el-popover>
    </template>
    <div class="message-header">
      <div class="flex items-center !w-[100%] !h-[1.2rem] !z-[9999]">
        <TypeWriter
          class="type-writer"
          size="1.2rem"
          :typeList="['生活原本沉闷，但跑起来就会有风!']"
        ></TypeWriter>
      </div>
      <div class="publish flex items-center">
        <el-popover placement="top-start" :width="110" trigger="hover" content="点我去发表留言">
          <template #reference>
            <svg-icon
              class="!z-[9999] cursor-pointer"
              name="publish"
              :width="4"
              :height="4"
              @click="userAddMessage"
              @mouseenter="showMessageInput = true"
            ></svg-icon>
          </template>
        </el-popover>
      </div>
    </div>
  </PageHeader>
  <div v-else class="relative !w-[100%] !h-[100vh] flex flex-col justify-center items-center">
    <el-popover
      placement="top-start"
      :width="110"
      trigger="hover"
      :content="`切换成${getMessageTypeIsCard ? '弹幕' : '卡片'}模式`"
    >
      <template #reference>
        <div class="message-title cursor-pointer !z-[9999]" @click="toggle">留言</div>
      </template>
    </el-popover>
    <div class="!mt-[3rem] flex items-center">
      <transition name="down" mode="out-in">
        <el-input
          v-model="message"
          class="!z-[9999] message-input !mr-[10px]"
          placeholder="一定要留下点什么～"
          v-if="showMessageInput"
          :maxlength="555"
          @blur="
            () => {
              showMessageInput = false;
            }
          "
          @keyup.enter="userAddMessage"
        ></el-input>
      </transition>
      <div class="flex items-center">
        <el-popover placement="top-start" :width="110" trigger="hover" content="点击发送">
          <template #reference>
            <svg-icon
              class="!z-[9999] cursor-pointer"
              name="publish"
              :width="4"
              :height="4"
              @click="userAddMessage"
              @mouseenter="showMessageInput = true"
            ></svg-icon>
          </template>
        </el-popover>
      </div>
    </div>
  </div>

  <div :class="['message', getMessageTypeIsCard ? '!min-h-[100vh]' : '']" @click="hideSearchInput">
    <component ref="messageRef" :is="getMessageTypeIsCard ? CardMessage : DanmuMessage"></component>
  </div>
</template>

<style lang="scss" scoped>
.message {
  .row-height {
    min-height: 22rem;
    transition: height 0.8s;
  }
  &-header {
    position: relative;
    width: 100%;

    .publish {
      position: absolute;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.message-title {
  display: inline-block;
  position: relative;
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--router-color);
}

.type-writer {
  color: var(--router-color);
}

.message-input {
  width: 300px;
  height: 60px;
  border-radius: 60px;
  background: #676767;
}

.down-enter-from,
.down-leave-to {
  opacity: 0;
  transform: translateY(-80px);
}

.down-enter-active,
.down-leave-active {
  transition: all 0.8s;
}

.down-enter-to,
.down-leave-from {
  opacity: 1;
  transform: translateY(0);
}

:deep(.el-input__wrapper) {
  border-radius: 60px;
}
</style>
