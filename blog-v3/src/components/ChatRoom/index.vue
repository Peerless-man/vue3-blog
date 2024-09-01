<script setup>
import { ref, h, nextTick, watch, onBeforeUnmount, onMounted } from "vue";
import { user } from "@/store/index";
import { ElNotification, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import { Connection } from "@element-plus/icons-vue";
import { getChatList, clearChat, deleteOneChat } from "@/api/chat";
import { imgUpload } from "@/api/user";

import { UploadFilled } from "@element-plus/icons-vue";
import IconList from "@/components/Comment/item/IconList.vue";

const { getUserInfo } = storeToRefs(user());

defineProps({
  isPc: {
    type: Boolean,
    default: true,
  },
});

let websocket = null;
let timer = null,
  heartBreak = null; // 心跳

const messageList = ref([]);
const chatContainerRef = ref(null);
const onlineList = ref(0);
const hasLoaded = ref(false);
const reConnectionCount = ref(0);
const isConnecting = ref(false);
const loadingMessage = ref(false);
const messageType = ref("text");
const canLoadMore = ref(false);
const newMessageCount = ref(0);
const inputChatRef = ref(null);
const currentIndex = ref(0);
const chatVisible = ref(false);
const yourImageUrl = ref("");
const imageUpload = ref(null);
const imageUploading = ref(false);

const sendMessage = async () => {
  messageType.value = "text";
  if (!getUserInfo.value.id) {
    ElNotification({
      offset: 60,
      title: "温馨提示",
      duration: 3000,
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请先登录"),
    });
    return;
  }
  if (!inputChatRef.value.innerHTML) {
    ElNotification({
      offset: 60,
      duration: 3000,
      title: "温馨提示",
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请输入消息再发送"),
    });
    return;
  }

  if (websocket.readyState !== 1) {
    // 重连后再发送
    reConnect();
  } else {
    // 在线就 直接发送
    wsSend();
  }
};

const wsSend = () => {
  let message;
  switch (messageType.value) {
    case "text":
      if (!inputChatRef.value.innerHTML) return;
      message = {
        type: "message",
        user_id: getUserInfo.value.id,
        content: inputChatRef.value.innerHTML,
        content_type: "text", // 信息是文本
      };
      websocket.send(JSON.stringify(message));
      inputChatRef.value.innerHTML = "";
      break;
    case "image":
      if (!yourImageUrl.value) return;
      message = {
        type: "message",
        user_id: getUserInfo.value.id,
        content: yourImageUrl.value,
        content_type: "image", // 信息是文本
      };
      websocket.send(JSON.stringify(message));
      yourImageUrl.value = "";
      imageUpload.value && imageUpload.value.clearFiles();
      break;
    default:
      break;
  }
};

const initWebsocket = async (isReconnect = false) => {
  isConnecting.value = true;

  // 如果说发现了异常 断开连接了 之前的websocket 还在的话就清空 重连
  if (websocket) {
    websocket.close();
    websocket = null;
  }

  websocket = new WebSocket("ws://mrzym.top/ws/");
  // websocket = new WebSocket("ws://localhost:8889/");

  if (websocket) {
    websocket.onopen = () => {
      isConnecting.value = false;
      websocket.send(
        JSON.stringify({
          type: "init",
          user_id: getUserInfo.value.id || "",
        })
      );
      console.log("WebSocket连接成功");

      // 连上以后设置心跳检测 如果断开就重新连接 并且清空之前的心跳检测 防止内存泄漏
      clearInterval(heartBreak);
      heartBreak = null;

      heartBreak = setInterval(() => {
        if (websocket.readyState !== 1) {
          reConnect();
        }
      }, 30000);
    };
    websocket.onmessage = (event) => {
      if (event.data) {
        const data = JSON.parse(event.data);
        let index;
        // tips 表示提示 message 表示用户发送的消息
        switch (data.type) {
          case "tips":
            if (isReconnect) {
              // 这里重连就重新发送
              wsSend();
              console.log("重连成功");
            } else {
              ElNotification({
                offset: 60,
                title: "提示",
                duration: 3000,
                message: h("div", { style: "color: #7ec050; font-weight: 600;" }, data.content),
              });
            }

            break;
          case "message":
            if (data.content) {
              messageList.value.push(data);
              if (data.user_id !== getUserInfo.value.id) {
                newMessageCount.value++;
              }
              nextTick(() => {
                scrollToBottom();
              });
            }

            break;
          case "onlineList":
            onlineList.value = data.list;
            index = onlineList.value.findIndex((item) => item.user_id === getUserInfo.value.id);
            if (index === -1) {
              clearWebsocket();
            }
            break;
          case "revert":
            index = messageList.value.findIndex((item) => item.id === data.message_id);
            if (index !== -1) {
              messageList.value.splice(index, 1);
            }
            break;
          default:
            break;
        }
      }
    };
    websocket.onerror = () => {
      console.log("WebSocket连接错误");
    };
  } else {
    console.log("WebSocket连接失败");
    ElNotification({
      offset: 60,
      title: "错误提示",
      duration: 3000,
      message: h(
        "div",
        { style: "color: #f56c6c; font-weight: 600;" },
        "聊天室连接失败 正在重新连接"
      ),
    });
    if (timer) return;
    timer = setInterval(() => {
      reConnectionCount.value++;
      initWebsocket();

      // 连上了就不重连了
      if (websocket) {
        clearInterval(timer);
      }
      // 尝试五次 实在是连不上就不连了
      if (reConnectionCount.value == 5) {
        clearInterval(timer);
      }
    }, 5000);
  }
};

const reConnect = () => {
  initWebsocket(true);
};

const getMessageList = async () => {
  loadingMessage.value = true;
  const res = await getChatList({
    size: 10,
    last_id: messageList.value.length > 0 ? messageList.value[0].id : "",
  });

  if (res.code == 0) {
    const list = res.result.list;

    if (messageList.value.length > 0) {
      if (Array.isArray(list) && list.length) {
        messageList.value = list.concat(messageList.value);
        if (list.length == 10) {
          canLoadMore.value = true;
        } else {
          canLoadMore.value = false;
        }
      } else {
        canLoadMore.value = false;
      }
    } else {
      if (Array.isArray(list) && list.length) {
        messageList.value = list;
        if (list.length == 10) {
          canLoadMore.value = true;
        } else {
          canLoadMore.value = false;
        }
      } else {
        canLoadMore.value = false;
      }
    }
    loadingMessage.value = false;
  }
};

// 清空聊天记录
const clearHistory = async () => {
  ElMessageBox.confirm("确认清空吗", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const res = await clearChat();
    if (res.code == 0) {
      ElNotification({
        offset: 60,
        title: "提示",
        duration: 3000,
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "聊天记录已清空"),
      });
      messageList.value = [];
      canLoadMore.value = false;
    }
  });
};

