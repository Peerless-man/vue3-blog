<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllAlbum } from "@/api/photo";

import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";

const albumList = ref([]);
const loading = ref(false);

const router = useRouter();
const goToPhotos = (item) => {
  router.push({
    path: "/photos",
    query: { id: item.id, pageTitle: item.album_name, bg: item.album_cover },
  });
};

const getAll = async () => {
  loading.value = true;
  let res = await getAllAlbum();
  if (res.code == 0) {
    albumList.value = res.result;
    loading.value = false;
  }
};

onMounted(() => {
  getAll();
});
</script>

<template>
  <PageHeader />
  <div class="albumList">
    <el-row class="center_box">
      <el-col :span="24">
        <el-card class="albumList-card">
          <el-row v-if="loading">
            <el-col :xs="12" :sm="6" v-for="item in 8" :key="item">
              <div class="flex_center">
                <el-skeleton animated>
                  <template #template>
                    <SkeletonItem variant="image" width="100%" height="8rem" />
                  </template>
                </el-skeleton>
              </div>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :xs="12" :sm="6" v-for="item in albumList" :key="item.id">
              <div
                v-image="item.album_cover"
                class="albumList-box flex_center"
                @click="goToPhotos(item)"
              >
                <div class="albumList-box__mask">
                  <span class="name text_overflow"> {{ item.album_name }}</span>
                  <span class="desc text_overflow">{{ item.description }}</span>
                </div>
                <el-image class="albumList-box__image" :src="item.album_cover" fit="cover" lazy>
                  <template #error>
                    <div class="w-[100%] h-[100%] grid place-items-center">
                      <svg-icon name="image404" :width="8" :height="6"></svg-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.albumList {
  &-card {
    padding: 10px;
    min-height: 12em;
    cursor: pointer;
  }
  &-box {
    position: relative;
    width: 100%;
    height: 10rem;
    transition: all 0.3s ease-in-out;

    &__image {
      border-radius: 8px;
      vertical-align: middle;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &__mask {
      display: block;
      position: absolute;
      top: 0.8rem;
      left: 1rem;
      right: 1rem;
      bottom: 40%;
      border-radius: 8px;
      padding: 5px;
      z-index: 999;
      background: rgba(0, 0, 0, 0.2);
      .name {
        display: block;
        width: 100%;
        color: var(--global-white);
        font-size: 1.4rem;
        font-weight: bold;
      }
      .desc {
        display: block;
        width: 100%;
        color: var(--global-white);
        font-size: 1rem;
        font-weight: bold;
      }
    }
  }
}
.albumList-box:hover {
  filter: saturate(2) drop-shadow(0 0 5px rgba(0, 0, 0, 0.66));
  transform: translateY(-5px);
}

@media screen and (max-width: 768px) {
  .albumList-box {
    width: 12rem;
    height: 8rem;
  }
}
</style>
