<!--
* @Author: Zhang Yuming
* @Date: 2023-08-08 10:59:19
* @Description: 留言详情页
-->
<script setup>
import { reactive, onMounted, h, ref } from "vue";
import { storeToRefs } from "pinia";

import { returnTime, _getLocalItem, _setLocalItem, containHTML } from "@/utils/tool";
import { addLike, cancelLike } from "@/api/like";
import { user } from "@/store/index";

import { ElNotification } from "element-plus";
import PageHeader from "@/components/PageHeader";

const userStore = user();
const { getUserInfo } = storeToRefs(userStore);

const message = reactive({
  id: 0,
  message: "",
  color: "",
  font_size: 16,
  font_weight: 500,
  bg_color: "",
  bg_url: "",
  user_id: 0,
  tag: "",
  like_times: 0,
  nick_name: "",
  avatar: "",
  is_like: false,
});

const likePending = ref(false);

const like = async (item) => {
  if (likePending.value) return;
  likePending.value = true;
  // 取消点赞
  if (item.is_like) {
    // 记录留言取消点赞
    const res = await cancelLike({ for_id: item.id, type: 3, user_id: getUserInfo.value.id });
    if (res.code == 0) {
      item.like_times--;
      item.is_like = false;
      likePending.value = false;

      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "已取消点赞"),
      });
    }
  }
  // 点赞
  else {
    // 记录留言点赞
    const res = await addLike({ for_id: item.id, type: 3, user_id: getUserInfo.value.id });
    if (res.code == 0) {
      item.like_times++;
      item.is_like = true;
      likePending.value = false;

      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "点赞成功"),
      });
    }
  }
  _setLocalItem("message-refresh", true);
  _setLocalItem("blog-message-item", item);
};

const commentRefresh = () => {
  _setLocalItem("message-refresh", true);
};

onMounted(() => {
  const item = _getLocalItem("blog-message-item");
  if (item) {
    Object.assign(message, item);
  }
});
</script>
<template>
  <PageHeader>
    <template #route> 留言详情 </template>
  </PageHeader>
  <div class="message">
    <div class="center_box">
      <el-card>
        <div
          :style="{ backgroundColor: message.bg_color }"
          class="message-card animate__animated animate__fadeIn"
        >
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
            </div>
            <div
              class="content"
              v-if="containHTML(message.message)"
              v-html="message.message"
              :style="{
                color: message.color,
                fontSize: message.font_size + 'px',
                fontWeight: message.font_weight,
              }"
            ></div>
            <div
              class="content"
              v-else
              :style="{
                color: message.color,
                fontSize: message.font_size + 'px',
                fontWeight: message.font_weight,
              }"
            >
              {{ message.message }}
            </div>
            <div class="bottom">
              <div class="left flex items-center">
                <div class="time">{{ returnTime(message.createdAt) }}前</div>
                <div class="index-tag">#{{ message.tag }}</div>
              </div>
              <div class="flex justify-start items-center option">
                <svg-icon
                  :name="message.is_like ? 'redHeart' : 'greyHeart'"
                  :width="1.5"
                  @click="like(message, index)"
                ></svg-icon>
                <span :style="{ color: message.is_like ? '#f00' : '' }" class="!ml-[5px]">{{
                  message.like_times || 0
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <Comment
        v-if="message.id"
        class="w-[100%] !mt-[1rem]"
        type="message"
        :expand="true"
        :id="message.id"
        :author-id="message.user_id"
        @refresh="commentRefresh"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  .nick-name {
    color: var(--global-white);
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
    color: var(--global-white);
    letter-spacing: 1px;
    margin-right: 10px;
  }
}
.message-card {
  height: 22rem;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.content {
  word-break: break-all;
  height: 15rem;
  overflow: auto;
}

.top {
  height: 22rem;
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

.top-header {
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.index-tag {
  color: var(--global-white);
  font-size: 12px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  padding: 8px;
}
.option {
  color: var(--global-white);
  padding: 1px 5px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

.center_box {
  min-height: calc(100vh - 128px);
}

// pc
@media screen and (min-width: 768px) {
  .center_box {
    max-width: 600px !important;
  }
  .canter-top {
    .left-avatar {
      width: 48px;
      height: 48px;
    }
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
}
</style>
