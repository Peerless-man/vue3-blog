<script setup name="Message">
import { ref, reactive, onMounted, onBeforeUnmount, h, onActivated, nextTick } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { Edit, Delete, Search } from "@element-plus/icons-vue";
import { ElNotification, ElMessageBox } from "element-plus";

import TypeWriter from "@/components/TypeWriter/type-writer";
import { gsapTransXScale } from "@/utils/transform";

import {
  getMessageList,
  likeMessage,
  cancelLikeMessage,
  deleteMessage,
  getMessageTag,
} from "@/api/message";

import { addLike, cancelLike } from "@/api/like";
import svgIcon from "@/components/SvgIcon/index.vue";
import {
  returnTime,
  _setLocalItem,
  containHTML,
  filterMessage,
  _getLocalItem,
  _removeLocalItem,
} from "@/utils/tool";
import { user } from "@/store/index";

const router = useRouter();
const userStore = user();
const { getUserInfo } = storeToRefs(userStore);
const messageList = ref([]);
const total = ref(0);
const loading = ref(false);
let observe;
let box;
const param = reactive({
  current: 1,
  size: 8,
  tag: "",
  message: "",
  user_id: getUserInfo.value.id,
});
const primaryParam = reactive({ ...param });
const activeTab = ref(0);
const tabList = ref([]);
const showSearch = ref(false);
const searchTag = ref("");

const changeTab = (key, label) => {
  activeTab.value = key;
  param.tag = label;
  searchTag.value = "";
  if (label == "全部") {
    param.tag = "";
  }
  param.current = 1;

  pageGetMessageList();
};

const observeBox = () => {
  // 获取要监听的元素
  box = document.querySelector(".observer");
  observe = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (e) => {
        if (e.isIntersecting && e.intersectionRatio > 0) {
          if (total.value > messageList.value.length && !loading.value) {
            param.current++;
            pageGetMessageList();
          }
        }
      });
    },
    { rootMargin: "0px 0px 300px 0px" }
  );
  box && observe.observe(box);
};

const pageGetMessageList = async () => {
  if (param.current == 1) {
    loading.value = true;
  }
  let res = await getMessageList(param);
  if (res.code == 0) {
    const { list } = res.result;
    messageList.value =
      param.current == 1 ? res.result.list : messageList.value.concat(res.result.list);
    let classList = res.result.list.map((item, index) => {
      return ".message" + (messageList.value.length - list.length + index);
    });
    total.value = res.result.total;
    if (messageList.value.length < total.value) {
      observeBox();
    } else {
      observe && observe.unobserve(box);
      observe = null;
    }
    nextTick(() => {
      gsapTransXScale(classList, 0, 1.2);
    });
  }
  loading.value = false;
};

const like = async (item, index) => {
  // 取消点赞
  if (item.is_like) {
    const res = await cancelLikeMessage(item.id);
    if (res.code == 0) {
      // 记录留言取消点赞
      if (getUserInfo.value.id) {
        await cancelLike({ for_id: item.id, type: 3, user_id: getUserInfo.value.id });
      }
      messageList.value[index].like_times--;
      messageList.value[index].is_like = false;
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "已取消点赞"),
      });
    }
  }
  // 点赞
  else {
    const res = await likeMessage(item.id);
    if (res.code == 0) {
      // 记录留言点赞
      if (getUserInfo.value.id) {
        await addLike({ for_id: item.id, type: 3, user_id: getUserInfo.value.id });
      }
      messageList.value[index].like_times++;
      messageList.value[index].is_like = true;
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "点赞成功"),
      });
    }
  }
};

const comment = (item) => {
  if (item) {
    _setLocalItem("blog-message-item", item);
  }
  router.push({ path: "/message/detail" });
};

const handleEditMessage = (item) => {
  if (item) {
    _setLocalItem("blog-message-item", item);
  }
  router.push({ path: "/message/publish", query: { type: "edit" } });
};

const addMessage = () => {
  router.push({ path: "/message/publish", query: { type: "add" } });
};

const handleDeleteMessage = (item) => {
  ElMessageBox.confirm("确认删除留言吗", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const res = await deleteMessage(item.id);
    if (res && res.code == 0) {
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "删除成功"),
      });
      observe && observe.unobserve(box);
      observe = null;
      param.current = 1;
      pageGetMessageList();
    } else {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
      });
    }
  });
};

