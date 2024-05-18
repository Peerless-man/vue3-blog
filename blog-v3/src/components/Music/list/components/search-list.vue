<script setup>
import { defineComponent, h, ref, reactive, inject } from "vue";

import { PLAYTYPE } from "../../musicTool";
import { ElNotification } from "element-plus";
import { reqSearch } from "@/api/music";
import { deepClone } from "@/utils/tool";

defineComponent({
  name: "CustomMusicList",
});

const musicGetters = inject("musicGetters");
const musicSetters = inject("musicSetters");

const { getCustomerMusicList } = musicGetters;
const keyWords = ref(""); // 搜索关键词
const keyWordsSongs = ref([]); //
const params = reactive({
  limit: 20,
  offset: 0,
  id: "",
  loadMore: true,
  loading: false,
});

const primaryParams = reactive({ ...params });

const playMusic = (item) => {
  // 设置当前播放音乐
  musicSetters.setMusicInfo(item.id, false);
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
  let newItem = deepClone(item);
  newItem.ar = item.artists;
  newItem.al = item.album;
  newItem.al.picUrl = item.album.artist.img1v1Url;
  if (isActive(item.id)) return;
  musicSetters.setCustomerMusicList("add", newItem);
  musicSetters.setPlayType(PLAYTYPE.CUSTOM);

  keyWordsSongs.value.forEach((song) => {
    song.active = isActive(song.id);
  });
  ElNotification({
    offset: 60,
    title: "提示",
    duration: 1000,
    message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "添加成功"),
  });
};

const returnAuthors = (arr, attr) => {
  let resArr = arr.map((v) => {
    return v[attr];
  });

  return resArr.join(",");
};

// 搜索歌曲
const search = async (type) => {
  params.loading = true;

  if (type !== "loadMore") {
    Object.assign(params, primaryParams);
  }
  if (!keyWords.value) {
    keyWordsSongs.value = [];
    return;
  }

  const res = await reqSearch(keyWords.value, params.offset, params.limit);
  if (res.code == 200) {
    let list = Array.isArray(res.result.songs) ? res.result.songs : [];
    keyWordsSongs.value = params.offset == 0 ? list : keyWordsSongs.value.concat(list);
    params.loading = false;
    if (!keyWordsSongs.value.length) {
      params.loadMore = false;
      ElNotification({
        offset: 60,
        title: "提示",
        duration: 1000,
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "没有相关的歌曲"),
      });
      return;
    }
    if (type !== "loadMore") {
      document.querySelector(".search-music-list__detail").scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    keyWordsSongs.value.forEach((song) => {
      song.active = isActive(song.id);
    });
  }
};

const searchSingerSongs = async (type) => {
  if (!params.loadMore) return;
  if (type == "init") {
    params.offset = 0;
  } else {
    params.offset = params.limit + params.offset;
  }
  search("loadMore");
};
</script>

<template>
  <div class="search-music-list">
    <div class="search">
      <el-input v-model="keyWords" placeholder="请输入歌名或歌手" @keyup.enter="search" clearable>
        <template #append>
          <el-button @click="search"> 搜索 </el-button>
        </template>
      </el-input>
    </div>
    <div class="flex justify-center items-start pt-[50px]">
      <div class="search-music-list__detail">
        <el-row v-if="keyWordsSongs.length" class="body">
          <el-row style="width: 100%">
            <el-col :span="24" class="header">
              <div class="title title1">歌曲</div>
              <div class="title title2">作者</div>
              <div class="title title3">操作</div>
            </el-col>
          </el-row>
          <el-col
            class="flex justify-start items-center overflow-auto"
            :span="24"
            v-for="item in keyWordsSongs"
            :key="item.id"
          >
            <div class="name" @click="playMusic(item)">
              <span class="text-overflow" :title="item.name">{{ item.name }}</span>
            </div>
            <div class="author">
              <span class="text-overflow" :title="returnAuthors(item.artists, 'name')">{{
                returnAuthors(item.artists, "name")
              }}</span>
            </div>
            <div class="add-music">
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
            <Loading :size="24" v-if="params.loading" />
            <template v-else>
              {{ params.loadMore ? "点击加载更多～" : "已经到底了" }}
            </template>
          </div>
        </el-row>
        <div v-else class="empty">空空如也</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-music-list {
  position: relative;
  box-sizing: border-box;
  border-radius: 8px;
  width: 320px;
  overflow: hidden;

  .search {
    position: absolute;
    top: 10px;
    left: 3px;
    width: 100%;
    height: 30px;
  }

  &__detail {
    position: relative;
    width: 330px;
    height: 340px;
    overflow-x: hidden;
    overflow-y: scroll;

    .big-title {
      font-weight: 600;
      font-size: 1.2rem;
      color: var(--music-main-active);
    }

    .header {
      display: flex;
      .title {
        font-weight: 600;
        font-size: 1.1rem;
        &1 {
          width: 40%;
        }
        &2 {
          width: 45%;
        }
        &3 {
          width: 15%;
        }
      }
    }

    .body {
      max-height: 320px;
    }
  }

  .name {
    width: 40%;
    cursor: pointer;

    &:hover {
      color: var(--music-main-active);
    }
  }

  .author {
    width: 45%;
  }

  .add-music {
    width: 15%;
    &:hover {
      color: var(--music-main-active);
    }
  }

  .active {
    color: var(--music-main-active);
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
    width: 100%;
    height: 100%;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
:deep(.el-input-group__append) {
  color: #fff;
  background-color: var(--music-main-active);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.observe {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: var(--primary);
  cursor: pointer;
}
</style>
