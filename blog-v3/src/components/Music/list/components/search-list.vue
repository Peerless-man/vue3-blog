<script setup>
import { defineComponent, h, ref, reactive } from "vue";

import { music } from "@/store/index";
import { PLAYTYPE } from "../../musicTool";
import { ElNotification } from "element-plus";
import { reqSearch, reqSearchSingerHot } from "@/api/music";
import { storeToRefs } from "pinia";

defineComponent({
  name: "CustomMusicList",
});

const { getCustomerMusicList } = storeToRefs(music());
const keyWords = ref(""); // 搜索关键词
const searchList = ref([]); // 搜索列表
const singer = ref("");
const params = reactive({
  limit: 20,
  offset: 0,
  id: "",
  loadMore: true,
});

const playMusic = (item) => {
  // 设置当前播放音乐
  music().setMusicInfo(item.id, false);
  // 设置播放音乐的详细描述
  music().setPlayType(PLAYTYPE.CUSTOM);
};

// 判断当前歌曲是否在用户定制列表中
const isActive = (id) => {
  if (!getCustomerMusicList.value.length) {
    return false;
  }
  let index = getCustomerMusicList.value.findIndex((item) => item.id == id);
  if (index == -1) {
    return false;
  } else {
    return true;
  }
};
// 添加歌曲
const customerAddMusic = (item) => {
  if (isActive(item.id)) return;
  music().setCustomerMusicList("add", item);
  music().setPlayType(PLAYTYPE.CUSTOM);

  searchList.value.forEach((song) => {
    song.active = isActive(song.id);
  });
  ElNotification({
    offset: 60,
    title: "提示",
    duration: 1000,
    message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "添加成功"),
  });
};

// 搜索歌曲
const search = async () => {
  const res = await reqSearch(keyWords.value);
  if (res.code == 200) {
    let obj = {
      id: "",
      name: "",
    };
    singer.value = Object.assign(obj, res.result.artists[0]);
    searchSingerSongs("init");
  }
};

const searchSingerSongs = async (type) => {
  if (!params.loadMore) return;
  params.id = singer.value.id;
  if (type == "init") {
    params.offset = 0;
  } else {
    params.offset = params.limit + params.offset;
  }
  const res = await reqSearchSingerHot(params);
  if (res.code == 200) {
    let list = Array.isArray(res.songs) ? res.songs : [];
    if (!list.length) {
      params.loadMore = false;
    }
    list.forEach((song) => {
      song.active = isActive(song.id);
    });
    searchList.value = params.offset == 0 ? list : searchList.value.concat(list);
  }
};
</script>

<template>
  <div class="search-music-list">
    <div class="flex justify-center items-start">
      <div class="!py-[10px] search-music-list__detail">
        <div class="search">
          <el-input
            style="width: 180px"
            v-model="keyWords"
            @keyup.enter="search"
            clearable
          ></el-input>
          <el-button
            style="background-color: #62c28a; margin-left: 10px; color: #676767"
            @click="search"
            >搜索</el-button
          >
        </div>
        <el-row>
          <el-col :span="24" class="header">
            <div class="title title1">歌曲</div>
            <div class="title title2">作者</div>
            <div class="title title3">其他</div>
          </el-col>
        </el-row>
        <el-row v-if="searchList.length" class="body">
          <el-col
            class="flex justify-start items-center overflow-auto"
            :span="24"
            v-for="item in searchList"
            :key="item.id"
          >
            <div class="name" @click="playMusic(item)">
              <span class="text-overflow" :title="item.name">{{ item.name }}</span>
            </div>
            <div class="author">
              <span class="text-overflow" :title="item.ar[0].name">{{ item.ar[0].name }}</span>
            </div>
            <div class="other">
              <span class="text-overflow" :title="item.awardName">{{ item.awardName }}</span>
            </div>
            <div class="add">
              <i
                :class="[
                  'iconfont',
                  'icon-tianjiadao',
                  'change-color',
                  item.active ? 'active' : '',
                ]"
                @click="customerAddMusic(item)"
              ></i>
            </div>
          </el-col>
          <div class="observe" @click="searchSingerSongs('loadMore')">
            {{ params.loadMore ? "加载更多" : "已经到底了" }}
          </div>
        </el-row>
        <div v-else class="empty">空空如也</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-music-list {
  box-sizing: border-box;
  border-radius: 8px;
  width: 350px;
  height: 400px;
  padding: 10px;

  &__detail {
    position: relative;
    width: 330px;
    height: 400px;

    .header {
      width: 330px;
      display: flex;
      .title {
        font-weight: 600;
        font-size: 1.2rem;
        &1 {
          width: 30%;
        }
        &2 {
          width: 25%;
        }
        &3 {
          width: 25%;
        }
      }
    }

    .body {
      max-height: 320px;
      overflow: auto;
    }
  }

  .name {
    width: 30%;
    cursor: pointer;

    &:hover {
      color: #62c28a;
    }
  }

  .author {
    width: 25%;
  }

  .other {
    width: 25%;
  }

  .add-music {
    text-align: center;
    width: 20%;
    &:hover {
      color: #62c28a;
    }
  }

  .active {
    color: #62c28a;
  }

  .text-overflow {
    font-size: 1rem;
    display: inline-block;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty {
    width: 80%;
    height: 25px;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
}
.observe {
  text-align: center;
  width: 100%;
  color: var(--primary);
  cursor: pointer;
}
</style>