// 强制下线用户
const offlineUser = (user_id, nick_name) => {
  ElMessageBox.confirm(`确认强制下线${nick_name}吗`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(() => {
    websocket &&
      websocket.send(
        JSON.stringify({
          type: "offline",
          user_id: user_id,
        })
      );
  });
};

const scrollToBottom = () => {
  chatContainerRef.value &&
    chatContainerRef.value.scrollTo({
      top: chatContainerRef.value.scrollHeight,
      behavior: "smooth",
    });
};

const selectIcon = (val) => {
  const text = val;
  if (currentIndex.value == inputChatRef.value.innerHTML.length) {
    inputChatRef.value.innerHTML += `${text}`;
  } else {
    // 拼接表情
    let input = inputChatRef.value.innerHTML;
    let start = input.slice(0, currentIndex.value);
    let end = input.slice(currentIndex.value);
    inputChatRef.value.innerHTML = start + `${text}` + end;
  }
  // 每次拼接完就加一下下标 一个表情的长度是两个字节
  currentIndex.value += 2;
};

const afterEnterRoom = () => {
  newMessageCount.value = 0;
  nextTick(() => {
    scrollToBottom();
  });
};

const afterLeaveRoom = () => {
  newMessageCount.value = 0;
};

const keepIndex = () => {
  currentIndex.value = getCurrentIndex();
};

function getCurrentIndex() {
  var range;
  if (window.getSelection) {
    //ie11 10 9 ff safari
    range = window.getSelection(); //创建range
    return range.focusOffset;
  } else if (document.selection) {
    range = document.selection.createRange(); //创建选择对象
    return range.focusOffset;
  }
}
const handleChange = async (uploadFile) => {
  imageUploading.value = true;
  const img = await imgUpload(uploadFile);
  if (img.code == 0) {
    const { url } = img.result;
    yourImageUrl.value = url;
    messageType.value = "image";
    wsSend();
    imageUploading.value = false;
  }
};

const revertOneChat = async (id) => {
  if (!id) return;
  const res = await deleteOneChat(id);
  if (res.code == 0) {
    let index = messageList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      messageList.value.splice(index, 1);
    }
    // websocket 发送撤回消息的信息 通知其他用户撤回消息
    websocket.send(
      JSON.stringify({
        type: "revert",
        message_id: id,
      })
    );
    ElNotification({
      offset: 60,
      title: "提示",
      duration: 3000,
      message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "撤回成功"),
    });
  }
};

