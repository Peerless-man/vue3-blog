<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getAllPhotosByAlbumId } from "@/api/photo";
import { getAllAlbum } from "@/api/photo";

import PageHeader from "@/components/Header/PageHeader.vue";
import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";

const route = useRoute();
const photoList = ref([]);
const photoAlbumList = ref([]);
const loading = ref(false);

const pageGetPhotos = async (id) => {
  loading.value = true;
  let res = await getAllPhotosByAlbumId(id);
  if (res.code == 0) {
    photoList.value = res.result;
    loading.value = false;
  }
};

const getAll = async (id) => {
  let res = await getAllAlbum();
  if (res.code == 0) {
    photoAlbumList.value = res.result;
    pageGetPhotos(Number(id));
  }
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
  <PageHeader :bgUrl="route.query.bg" :photoAlbumList="photoAlbumList" />
  <div class="photoList">
    <el-row class="center_box">
      <el-col :span="24">
        <div class="photoList-card">
          <el-row v-if="loading" class="row-space">
            <el-col class="col-space" :xs="12" :sm="8" v-for="index in 6" :key="index">
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
              :sm="8"
              v-for="(item, index) in photoList"
              :key="item.id"
            >
              <div
                v-image="item.url"
                class="image-box flex_center animate__animated animate__fadeIn"
              >
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
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.photoList {
  .photoList-card {
    min-height: 8rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.5);
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

@media screen and (min-width: 769px) {
  .image {
    height: 14rem;
  }
}

@media screen and (max-width: 768px) {
  .image {
    height: 8rem;
  }
}
</style>
