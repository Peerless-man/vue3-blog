<script lang="ts" setup>
import { watch, ref, nextTick } from "vue";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";

const emit = defineEmits(["update:fileList", "handleRemove"]);
const props = defineProps({
  fileList: {
    type: Array,
    default: () => {}
  },
  limit: {
    type: Number,
    default: 1
  },
  preview: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  }
});

const dialogVisible = ref(false);
const previewIndex = ref(0);
const uploadFileList = ref([]);
const showUpload = ref(true);

const uploadChange = () => {
  nextTick(() => {
    if (uploadFileList.value.length >= props.limit) {
      showUpload.value = false;
    }
    emit("update:fileList", uploadFileList.value); // 修改父组件的文件值
  });
};
function handlePictureCardPreview(file: any) {
  // 图片预览
  const index = uploadFileList.value.findIndex(v => v.uid == file.uid);
  previewIndex.value = index;
  dialogVisible.value = true;
}

function closeImgViewer() {
  previewIndex.value = 0;
  dialogVisible.value = false;
}

const handleRemove = async file => {
  if (file) {
    const { url } = file;
    const index = uploadFileList.value.findIndex(file => file.url == url);

    if (index != -1) {
      uploadFileList.value.splice(index, 1);
    }
    showUpload.value = true;
    emit("update:fileList", uploadFileList.value); // 修改父组件的文件值
  }
};

watch(
  () => props.fileList,
  newVal => {
    uploadFileList.value = newVal;
    if (newVal.length >= props.limit) {
      showUpload.value = false;
    }
    if (!newVal.length) {
      showUpload.value = true;
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<template>
  <el-upload
    ref="uploadAvatarRef"
    v-model:file-list="uploadFileList"
    :class="[showUpload && !preview ? '' : 'hide-upload']"
    action="#"
    list-type="picture-card"
    :auto-upload="false"
    :multiple="multiple"
    :limit="limit"
    :on-change="uploadChange"
  >
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div>
        <el-image
          :style="{ width: width + 'px', height: height + 'px' }"
          fit="cover"
          :src="file.url"
          lazy
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            v-if="!preview"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
  <el-image-viewer
    v-if="dialogVisible"
    :url-list="uploadFileList.map(v => v.url)"
    :initial-index="previewIndex"
    :teleported="true"
    @close="closeImgViewer"
  />
</template>

<style lang="scss" scoped>
.hide-upload {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

.el-upload-list--picture-card {
  display: flex;
}
</style>