const clearWebsocket = () => {
  websocket && websocket.close();
  websocket = null;
  clearInterval(heartBreak);
  heartBreak = null;
};

watch(
  () => getUserInfo.value.id,
  async () => {
    await initWebsocket();
    hasLoaded.value = true;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  getMessageList();
});

onBeforeUnmount(() => {
  clearWebsocket();
});
</script>

<template>
  <div>
    <el-popover
      :visible="chatVisible"
      placement="bottom-start"
      :width="isPc ? '580' : '380'"
      trigger="contextmenu"
      @after-leave="afterLeaveRoom"
      @after-enter="afterEnterRoom"
      style="z-index: 1000"
    >
      <template #reference>
        <div @click="chatVisible = true" class="blog-chat-btn grid place-items-center">
          <i v-if="!newMessageCount" class="iconfont icon-pinglun"></i>
          <el-badge v-else :value="newMessageCount" :max="9">
            <i class="iconfont icon-pinglun"></i>
          </el-badge>
        </div>
      </template>
      <div class="chat-room" @click="newMessageCount = 0">
        <el-card class="chat-card">
          <div class="chat-bg">
            <div class="chat-header box-shadow flex items-center justify-between">
              <div class="left">
                小张的聊天室
                <span v-if="isConnecting" class="!ml-[10px] text-sm online-total">连接中...</span>
                <span v-else class="!ml-[10px] text-sm online-total"
                  >在线人数 {{ onlineList.length || 0 }} 人</span
                >
              </div>
              <div class="right flex items-center">
                <el-popover style="padding: 0" placement="bottom" :width="200" trigger="click">
                  <template #reference>
                    <i class="iconfont icon-gerenzhongxin text-md"></i>
                  </template>
                  <div class="!min-h-[300px] overflow-auto">
                    <div class="!p-[10px]">
                      <div
                        v-for="user in onlineList"
                        :key="user.user_id"
                        class="flex items-center box-shadow !py-[3px] !mb-[5px]"
                      >
                        <el-avatar
                          :size="32"
                          class="!mr-[10px] min-w-[32px] min-h-[32px]"
                          :src="user.avatar"
                        ></el-avatar>
                        <span class="!mr-[10px] nick-name">{{ user.nick_name }}</span>
                        <el-button
                          v-if="getUserInfo.role == 1 && user.user_id != getUserInfo.id"
                          type="danger"
                          size="small"
                          @click="offlineUser(user.user_id, user.nick_name)"
                        >
                          下线
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-popover>
                <el-button
                  v-if="getUserInfo.role == '1'"
                  type="danger"
                  size="small"
                  class="!ml-[10px]"
                  @click="clearHistory"
                >
                  清空记录
                </el-button>
                <el-button
                  v-if="!websocket && getUserInfo.id"
                  type="primary"
                  size="small"
                  class="!ml-[10px]"
                  :icon="Connection"
                  @click="reConnect"
                >
                  重连
                </el-button>
                <i
                  class="!ml-[10px] iconfont icon-off-search change-color"
                  @click="chatVisible = false"
                ></i>
              </div>
            </div>
            <div id="root" class="chat-container" ref="chatContainerRef">
              <div class="observe" v-if="canLoadMore" @click="getMessageList">
                点击加载更多消息
                <Loading v-if="loadingMessage" :size="16" />
              </div>
              <div v-if="!messageList.length" class="empty">还等什么 赶快聊起来吧</div>
              <div v-else class="message-item" v-for="message in messageList" :key="message.id">
                <div v-if="message.user_id == getUserInfo.id" class="flex items-start justify-end">
                  <div class="flex flex-col justify-start items-end">
                    <div class="user-info text-right !mb-[5px]">
                      <span class="user-name">{{ message.nick_name }}</span>
                    </div>
                    <el-dropdown :trigger="isPc ? 'contextmenu' : 'click'" placement="bottom-start">
                      <div
                        v-if="message.content_type == 'text'"
                        class="message-content"
                        v-html="message.content"
                      ></div>
                      <div v-else class="message-image" v-image="message.content">
                        <div class="!w-[100%] !h-[100%] rounded-md overflow-hidden">
                          <el-image
                            class="!w-[100%] !h-[100%]"
                            :src="message.content"
                            fit="cover"
                            :preview-src-list="[message.content]"
                            preview-teleported
                          >
                            <template #error>
                              <div class="image-error !w-[100%] !h-[100%] grid place-items-center">
                                <svg-icon name="image404" :width="4" :height="4"></svg-icon>
                              </div>
                            </template>
                          </el-image>
                        </div>
                        <span
                          v-if="
                            !isPc &&
                            getUserInfo.id &&
                            (getUserInfo.id === message.user_id || getUserInfo.role == 1)
                          "
                          class="revert"
                        ></span>
                      </div>
                      <template #dropdown>
                        <el-dropdown-item
                          v-if="
                            getUserInfo.id &&
                            (getUserInfo.role == 1 || getUserInfo.id == message.user_id)
                          "
                          @click="revertOneChat(message.id)"
                          >撤回</el-dropdown-item
                        >
                      </template>
                    </el-dropdown>
                  </div>
                  <el-avatar class="!ml-[10px] min-w-[32px] min-h-[32px]" :src="message.avatar">{{
                    message.nick_name
                  }}</el-avatar>
                </div>
                <div v-else class="flex items-start justify-start">
                  <el-avatar class="!mr-[10px] min-w-[32px] min-h-[32px]" :src="message.avatar">{{
                    message.nick_name
                  }}</el-avatar>
                  <div class="flex flex-col justify-start items-start">
                    <div class="user-info text-left !mb-[5px]">
                      <span class="user-name">{{ message.nick_name }}</span>
                    </div>
                    <el-dropdown trigger="contextmenu" placement="bottom-start">
                      <div
                        v-if="message.content_type == 'text'"
                        class="message-content"
                        v-html="message.content"
                      ></div>
                      <div v-else class="message-image" v-image="message.content">
                        <div class="!w-[100%] !h-[100%] rounded-md overflow-hidden">
                          <el-image
                            class="!w-[100%] !h-[100%]"
                            :src="message.content"
                            fit="cover"
                            :preview-src-list="[message.content]"
                            preview-teleported
                          >
                            <template #error>
                              <div class="image-error !w-[100%] !h-[100%] grid place-items-center">
                                <svg-icon name="image404" :width="4" :height="4"></svg-icon>
                              </div>
                            </template>
                          </el-image>
                        </div>
                        <span
                          v-if="
                            !isPc &&
                            getUserInfo.id &&
                            (getUserInfo.id === message.user_id || getUserInfo.role == 1)
                          "
                          class="revert"
                        ></span>
                      </div>
                      <template #dropdown>
                        <el-dropdown-item
                          v-if="
                            getUserInfo.id &&
                            (getUserInfo.role == 1 || getUserInfo.id == message.user_id)
                          "
                          :trigger="isPc ? 'contextmenu' : 'click'"
                          @click="revertOneChat(message.id)"
                          >撤回</el-dropdown-item
                        >
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
            <div class="send-container">
              <div class="!mt-[8px] !mr-[5px]">
                <IconList @select-icon="selectIcon" />
              </div>
              <div class="!mt-[10px] !mr-[5px]" v-if="getUserInfo.id">
                <el-upload
                  ref="imageUpload"
                  :auto-upload="false"
                  :limit="1"
                  :on-change="handleChange"
                  :show-file-list="false"
                  :disabled="imageUploading"
                >
                  <Loading v-if="imageUploading" :size="18" />
                  <el-icon v-else style="font-size: 18px"><UploadFilled /></el-icon>
                </el-upload>
              </div>
              <div
                class="send-content"
                ref="inputChatRef"
                contenteditable="true"
                @click="keepIndex"
                @blur="keepIndex"
                placeholder="快来聊天吧"
              ></div>
              <span class="send-btn" @click="sendMessage">发送</span>
            </div>
          </div>
        </el-card>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.blog-chat-btn {
  position: fixed;
  right: 0px;
  bottom: 120px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  color: var(--font-color);
  transition: all 0.3s;
  .icon-pinglun {
    font-size: 2.8rem;
    transform: rotateY(180deg);
  }
}

