<!--友链申请  -->
<script setup>
import { ref, reactive, h, watch } from "vue";
import { addFriendLinks, updateFriendLinks } from "@/api/links";
import { ElNotification } from "element-plus";

import { imgUpload } from "@/api/user";

import Upload from "@/components/Upload/upload.vue";
import { _getLocalItem, _removeLocalItem } from "@/utils/tool";
import { user } from "@/store/index.js";
import { storeToRefs } from "pinia";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "add",
  },
});

const emit = defineEmits(["update:show"]);

const { getUserInfo } = storeToRefs(user());

const urlV = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入网站地址"));
  } else if (value.indexOf("http") == -1) {
    return cb(new Error("请输入带http://或https://的网站地址"));
  } else {
    cb();
  }
};

const loading = ref(false);
const dialogVisible = ref(false);

const formRef = ref();
const form = reactive({
  site_name: "", // 网站名称
  site_desc: "", // 网站描述
  url: "", // 网址
  site_avatar: "", // 网站头像
  bgList: [],
  status: 1,
  user_id: "",
});
const primaryForm = reactive({ ...form });

const rules = reactive({
  site_name: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
  site_desc: [{ required: true, message: "请输入网站描述", trigger: "blur" }],
  url: [{ required: true, validator: urlV, trigger: "blur" }],
});
const handleClose = () => {
  emit("update:show", false);
};
// 申请友链
const applyLinks = async () => {
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        if (form.bgList.length && !form.bgList[0].id) {
          const img = await imgUpload(form.bgList[0]);
          if (img.code == 0) {
            const { url } = img.result;
            form.site_avatar = url;
          }
        }

        form.status = 1;
        let res;
        if (form.id) {
          res = await updateFriendLinks(form);
        } else {
          form.user_id = getUserInfo.value.id;
          res = await addFriendLinks(form);
        }

        if (res && res.code == 0) {
          ElNotification({
            offset: 60,
            title: "提示",
            message: h(
              "div",
              { style: "color: #7ec050; font-weight: 600;" },
              `${form.id ? "修改" : "申请"}成功，等待博主审核通过`
            ),
          });
          Object.assign(form, primaryForm);
          handleClose();
        } else {
          ElNotification({
            offset: 60,
            title: "错误提示",
            message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, "未知错误"),
    });
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.show,
  (newV) => {
    dialogVisible.value = newV;
    if (newV) {
      Object.assign(form, primaryForm);
      let item = _getLocalItem("blog-link-update");
      if (item) {
        form.bgList = [
          {
            id: 1,
            url: item.site_avatar,
            name: item.site_avatar.split("/").slice(-1),
          },
        ];
      }
      Object.assign(form, item);
    } else {
      _removeLocalItem("blog-link-update");
    }
  }
);
</script>

<template>
  <el-dialog v-model="dialogVisible" width="120" :before-close="handleClose">
    <template #header>
      <h1>{{ type == "add" ? "友链申请" : "友链修改" }}</h1>
    </template>
    <div class="apply-box flex flex-col justify-between items-center">
      <el-form class="apply-form" ref="formRef" :model="form" :rules="rules" label-suffix=":">
        <el-form-item label="网站头像" prop="site_avatar">
          <div class="w-[100%] flex justify-center">
            <Upload
              v-model:file-list="form.bgList"
              :width="150"
              :height="150"
              :limit="1"
              :preview="false"
            />
          </div>
        </el-form-item>

        <el-form-item label="网站名称" prop="site_name">
          <el-input v-model="form.site_name" placeholder="请输入网站名称" clearable />
        </el-form-item>
        <el-form-item label="网站描述" prop="site_desc">
          <el-input
            type="textarea"
            v-model="form.site_desc"
            maxlength="125"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 3 }"
            show-word-limit
            placeholder="请输入网站描述"
            clearable
          />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入网站地址" clearable />
        </el-form-item>
      </el-form>
      <div class="pos">
        <el-button :disabled="loading" :loading="loading" class="apply-button" @click="applyLinks">
          {{ loading ? "努力上传中..." : type == "add" ? "申请友链" : "修改友链" }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.pos {
  width: 100%;
  margin: 5px 0 10px 0;
}
.apply-form {
  width: 100%;
}

:deep(.el-form-item) {
  padding: 15px 0;
}

.apply-button {
  width: 100%;
}

:deep(.el-input__wrapper) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-upload--picture-card) {
  width: 150px !important;
  height: 150px !important;
  border-radius: 8px !important;
}

:deep(.el-upload-list__item) {
  width: 150px !important;
  height: 150px !important;
  border-radius: 8px !important;
  margin: 0;
}

:deep(.el-upload-list--picture-card) {
  width: 150px !important;
  height: 150px !important;
  border-radius: 8px !important;
}

// mobile
@media screen and (max-width: 768px) {
  .apply-box {
    height: 88vh;
  }
}
</style>
