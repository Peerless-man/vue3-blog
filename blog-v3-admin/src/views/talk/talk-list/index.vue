<script setup lang="ts" name="TalkList">
import { ref, reactive, onMounted } from "vue";
import { ElCard, ElImage, ElMessageBox } from "element-plus";
import { useNav } from "@/layout/hooks/useNav";
import zhiding from "@/assets/svg/zhiding.svg?component";
import TextOverflow from "@/components/TextOverflow/index.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Plus from "@iconify-icons/ep/plus";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";

import {
  getTalkList,
  togglePublic,
  toggleTop,
  revertTalk,
  deleteTalkById
} from "@/api/talk";
import { message } from "@/utils/message";

const router = useRouter();
const { avatar, nickName } = useNav();

const param = reactive({
  current: 1,
  size: 5,
  status: 1
});
const talkList = ref([]);
const total = ref(0);
let observe;
const talkTab = [
  {
    key: 1,
    content: "公开说说",
    title: "公开说说"
  },
  {
    key: 2,
    content: "私密说说",
    title: "私密说说"
  },
  {
    key: 3,
    content: "回收站",
    title: "回收站"
  }
];

const tabChange = async (val: any) => {
  param.status = val.index ? Number(val.index) + 1 : null;
  param.current = 1;
  await pageGetTalkList();
  if (talkList.value.length < total.value) {
    observeTalkBottom();
  }
};

const pageGetTalkList = async (e?) => {
  const res = await getTalkList(param);
  if (res.code == 0) {
    talkList.value =
      param.current == 1
        ? res.result.list
        : talkList.value.concat(res.result.list);
    total.value = res.result.total;
    if (e && talkList.value.length >= total.value) {
      observe.unobserve(e.target); //停止监听
    }
  }
};

const toggleP = async (id, status) => {
  const res = await togglePublic(id, status == 1 ? 2 : 1);
  if (res.code == 0) {
    message(`${status == 1 ? "隐藏" : "公开"}说说成功`, { type: "success" });
    pageGetTalkList();
  }
};

const toggleT = async (id, is_top) => {
  const res = await toggleTop(id, is_top == 1 ? 2 : 1);
  if (res.code == 0) {
    message(`${is_top == 1 ? "取消置顶" : "置顶"}成功`, { type: "success" });
    pageGetTalkList();
  }
};

const revertT = async id => {
  const res = await revertTalk(id);
  if (res.code == 0) {
    message("恢复成功", { type: "success" });
    pageGetTalkList();
  }
};

const deleteT = async (id, status) => {
  const res = await deleteTalkById(id, status);
  if (res.code == 0) {
    message(`${status == 3 ? "彻底删除成功" : "说说已进入回收站"}`, {
      type: "success"
    });
    param.current = 1;
    pageGetTalkList();
  }
};

const handleCommand = async (command, talk) => {
  switch (command) {
    case "toggleTop":
      toggleT(talk.id, talk.is_top);
      break;
    case "togglePublic":
      toggleP(talk.id, talk.status);
      break;
    case "revert":
      revertT(talk.id);
      break;
    case "edit":
      edit(talk.id);
      break;
    case "delete":
      ElMessageBox.confirm(
        `${talk.status == 3 ? "确认删除" : "确认回收"}`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }
      ).then(() => {
        deleteT(talk.id, talk.status);
      });
      break;
    default:
      break;
  }
};

const publishTalk = () => {
  router.push("/talk/addTalk");
};

const edit = id => {
  router.push({
    path: "/talk/editTalk",
    query: {
      id: id
    }
  });
};

const returnTime = time => {
  time = time.replace(/-/g, "/"); // 解决ios系统上格式化时间出现NAN的bug
  const times = new Date().getTime() - new Date(time).getTime();
  let res;
  if (times < 6e4) {
    res = Math.trunc(times / 1000) + "秒";
  } else if (times >= 6e4 && times < 3.6e6) {
    res = Math.trunc(times / 6e4) + "分钟";
  } else if (times >= 3.6e6 && times < 8.64e7) {
    res = Math.trunc(times / 3.6e6) + "小时";
  } else {
    res = Math.trunc(times / 8.64e7) + "天";
  }
  return res;
};

const observeTalkBottom = () => {
  // 获取要监听的元素
  const box = document.querySelector(".observer");
  observe = new IntersectionObserver(
    entries => {
      entries.forEach(async e => {
        if (e.isIntersecting && e.intersectionRatio > 0) {
          param.current++;
          pageGetTalkList(e);
        }
      });
    },
    { threshold: [1] }
  );
  observe.observe(box);
};

