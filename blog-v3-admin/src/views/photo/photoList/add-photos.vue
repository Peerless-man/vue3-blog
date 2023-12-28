<script setup lang="ts" name="AddPhotos">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { imgUpload } from "@/api/site";
import { imageConversion } from "@/utils/utils";
import { addPhotos } from "@/api/photo";
import Upload from "@/components/Upload/upload.vue";
import { ElLoading } from "element-plus";
import { message } from "@/utils/message";
import { CircleCheck } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const currentAlbumName = ref(null);
const currentAlbumId = ref(null);

const imgUploadList = ref([]);
const save = async () => {
  if (!currentAlbumId.value) {
    message("请重新选择相册上传图片", { type: "error" });
    return;
  }
  // 上传图片
  const finalList = [];
  // 批量压缩
  const conversionLoading = ElLoading.service({
    fullscreen: true,
    text: "图片压缩中"
  });
  const conversionPromiseList = imgUploadList.value.map(async v => {
    return await imageConversion(v.raw);
  });

  const conversionUploadList = [];
  await Promise.all(conversionPromiseList).then(res => {
    res.map(raw => {
      conversionUploadList.push({ raw });
    });
  });
  conversionLoading.close();
  const imgUploading = ElLoading.service({
    fullscreen: true,
    text: "努力上传中，请耐心等待......"
  });
  const promiseList = conversionUploadList.map(async v => {
    return await imgUpload(v);
  });
  await Promise.all(promiseList).then(res => {
    res.map(img => {
      if (img.code == 0) {
        const { url } = img.result;
        finalList.push({
          album_id: currentAlbumId.value,
          url: url
        });
      } else {
        message("图片上传失败", { type: "error" });
      }
    });
  });
  imgUploading.close();
  const imgSaveLoading = ElLoading.service({
    fullscreen: true,
    text: "图片保存中......"
  });
  const addPhotosRes = await addPhotos({ photoList: finalList });
  if (addPhotosRes.code == 0) {
    message("保存成功", { type: "success" });
  } else {
    imgSaveLoading.close();
  }
  imgSaveLoading.close();

  router.push({
    path: "/photo/photoList",
    query: {
      id: currentAlbumId.value,
      albumName: currentAlbumName.value
    }
  });
};

const cancel = () => {
  router.push({
    path: "/photo/photoList",
    query: {
      id: currentAlbumId.value,
      albumName: currentAlbumName.value
    }
  });
};

onMounted(() => {
  if (route.query.id && route.query.albumName) {
    currentAlbumName.value = route.query.albumName;
    currentAlbumId.value = route.query.id;
  }
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex_r_b">
        <span style="font-weight: 600; color: #606266"
          >图库名称 - {{ currentAlbumName }}</span
        >
        <div>
          <el-button
            type="danger"
            size="small"
            :icon="CircleCheck"
            @click="save"
            >保存</el-button
          >
          <el-button
            type="info"
            size="small"
            :icon="CircleCheck"
            @click="cancel"
            >取消</el-button
          >
        </div>
      </div>
      <div class="flex_r_b mt-[10px] tips">
        <span />
        tips: 最多上传9张照片，并且总大小不能超过30M
      </div>
    </template>
    <div class="album-upload">
      <Upload
        v-model:fileList="imgUploadList"
        :limit="9"
        :width="108"
        :height="108"
        :multiple="true"
        :preview="false"
      />
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
.flex_r_b {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.album-upload {
  height: calc(100vh - 260px);
  overflow: auto;
}

.tips {
  font-size: 0.8rem;
  color: #f56c6c;
}

:deep(.el-card__body) {
  padding: 5px 5px 0 5px !important;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 108px !important;
  height: 108px !important;
  margin: 3px !important;
  border: none !important;
  border-radius: 0;
}

:deep(.el-upload--picture-card) {
  width: 108px !important;
  height: 108px !important;
  margin: 3px !important;
}

:deep(.el-upload-list__item-cover) {
  object-fit: cover !important;
}
</style>
