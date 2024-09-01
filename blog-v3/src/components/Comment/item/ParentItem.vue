<script setup>
import { reactive, ref, watch, h } from "vue";
import { frontGetParentComment, applyComment, deleteComment } from "@/api/comment";
import TextOverflow from "@/components/TextOverflow/index.vue";
import ChildrenItem from "./ChildrenItem.vue";
import Loading from "@/components/Loading/Loading.vue";
import { user } from "@/store/index";
import { ElMessageBox, ElNotification } from "element-plus";
import { getCurrentType } from "../tool";
import { addLike, cancelLike } from "@/api/like";
import { containHTML } from "@/utils/tool";

const userStore = user();

const emits = defineEmits(["refresh"]);

const props = defineProps({
  active: {
    // 按最热/最新 排序
    type: String,
    default: "hot",
  },
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
  // 作者id
  authorId: {
    type: Number,
    default: () => {},
  },
});
const childrenRef = ref();
// 父级评论搜索参数
const params = reactive({
  current: 1,
  size: 5,
  type: 0,
  for_id: 0,
  order: "",
  user_id: userStore.getUserInfo.id,
  loading: false,
});
// 父级评论列表
const commentList = ref([]);
const commentTotal = ref(0);
const likePending = ref(false);
// 获取父级评论
const getComment = async (type) => {
  params.loading = true;
  if (type == "clear") {
    params.current = 1;
  }
  params.type = getCurrentType(props.type);
  const res = await frontGetParentComment(params);
  if (res && res.code == 0) {
    const { list, total } = res.result;
    list.forEach((l) => {
      l.showApplyInput = false;
    });
    commentList.value = params.current == 1 ? list : commentList.value.concat(list);
    commentTotal.value = total - 0;
  } else {
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
    });
  }
  params.loading = false;
};

// 加载更多的评论
const showMore = () => {
  params.current++;
  getComment();
};

const currentApplyIndex = ref(0);

// 点赞
const like = async (item, index) => {
  let res;
  if (likePending.value) return;
  likePending.value = true;
  // 查看点赞了没有，点赞了就进行取消点赞
  if (item.is_like) {
    res = await cancelLike({ for_id: item.id, type: 4, user_id: userStore.getUserInfo.id });
    if (res && res.code == 0) {
      commentList.value[index].is_like = false;
      commentList.value[index].thumbs_up--;
      likePending.value = false;

      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "已取消点赞"),
      });
    }
  } else {
    res = await addLike({ for_id: item.id, type: 4, user_id: userStore.getUserInfo.id });
    if (res && res.code == 0) {
      commentList.value[index].is_like = true;
      commentList.value[index].thumbs_up++;
      likePending.value = false;

      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "点赞成功"),
      });
    }
  }
};

const apply = (item, index) => {
  // 记录一下回复的是哪个主评论
  commentList.value[index].showApplyInput = true;
  currentApplyIndex.value = index;
  childrenRef.value[index].apply(item, "parent");
};

const close = (index) => {
  // 根据记录的主评论index来关闭那个主评论的输入框
  commentList.value[index].showApplyInput = false;
  currentApplyIndex.value = 0;
  childrenRef.value[index].closeComment();
};

const changeShowApplyInput = (val, index) => {
  commentList.value[index].showApplyInput = val;
};

// 关闭打开的输入框
const closeComment = () => {
  if (commentList.value.length) {
    childrenRef.value.forEach((v) => {
      v.closeComment();
    });
  }
};

const deleteOwnComment = (id) => {
  ElMessageBox.confirm("确认删除此条评论吗？子级评论也会被删除哦", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const res = await deleteComment(id);
    if (res && res.code == 0) {
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "删除成功"),
      });
      getComment("clear");
      emits("refresh");
    } else {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
      });
    }
  });
};

const publish = async (item) => {
  const data = {
    from_id: userStore.getUserInfo.id,
    from_avatar: userStore.getUserInfo.avatar,
    from_name: userStore.getUserInfo.nick_name,
    to_id: item.from_id,
    to_avatar: item.from_avatar,
    to_name: item.from_name,
    content: item.content,
    parent_id: item.parent_id,
    for_id: props.id,
    author_id: props.authorId,
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

  const res = await applyComment(data);
  if (res.code == 0) {
    ElNotification({
      offset: 60,
      title: "提示",
      message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "评论成功"),
    });
    params.current = 1;
    childrenRef.value[currentApplyIndex.value].getComment("clear");
    currentApplyIndex.value = 0;
    emits("refresh");
  } else {
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
    });
  }
};

