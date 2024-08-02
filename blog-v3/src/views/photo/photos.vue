<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAllPhotosByAlbumId } from "@/api/photo";
import { getAllAlbum } from "@/api/photo";

import PageHeader from "@/components/PageHeader/index.vue";
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
import { isMobile } from "@/utils/tool";

const route = useRoute();
const router = useRouter();
const photoList = ref([]);
const photoAlbumList = ref([]);
const loading = ref(false);
const drawerShow = ref(false);

const pageGetPhotos = async (id) => {
  loading.value = true;
  let res = await getAllPhotosByAlbumId(id);
  if (res.code == 0) {
    photoList.value = res.result;
    loading.value = false;
  }
};

const toggleAlbum = (item) => {
  router.push({
    path: "/photos",
    query: {
      id: item.id,
      pageTitle: item.album_name,
      bg: item.album_cover,
    },
  });
};

const getAll = async (id) => {
  let res = await getAllAlbum();
  if (res.code == 0) {
    photoAlbumList.value = res.result;
    pageGetPhotos(Number(id));
  }
};

const openDrawer = () => {
  drawerShow.value = true;
};
const handleClose = () => {
  drawerShow.value = false;
};

watch(
  () => route.query.id,
  (newV) => {
    getAll(newV);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <PageHeader :bgUrl="route.query.bg" />
  <div class="photoList">
    <div class="center_box">
      <div class="photoList-card">
        <el-row v-if="loading" class="row-space">
          <el-col class="col-space" :xs="12" :sm="6" v-for="index in 6" :key="index">
            <div class="image-box">
              <el-skeleton animated>
                <template #template>
                  <SkeletonItem variant="image" width="100%" height="10rem" />
                </template>
              </el-skeleton>
            </div>
          </el-col>
        </el-row>
        <el-row v-else-if="photoList.length" class="row-space">
          <el-col
            class="col-space"
            :xs="12"
            :sm="6"
            v-for="(item, index) in photoList"
            :key="item.id"
          >
            <div v-image="item.url" class="image-box flex_center animate__animated animate__fadeIn">
              <el-image
                class="image"
                :src="item.url"
                fit="cover"
                lazy
                preview-teleported
                :initial-index="index"
                :preview-src-list="photoList.map((v) => v.url)"
              >
                <template #error>
                  <div class="w-[100%] h-[100%] grid place-items-center">
                    <svg-icon name="image404" :width="8" :height="6"></svg-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <div class="affix">
    <i class="iconfont icon-arrowleft" @click="openDrawer"></i>
  </div>
  <el-drawer
    v-model="drawerShow"
    direction="rtl"
    :before-close="handleClose"
    :append-to-body="true"
    :size="isMobile() ? '30%' : '15%'"
    :z-index="9999"
  >
    <div class="image-list">
      <div
        :class="['album-box !mb-[5px]', route.query.id == item.id ? 'album-current' : '']"
        v-for="item in photoAlbumList"
        :key="item.id"
      >
        <el-image
          class="album-box__image"
          :src="item.album_cover"
          fit="cover"
          lazy
          @click="toggleAlbum(item)"
        >
          <template #error>
            <svg-icon name="image404" :width="4" :height="4"></svg-icon>
          </template>
        </el-image>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.photoList {
  .photoList-card {
    min-height: 8rem;
    border-radius: 8px;
    background-color: var(--shadow-button-bg);
  }

  .image-box {
    width: 100%;
    height: 100%;
    transition: all 0.3s;
    border-radius: 5px;
    overflow: hidden;
    &:hover {
      transform: translateY(-5px);
      filter: saturate(2) drop-shadow(0 0 5px rgba(0, 0, 0, 0.66));
    }
  }

  .image {
    vertical-align: middle;
    cursor: pointer;
    width: 100%;
    object-fit: cover;
    display: grid;
    place-items: center;
  }
}

.row-space {
  padding: 5px !important;
}

.col-space {
  padding: 5px !important;
}

.image-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  padding: 3px;
  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}
.image-box {
  transition: all 0.3s;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 3px;

  &:hover {
    box-shadow: 0 0 8px var(--global-white);
  }
}
.album-current {
  filter: saturate(2);
  border-right: 2px solid #9face6;
}

.affix {
  position: fixed;
  bottom: 30%;
  right: 0%;
  .icon-arrowleft {
    font-size: 1.8rem;
  }
}

// pc
@media screen and (min-width: 769px) {
  .image {
    height: 10rem;
  }

  .album-box {
    width: 100px;
    height: 70px;
    &__image {
      width: 94px;
      height: 70px;
      vertical-align: top;
    }
  }
}

@media screen and (max-width: 768px) {
  .image {
    height: 8rem;
  }

  .album-box {
    width: 70px;
    height: 50px;
    &__image {
      width: 64px;
      height: 50px;
      vertical-align: top;
    }
  }
}
</style>
