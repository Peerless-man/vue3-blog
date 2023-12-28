<script setup lang="ts" name="AddEditTalk">
import { message } from "@/utils/message";
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Upload from "@/components/Upload/upload.vue";

import { addTalk, editTalk, getTalkById } from "@/api/talk";
import { imgUpload } from "@/api/site";
import { imageConversion } from "@/utils/utils";

import { ElLoading } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";

const route = useRoute();
const router = useRouter();

const form = reactive({
  id: null,
  content: "", // 说说内容
  is_top: 2, // 置顶 2 取消置顶 3
  status: 1, // 1 公开 2 私密
  talkImgList: [],
  user_id: 0
});

const save = async () => {
  if (form.content || form.talkImgList.length > 0) {
    let needUploadList = [];
    const restList = [];
    if (route.query.id) {
      needUploadList = form.talkImgList.filter(item => !item.id);
      form.talkImgList.forEach(img => {
        if (img.id) {
          restList.push({ id: img.id, url: img.url });
        }
      });
    } else {
      needUploadList = form.talkImgList;
    }
    // 压缩
    const conversionLoading = ElLoading.service({
      fullscreen: true,
      text: "图片压缩中"
    });
    const conversionPromiseList = needUploadList.map(async v => {
      return await imageConversion(v.raw);
    });

    const conversionUploadList = [];
    await Promise.all(conversionPromiseList).then(res => {
      res.map(raw => {
        conversionUploadList.push({ raw });
      });
    });
    conversionLoading.close();
    // 图片上传
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
          const obj = route.query.id
            ? { id: route.query.id, url: url }
            : { url };
          restList.push(obj);
        } else {
          message("图片上传失败", { type: "error" });
        }
      });
    });
    imgUploading.close();
    // 新增 / 修改说说
    form.talkImgList = restList;
    if (!route.query.id) {
      const userId = useUserStoreHook()?.getUserId;
      Object.assign(form, { user_id: userId });
    }
    const res = route.query.id ? await editTalk(form) : await addTalk(form);
    if (res.code == 0) {
      message(route.query.id ? "修改成功" : "发布成功", { type: "success" });
      router.go(-1);
    }
  } else {
    message("说说图片或说说内容不能都为空", { type: "warning" });
  }
};

const cancel = () => {
  router.go(-1);
};

const getTalkDetailById = async id => {
  const res = await getTalkById(id);
  if (res.code == 0) {
    res.result.talkImgList = res.result.talkImgList.map(img => {
      return {
        id: id,
        url: img
      };
    });
    Object.assign(form, res.result);
  }
};

onMounted(() => {
  if (route.query.id) {
    getTalkDetailById(route.query.id);
  }
});
</script>
<template>
  <el-card class="talk-card">
    <template #header>
      <div class="flex justify-between items-center">
        {{ route.query.id ? "编辑说说" : "新增说说" }}
        <div>
          <el-button type="info" size="small" @click="cancel">取消</el-button>
          <el-button type="danger" size="small" @click="save">保存</el-button>
        </div>
      </div>
    </template>
    <el-form ref="formRef" :model="form" label-width="60px" label-suffix=":">
      <el-form-item label="内容">
        <el-input
          type="textarea"
          v-model="form.content"
          clearable
          class="max-w-[300px]"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
      </el-form-item>
      <el-form-item label="图片" class="img-form">
        <Upload
          v-model:fileList="form.talkImgList"
          :width="80"
          :height="80"
          :limit="9"
          :multiple="true"
          :preview="false"
        />
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch
          v-model="form.is_top"
          :active-value="1"
          :inactive-value="2"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" class="w-[120px]">
          <el-option label="公开" :value="1" />
          <el-option label="私密" :value="2" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
.talk-card {
  height: calc(100vh - 130px);
  overflow: auto;
}

.img-form {
  :deep(.el-form-item__content) {
    width: 268px;
    height: 268px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

// 上传图片展示的大小
:deep(.el-upload-list__item) {
  width: 80px !important;
  height: 80px !important;
  margin: 3px !important;
  border: none !important;
  border-radius: 0;
}

// 加号背景大小
:deep(.el-upload--picture-card) {
  width: 80px !important;
  height: 80px !important;
  margin: 3px !important;
}

// 上传盒子总体的大小
:deep(.el-upload-list--picture-card) {
  width: 268px;
}
</style>
