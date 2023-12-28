<!--友链列表  -->
<script setup>
import { ref, reactive, h, onMounted } from "vue";
import { addFriendLinks, updateFriendLinks } from "@/api/links";
import { ElNotification } from "element-plus";

import { imgUpload } from "@/api/user";

import Upload from "@/components/Upload/upload.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { _getLocalItem } from "@/utils/tool";
import { user } from "@/store/index.js";
import { storeToRefs } from "pinia";

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
const route = useRoute();
const type = ref("");

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

// 申请友链
const applayLinks = async () => {
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
          router.go(-1);
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

onMounted(() => {
  if (!getUserInfo.value.id) {
    ElNotification({
      offset: 60,
      title: "温馨提示",
      message: h("div", { style: "color: #e6c081; font-weight: 600;" }, "请先登录"),
    });
    router.go(-1);
  }
  if (route.path == "/link/apply") {
    type.value = "apply";
  } else if (route.path == "/link/update") {
    type.value == "update";
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
    console.log(form);
  }
});
</script>

<template>
  <PageHeader />
  <div class="center_box flex justify-center flex-col items-center">
    <el-form
      class="apply-form"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item label="网站名称" prop="site_name">
        <el-input
          v-model="form.site_name"
          :style="{ width: '220px' }"
          placeholder="请输入网站名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="网站描述" prop="site_desc">
        <el-input
          type="textarea"
          v-model="form.site_desc"
          :style="{ width: '220px' }"
          maxlength="125"
          resize="none"
          :autosize="{ minRows: 2, maxRows: 3 }"
          show-word-limit
          placeholder="请输入网站描述"
          clearable
        />
      </el-form-item>
      <el-form-item label="网站地址" prop="url">
        <el-input
          v-model="form.url"
          :style="{ width: '220px' }"
          placeholder="请输入网站地址"
          clearable
        />
      </el-form-item>
      <el-form-item label="网站头像" prop="site_avatar">
        <Upload
          v-model:file-list="form.bgList"
          :limit="1"
          :width="100"
          :height="100"
          :preview="false"
        />
      </el-form-item>
    </el-form>
    <div class="pos">
      <el-button
        :disabled="loading"
        :loading="loading"
        class="apply-button"
        type="danger"
        @click="applayLinks"
      >
        {{ loading ? "努力上传中..." : type == "apply" ? "申请友链" : "修改友链" }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pos {
  margin-top: 30px;
}
.apply-form {
  max-width: 400px;
}

:deep(.el-upload--picture-card) {
  width: 100px !important;
  height: 100px !important;
  border-radius: 50px !important;
}

:deep(.el-upload-list__item) {
  width: 100px !important;
  height: 100px !important;
  border-radius: 50px !important;
  margin: 0;
}

:deep(.el-upload-list--picture-card) {
  width: 100px !important;
  height: 100px !important;
  border-radius: 50px !important;
}
</style>