const getHotMessageTag = async () => {
  tabList.value = [];
  const res = await getMessageTag();
  if (res.code == 0) {
    tabList.value = Array.isArray(res.result)
      ? res.result.map((v, i) => {
          return {
            key: i + 1,
            label: v.tag,
          };
        })
      : [];

    tabList.value.unshift({ key: 0, label: "全部" });
  }
};
const mouseDown = () => {
  showSearch.value = true;
};

const mouseLeave = () => {
  showSearch.value = false;
};

const changeSearch = (val) => {
  param.message = val;
  pageGetMessageList();
};

onMounted(async () => {
  _removeLocalItem("message-refresh");
  await getHotMessageTag();
  await pageGetMessageList();
});

onActivated(async () => {
  if (_getLocalItem("message-refresh")) {
    Object.assign(param, primaryParam);
    await getHotMessageTag();
    await pageGetMessageList();
    _removeLocalItem("message-refresh");
  }

  if (_getLocalItem("message-need-scroll")) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    _removeLocalItem("message-need-scroll");
  }
});

onBeforeUnmount(() => {
  observe && observe.unobserve(box);
  observe = null;
});
</script>

<template>
  <div class="message !min-h-[60vh]">
    <div class="publish-pc">
      <el-popover placement="top-start" :width="110" trigger="hover" content="点我去发表留言">
        <template #reference>
          <svg-icon name="publish" :width="4" :height="4" @click="addMessage"></svg-icon>
        </template>
      </el-popover>
    </div>
    <div class="publish-mobile">
      <el-popover placement="top-start" :width="110" trigger="hover" content="点我去发表留言">
        <template #reference>
          <svg-icon name="publish" :width="3" :height="3" @click="addMessage"></svg-icon>
        </template>
      </el-popover>
    </div>
    <div class="message-header">
      <div class="message-title">留言板</div>
      <div class="flex items-center !h-[5rem]">
        <TypeWriter size="1.2rem" :typeList="['生活原本沉闷，但跑起来就会有风!']"></TypeWriter>
      </div>
    </div>
    <div class="message-body center_box">
      <div class="search-tab" @mousedown="mouseDown" @mouseleave="mouseLeave">
        <ul class="tab">
          <li v-for="item in tabList" :key="item.key" @click="changeTab(item.key, item.label)">
            <div :class="[item.key == activeTab ? 'active-tab' : '', 'tab-li']">
              {{ item.label }}
            </div>
          </li>
          <Transition
            :duration="{ enter: 0, leave: 500 }"
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
          >
            <div v-if="showSearch" class="flex justify-center items-center">
              <el-input
                :prefix-icon="Search"
                class="search"
                v-model="searchTag"
                placeholder="搜索留言内容"
                @change="changeSearch"
                clearable
              ></el-input>
            </div>
          </Transition>
        </ul>
      </div>
      <el-skeleton :loading="loading" style="height: 100%" animated>
        <template #template>
          <div class="loading">
            <div class="coffee_cup"></div>
          </div>
        </template>
        <el-row class="row-height" :gutter="16">
          <el-col
            :class="'message' + index"
            :xs="24"
            :sm="12"
            v-for="(message, index) in messageList"
            :key="index"
          >
            <el-card class="card-hover">
              <div
                :style="{ backgroundColor: message.bg_color }"
                class="message-card animate__animated animate__fadeIn"
              >
                <div class="img-loading" v-if="message.bg_url" v-image="message.bg_url"></div>
                <div
                  class="top"
                  :style="{ backgroundImage: message.bg_url ? `url(${message.bg_url})` : '' }"
                >
                  <div class="top-header">
                    <div class="flex items-center">
                      <el-avatar class="left-avatar" :src="message.avatar"
                        >{{ message.nick_name }}
                      </el-avatar>
                      <span class="nick-name"> {{ message.nick_name }}</span>
                    </div>
                    <div
                      class="flex items-center cursor-pointer option-top"
                      v-if="
                        (getUserInfo.id && getUserInfo.id == message.user_id) ||
                        getUserInfo.role == 1
                      "
                    >
                      <el-icon @click="handleEditMessage(message)"><Edit /></el-icon>
                      <el-icon class="!ml-[10px]" @click="handleDeleteMessage(message)"
                        ><Delete
                      /></el-icon>
                    </div>
                  </div>
                  <div
                    v-if="containHTML(filterMessage(message.message))"
                    v-html="filterMessage(message.message)"
                    :style="{
                      color: message.color,
                      fontSize: message.font_size + 'px',
                      fontWeight: message.font_weight,
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      color: message.color,
                      fontSize: message.font_size + 'px',
                      fontWeight: message.font_weight,
                    }"
                  >
                    {{ message.message }}
                  </div>
                </div>
                <div class="bottom">
                  <div class="left flex items-center">
                    <div class="time">{{ returnTime(message.createdAt) }}前</div>
                    <div
                      class="message-comment cursor-pointer !mr-[10px]"
                      @click="comment(message)"
                    >
                      <span>评论</span>
                      <span class="!ml-[5px]">{{ message.comment_total }}</span>
                    </div>
                    <div class="index-tag">#{{ message.tag }}</div>
                  </div>
                  <div class="flex justify-start items-center option">
                    <div
                      class="cursor-pointer scale flex items-center"
                      @click="like(message, index)"
                    >
                      <svg-icon
                        :name="message.is_like ? 'redHeart' : 'greyHeart'"
                        :width="1.5"
                      ></svg-icon>
                      <span :style="{ color: message.is_like ? '#f00' : '' }" class="!ml-[5px]">{{
                        message.like_times || 0
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-skeleton>
      <div class="observer">
        {{
          total == 0
            ? "这片土地需要你来开辟"
            : messageList.length >= total
            ? "已经到底了~"
            : "加载中~"
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  .row-height {
    min-height: 22rem;
    transition: height 0.8s;
  }
  &-header {
    padding-top: 130px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .message-title {
    font-size: 2.4rem;
    font-weight: 600;
    color: #000;
  }
  .type-writer {
    color: #000;
  }

  .space {
    color: #000;
  }

  &-body {
    min-height: 35rem;
    .search-tab {
      width: 100%;
      min-height: 3rem;
      background-color: rgba(0, 0, 0, 0.2);
      margin-bottom: 1rem;
      border-radius: 2rem;
    }
    .tab {
      width: 100%;
      min-height: 3rem;
      padding: 0.5rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      flex-wrap: wrap;
      font-size: 1.2rem;
      font-weight: 600;

      li {
        margin-right: 1rem;
      }

      .tab-li {
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        padding: 0 0.6rem;
        border-radius: 1rem;
      }
      .active-tab {
        color: #fff;
        background-color: var(--primary);
      }
    }

    .message-card {
      position: relative;
      height: 22rem;
    }

    .img-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 5rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .nick-name {
      color: #fff;
      margin-left: 1rem;
      letter-spacing: 1px;
      padding: 3px 8px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }

    .left {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 3px 8px;
    }

    .time {
      font-size: 12px;
      color: #fff;
      letter-spacing: 1px;
      margin-right: 10px;
    }

    .message-comment {
      font-size: 12px;
      color: #fff;
      letter-spacing: 1px;
      padding: 3px 8px;
    }

    .option-top {
      color: #fff;
      padding: 3px 8px;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.2);
    }

    .option {
      color: #fff;
      padding: 1px 8px;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.2);
    }
    .top-header {
      height: 4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .top {
      height: 19rem;
      padding: 8px;
      overflow: auto;
      white-space: pre-line;
      scrollbar-width: none;
      -ms-overflow-style: none;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .index-tag {
      font-size: 12px;
      color: #fff;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3rem;
      padding: 8px;
    }
  }

  .apply-tag {
    text-align: center;
    color: var(--font-color);
    font-size: 16px;
  }
}
.observer {
  text-align: center;
  font-size: 1.2rem;
  color: var(--font-color);
  margin-top: 30px;
  letter-spacing: 1px;
}
.btn {
  margin-left: 3px;
  color: var(--primary);
  cursor: pointer;
}

.scale {
  transition: all 0.3s;
}
.scale:hover {
  transform: scale(1.2);
}

.loading {
  width: 100%;
  height: 22rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

// pc
@media screen and (min-width: 768px) {
  .center-top {
    .left-avatar {
      width: 48px;
      height: 48px;
    }
  }

  .publish-pc {
    position: fixed;
    top: 150px;
    right: 50px;
    z-index: 3001;
    cursor: pointer;
    border: none;
  }

  .publish-mobile {
    display: none;
  }
}

.search {
  height: 28px;
  width: 220px;
  :deep(.el-input__wrapper) {
    border-radius: 20px;
  }
}

// mobile
@media screen and (max-width: 768px) {
  .center-top {
    .left-avatar {
      width: 40px;
      height: 40px;
    }
  }

  .publish-mobile {
    position: fixed;
    top: 150px;
    right: 10px;
    z-index: 3001;
    cursor: pointer;
    border: none;
  }

  .publish-pc {
    display: none;
  }
}
</style>