.chat-room {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  .chat-card {
    width: 100%;
    height: 100%;

    .chat-bg {
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 8px;
    }

    :deep(.el-card__body) {
      height: 100%;
    }

    .chat-header {
      padding: 2px 8px;
      height: 36px;
      font-size: 16px;
      font-weight: 600;

      .online-total {
        color: var(--font-color);
      }
    }

    .chat-container {
      width: 100%;
      height: 380px;
      padding: 20px;
      overflow: auto;

      .message-item {
        min-height: 36px;
        margin-bottom: 10px;

        .message-content {
          display: inline-block;
          word-break: break-all;
          padding: 8px;
          border-radius: 8px;
          background: var(--global-white);
        }

        .message-image {
          position: relative;
          width: 100px;
          height: 80px;
          border-radius: 8px;
          display: grid;
          place-items: center;

          .revert {
            position: absolute;
            bottom: -0;
            left: 0;
            display: inline-block;
            width: 100%;
            height: 15px;
            cursor: pointer;
          }
        }

        .image-error {
          border: 1px solid var(--font-color);
        }
      }
    }

    .send-container {
      width: 100%;
      min-height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 2px 8px;

      .send-content {
        width: 100%;
        max-height: 100px;
        overflow: auto;
        background-color: var(--global-shadow-white);
        border-radius: 8px;
        padding: 8px;
        box-sizing: border-box;
        color: var(--font-color);
        font-size: 1.2rem;
        font-weight: 700;
        transition: all 0.3s;
        box-shadow: 0 3px 6px 3px rgba(7, 17, 27, 0.06);
        &:hover {
          box-shadow: 0 3px 6px 3px rgba(7, 17, 27, 0.15);
        }
      }

      .send-content:empty::before {
        content: attr(placeholder);
        font-size: 14px;
        color: var(--comment-grey);
        font-weight: 700;
      }

      .send-btn {
        margin-left: 5px;
        width: 100px;
        text-align: center;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
        border-radius: 8px;
        background-image: var(--button-linear-gradient);
        box-shadow: 0 3px 6px 3px rgba(7, 17, 27, 0.06);
        color: var(--global-white);
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          box-shadow: 0 3px 6px 3px rgba(7, 17, 27, 0.15);
        }
      }
    }
  }
}

.nick-name {
  display: inline-block;
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.change-color:hover {
  cursor: pointer;
  color: var(--music-main-active);
}

.observe {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: var(--primary);
  letter-spacing: 1px;
  cursor: pointer;
}

.empty {
  display: grid;
  place-items: center;
  height: 100%;
  font-size: 16px;
  font-weight: 700;
}

.box-shadow {
  box-shadow:
    0 1px 0 hsl(240 calc(1 * 7.7%) 2.5% / 0.1),
    0 1.5px 0 hsl(0 calc(1 * 0%) 0.8% / 0.025),
    0 2px 0 hsl(240 calc(1 * 7.7%) 2.5% / 0.025);
}

:deep(.el-badge__content.is-fixed) {
  top: -2px;
  right: 50px;
}

// mobile
@media screen and (max-width: 768px) {
  .send-btn {
    width: 80px !important;
  }

  .blog-chat-btn {
    right: 0px;
    bottom: 100px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
}
</style>