onMounted(async () => {
  await pageGetTalkList();
  if (talkList.value.length < total.value) {
    observeTalkBottom();
  }
});
</script>

<template>
  <el-card class="talk-card">
    <template #header>
      <div class="flex justify-between items-center">
        说说列表
        <el-button
          type="danger"
          size="small"
          :icon="useRenderIcon(Plus)"
          @click="publishTalk"
        >
          发布说说
        </el-button>
      </div>
    </template>
    <el-tabs @tab-click="tabChange">
      <template v-for="item of talkTab" :key="item.key">
        <el-tab-pane :lazy="true">
          <template #label>
            <el-tooltip :content="item.content" placement="top-end">
              <span>{{ item.title }}</span>
            </el-tooltip>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <div class="talk-parent">
      <el-card
        :class="[index ? 'mt-[20px]' : '', 'w-[384px]', 'talk-list']"
        v-for="(talk, index) in talkList"
        :key="talk.id"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <zhiding
                v-if="talk.status == 1 && talk.is_top == 1"
                class="zhiding"
              />
            </div>
            <el-dropdown
              @command="
                val => {
                  handleCommand(val, talk);
                }
              "
            >
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="[1, 2].includes(talk.status)"
                    command="edit"
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="talk.status == 1"
                    command="toggleTop"
                    >{{
                      talk.is_top == 1 ? "取消置顶" : "置顶"
                    }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="[1, 2].includes(talk.status)"
                    command="togglePublic"
                    >{{ talk.status == 1 ? "隐藏" : "公开" }}</el-dropdown-item
                  >
                  <el-dropdown-item v-if="talk.status == 3" command="revert"
                    >恢复说说</el-dropdown-item
                  >
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <div class="talk-header">
          <el-avatar
            class="talk-header__left"
            :size="40"
            :src="talk.avatar || avatar"
            shape="square"
          />
          <div class="talk-header__right">
            <span class="nick-name">{{ talk.nick_name || nickName }}</span>
            <TextOverflow
              class="mt-[5px]"
              :text="talk.content"
              :width="299"
              :maxLines="8"
              :font-size="13"
            >
              <template v-slot:default="{ clickToggle, expanded }">
                <button @click="clickToggle" class="btn">
                  {{ expanded ? "收起" : "展开" }}
                </button>
              </template>
            </TextOverflow>
          </div>
        </div>
        <div
          class="talk-img"
          v-if="Array.isArray(talk.talkImgList) && talk.talkImgList.length > 1"
        >
          <el-image
            v-for="(url, index) in talk.talkImgList"
            :key="index"
            :src="url"
            class="w-[100px] h-[100px]"
            loading="lazy"
            preview-teleported
            :initial-index="index"
            fit="cover"
            :preview-src-list="talk.talkImgList.map(v => v)"
          />
        </div>
        <div
          class="talk-img-one"
          v-else-if="
            Array.isArray(talk.talkImgList) && talk.talkImgList.length == 1
          "
        >
          <el-image
            :key="index"
            :src="talk.talkImgList[0]"
            class="w-[120px] h-[120px]"
            loading="lazy"
            preview-teleported
            :initial-index="index"
            fit="cover"
            :preview-src-list="talk.talkImgList.map(v => v)"
          />
        </div>
        <div class="time">{{ returnTime(talk.createdAt) }}前</div>
      </el-card>
      <div class="observer">
        {{ talkList.length >= total ? "暂无更多" : "下拉加载更多" }}
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.talk-card {
  height: calc(100vh - 110px);
  overflow: auto;
}

.talk-card::-webkit-scrollbar {
  display: none;
}

.zhiding {
  width: 20px;
  height: 20px;
}

.talk {
  &-parent {
    height: calc(100vh - 260px);
    overflow: auto;
  }
  &-list {
    overflow-y: auto;
  }

  &-header {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    &__left {
      width: 40px;
    }

    &__right {
      margin-left: 5px;
      width: 299px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .nick-name {
        font-size: 14px;
      }

      .btn {
        margin-left: 3px;
        background-color: #fff;
        color: #4091f7;
      }
    }
  }

  &-img {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-auto-rows: 100px;
    gap: 1px;
  }

  &-img-one {
    margin-top: 20px;
    width: 120px;
    height: 120px;
  }
}

.time {
  font-size: 12px;
  margin-top: 20px;
  letter-spacing: 1px;
  color: #676767;
}

.observer {
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  width: 284px;
}
</style>