watch(
  () => props.type,
  (newV) => {
    Object.assign(params, {
      for_id: props.id,
      type: newV,
      order: props.active,
    });
    getComment();
  },
  {
    immediate: true,
  }
);
watch(
  () => props.active,
  (newV) => {
    Object.assign(params, {
      order: newV,
      current: 1,
    });
    getComment();
  },
  {}
);

defineExpose({
  getComment,
  closeComment,
});
</script>

<template>
  <div class="comment-parent">
    <template v-if="commentList.length">
      <div
        class="!mt-[0.5rem] animate__animated animate__fadeIn"
        v-for="(comment, index) in commentList"
        :key="index"
      >
        <div class="flex justify-start items-start">
          <div class="avatar-box">
            <el-avatar class="avatar" :src="comment.from_avatar">{{ comment.from_name }}</el-avatar>
          </div>
          <div class="right !w-[100%]">
            <div class="cursor-pointer">
              {{ comment.from_name }}
              <span v-if="comment.from_id == 1" class="up">UP</span>
            </div>
            <div id="comment-content" class="!mt-[1rem]">
              <span v-if="containHTML(comment.content)" v-html="comment.content"></span>
              <TextOverflow
                v-else
                class="content"
                :key="comment.id"
                :text="comment.content"
                :maxLines="3"
                :font-size="16"
              >
                <template v-slot:default="{ clickToggle, expanded }">
                  <span @click="clickToggle" class="btn">
                    {{ expanded ? "收起" : "展开" }}
                  </span>
                </template>
              </TextOverflow>
            </div>
            <div class="!mt-[0.5rem]">
              <span class="!mr-[1rem] ip">{{ `IP: ${comment.ipAddress}` }}</span>
              <span
                :class="[
                  'thumbs',
                  '!mr-[1rem]',
                  'iconfont',
                  'icon-icon1',
                  comment.is_like ? 'like-active' : '',
                ]"
                @click="like(comment, index)"
              >
                <span class="!ml-[0.5rem]">{{ comment.thumbs_up }}</span>
              </span>
              <span class="!mr-[1rem] apply cursor-pointer" @click="apply(comment, index)"
                >回复</span
              >
              <span
                v-if="comment.showApplyInput"
                class="!mr-[1rem] close cursor-pointer"
                @click="close(index)"
                >关闭</span
              >
              <span
                class="!mr-[1rem] delete cursor-pointer"
                v-if="
                  userStore.getUserInfo.id == comment.from_id || userStore.getUserInfo.role == 1
                "
                @click="deleteOwnComment(comment.id)"
                >删除</span
              >
            </div>
            <div class="!mt-[0.5rem]">{{ comment.createdAt }}</div>
            <ChildrenItem
              class="!mt-[1.5rem]"
              ref="childrenRef"
              :type="props.type"
              :id="id"
              :parent_id="comment.id"
              :author-id="authorId"
              @parentApply="publish"
              @refresh="emits('refresh')"
              @changeShowApplyInput="(val) => changeShowApplyInput(val, index)"
            />
          </div>
        </div>
      </div>
    </template>

    <Loading :size="32" v-if="params.loading" />
    <div v-else-if="commentTotal > commentList.length" class="show-more" @click="showMore">
      展开更多
    </div>
    <div v-else class="h-[48px]"></div>
  </div>
</template>

<style lang="scss" scoped>
.comment-parent {
  width: 100%;
}

.active {
  color: var(--primary);
}
.icon-icon1 {
  cursor: pointer;
}
.thumbs {
  word-break: keep-all;
  font-size: 1rem;
}
.apply {
  word-break: keep-all;
  font-size: 1rem;
  color: var(--md-active);
}
.apply:hover {
  color: var(--primary);
}

.close {
  color: var(--top);
  word-break: keep-all;
  font-size: 1rem;
  &:hover {
    color: var(--hot-color);
  }
}

.content-apply {
  font-size: 0.8rem;
}

.delete {
  word-break: keep-all;
  font-size: 1rem;
  color: var(--top);

  &:hover {
    color: var(--hot-color);
  }
}

.ip {
  font-size: 0.8rem;
  display: inline-block;
}

.show-more {
  cursor: pointer;
  margin-top: 3px;
  font-size: 0.8rem;
  &:hover {
    color: var(--primary);
  }
}

.like-active {
  color: var(--primary);
  transform: scale(1.05);
}

.up {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--hot-color);
}

.btn {
  color: var(--primary);
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .right {
    margin-left: 10px;
  }

  .avatar-box {
    width: 32px;
    height: 32px;
  }
  .avatar {
    width: 32px;
    height: 32px;
  }
}

@media screen and (min-width: 768px) {
  .avatar-box {
    width: 45px;
    height: 45px;
  }
  .avatar {
    width: 45px;
    height: 45px;
  }
  .right {
    margin-left: 10px;
  }
}
</style>
