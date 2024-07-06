<script setup>
import { ref, onMounted, h, watch } from "vue";
import { user } from "@/store/index";

import { addComment, frontGetCommentTotal } from "@/api/comment";
import { getCurrentType } from "./tool";

import ParentItem from "./item/ParentItem.vue";
import CommentInput from "./item/CommentInput.vue";
import { ElNotification } from "element-plus";
import { numberFormate } from "@/utils/tool";

const emits = defineEmits(["refresh"]);

const userStore = user();
const props = defineProps({
  // 评论的类型 文章 article 说说 talk
  type: {
    type: String,
    default: () => {},
  },
  // 文章/说说 id
  id: {
    type: Number,
    default: () => {},
  },
  authorId: {
    type: Number,
    default: () => {},
  },
  expand: {
    type: Boolean,
    default: false,
  },
  isShowToggle: {
    type: Boolean,
    default: true,
  },
});
const activeOrder = ref("hot"); // 排序 最新还是最热 最热 hot

const total = ref(0); // 评论条数

const parentItemRef = ref(null); // 子组件ref

const isExpand = ref(false); // 评论是否展开 true展开 false关闭

const showPublish = ref(false);

const commentInputRef = ref(); // 评论框ref

const commentText = ref(""); // 评论框内容

const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};

const changeOrder = (type) => {
  activeOrder.value = type;
};

const toLogin = () => {
  if (userStore.getUserInfo.id) return;
  userStore.setShowLogin(true);
};

const publish = async () => {
  if (!userStore.getUserInfo.id) {
    ElNotification({
      offset: 60,
      title: "温馨提示",
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请先登录"),
    });
    return;
  }
  const data = {
    from_id: userStore.getUserInfo.id, // 谁发的
    from_avatar: userStore.getUserInfo.avatar, // 头像
    from_name: userStore.getUserInfo.nick_name, // 用户名
    content: commentText.value, // 内容
    for_id: props.id, // 是那一篇文章/说说的评论
    type: 0, // 判断是文章还是啥 下面switch判断
    author_id: props.authorId, // 作者的id 用于消息推送
  };
  switch (props.type) {
    // 文章
    case "article":
      data.type = 1;
      break;
    // 说说
    case "talk":
      data.type = 2;
      break;
    // 留言
    case "message":
      data.type = 3;
      break;
  }

  const res = await addComment(data);
  if (res.code == 0) {
    commentText.value = "";
    ElNotification({
      offset: 60,
      title: "提示",
      message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "评论成功"),
    });
    parentItemRef.value && parentItemRef.value.getComment("clear");
    isExpand.value = true;
    showPublish.value = false;
    if (commentInputRef.value) {
      commentInputRef.value.clear();
    }
    refresh();
  } else {
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
    });
  }
};

// 获取评论条数
const getTotal = (val) => {
  total.value = val;
};

// 在初始化的时候获取主评论条数
const getCommentTotal = async () => {
  const res = await frontGetCommentTotal({
    type: getCurrentType(props.type),
    for_id: props.id,
  });
  if (res && res.code == 0) {
    const total = res.result;
    getTotal(total - 0);
  } else {
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
    });
  }
};

const refresh = () => {
  getCommentTotal();
  emits("refresh");
};

watch(
  () => props.expand,
  (newV) => {
    isExpand.value = newV;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  getCommentTotal();
});

defineExpose({
  toggleExpand,
});
</script>

<template>
  <div class="comment">
    <div class="comment-header">
      <div class="flex justify-start items-center">
        <span v-if="total" class="total-value" @click="toggleExpand">
          评论 {{ numberFormate(total) }}
        </span>
        <div v-if="total && isExpand" class="flex items-center">
          <span
            :class="['comment-tab', activeOrder == 'hot' ? 'active-order' : '']"
            @click="changeOrder('hot')"
            >最热</span
          >
          <span class="comment-tab">|</span>
          <span
            :class="['comment-tab', activeOrder == 'new' ? 'active-order' : '']"
            @click="changeOrder('new')"
            >最新</span
          >
        </div>
      </div>
      <template v-if="isShowToggle">
        <span v-if="total" class="more" @click="toggleExpand">
          {{ isExpand ? "收起" : "查看更多" }}</span
        >
        <span v-else class="more" @click="toggleExpand">
          {{ isExpand ? "取消发布" : "求评论呀~" }}
        </span>
      </template>
      <template v-else-if="!isShowToggle && isExpand">
        <span v-if="total" class="more" @click="toggleExpand"> 收起</span>
        <span v-else class="more" @click="toggleExpand"> 取消发布 </span>
      </template>
    </div>
    <div v-if="isExpand">
      <div id="commentInput" class="!mt-[1rem] w-[100%] flex justify-start items-start">
        <div class="avatar-box">
          <el-avatar class="avatar" :src="userStore.getUserInfo.avatar" @click="toLogin">{{
            userStore.getUserInfo.nick_name || "登录"
          }}</el-avatar>
        </div>
        <div class="!w-[100%] !ml-[10px]">
          <CommentInput
            ref="commentInputRef"
            v-model:inputText="commentText"
            :show-publish-button="false"
            :parent="true"
            @publish="publish"
          />
        </div>
      </div>
      <!-- 评论组件 这里采用了父级评论和子级评论嵌套的方式 -->
      <div class="comment-list">
        <ParentItem
          v-if="isExpand"
          ref="parentItemRef"
          :active="activeOrder"
          :type="type"
          :id="id"
          :author-id="authorId"
          @refresh="refresh"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  width: 100%;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .total {
      &-value {
        cursor: pointer;
        font-size: 0.8rem;
      }
    }

    .comment-tab {
      cursor: pointer;
      margin-left: 0.8rem;
      font-size: 0.8rem;

      &:hover {
        color: var(--primary);
      }
    }
  }
}

.active-order {
  color: var(--primary) !important;
}

.avatar {
  cursor: pointer;
}

.more {
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--font-color);
  &:hover {
    color: var(--primary);
  }
}

// pc
@media screen and (min-width: 768px) {
  .avatar-box {
    width: 45px;
    height: 45px;
  }
  .avatar {
    width: 45px;
    height: 45px;
  }

  .input-text {
    width: 100%;
    background-color: var(--global-shadow-white);
    border-radius: 8px;
    padding: 8px;
    min-height: 80px;
    box-sizing: border-box;
  }

  .publish-btn {
    background-color: var(--primary);
    font-size: 1rem;
    height: 2rem;
    width: 5rem;
    padding: 0 1rem;
  }
}
// mobile
@media screen and (max-width: 768px) {
  .avatar-box {
    width: 32px;
    height: 32px;
  }
  .avatar {
    width: 32px;
    height: 32px;
  }

  .input-text {
    width: 100%;
    background-color: var(--global-shadow-white);
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
  }

  .publish-btn {
    background-color: var(--primary);
    font-size: 0.8rem;
    height: 1.4rem;
    width: 3rem;
    padding: 0 1rem;
  }
}
</style>
