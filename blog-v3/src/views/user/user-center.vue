<script setup>
import { ref, reactive, onMounted, h } from "vue";
import { updateUserInfo, updateUserPassword, getUserInfoById, imgUpload } from "@/api/user";
import { user } from "@/store/index";
import Upload from "@/components/Upload/upload.vue";

import { ElNotification, ElMessageBox } from "element-plus";
import router from "@/router";

const userStore = user();
const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;
const passwordV = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入密码"));
  } else if (!REGEXP_PWD.test(value)) {
    return cb(new Error("密码格式应为6-18位数字、字母、符号的任意两种组合"));
  }
  cb();
};
const password1V = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入新密码"));
  } else if (!REGEXP_PWD.test(value)) {
    return cb(new Error("密码格式应为6-18位数字、字母、符号的任意两种组合"));
  } else if (value == pwdForm.password) {
    return cb(new Error("新密码不能和旧密码一致"));
  }
  cb();
};
const password2V = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入二次确认密码"));
  } else if (value != pwdForm.password1) {
    return cb(new Error("两次密码不相等"));
  }
  cb();
};

const avatarV = (rule, value, cb) => {
  if (!infoForm.avatarList.length) {
    return cb(new Error("请上传头像"));
  }
  cb();
};

const infoFormRef = ref();
const infoPreview = ref(true);
const loading = ref(false);
const infoForm = reactive({
  id: "",
  nick_name: "", // 昵称
  avatar: "", // 头像
  avatarList: [], // 头像列表
});
const primaryinfoForm = reactive({ ...infoForm });

const activeName = ref("info");

const infoRules = reactive({
  nick_name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  avatar: [{ required: true, validator: avatarV, trigger: "blur" }],
});
// 密码相关
const pwdFormRef = ref();
const pwdForm = reactive({
  password: "", // 原密码
  password1: "", // 新密码
  password2: "", // 确认密码
});
const primaryPwdForm = reactive({ ...pwdForm });

const pwdRules = reactive({
  password: [{ required: true, validator: passwordV, trigger: "blur" }],
  password1: [{ required: true, validator: password1V, trigger: "blur" }],
  password2: [{ required: true, validator: password2V, trigger: "blur" }],
});

// 获取登录用户信息
const getCurrentUserInfo = async () => {
  const res = await getUserInfoById(userStore.getUserInfo.id);
  if (res && res.code == 0) {
    userStore.setUserInfo(res.result);
    const { avatar } = res.result;
    if (avatar) {
      infoForm.avatarList = [
        {
          id: 1,
          name: avatar.split("/").slice(-1),
          url: avatar,
        },
      ];
    }
    Object.assign(infoForm, res.result);
  }
};

// 修改用户信息
const updateInfo = async () => {
  await infoFormRef.value.validate(async (valid) => {
    if (valid) {
      ElMessageBox.confirm("确认修改用户信息？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(async () => {
        loading.value = true;
        // 先上传图片
        if (!infoForm.avatarList[0].id) {
          const img = await imgUpload(infoForm.avatarList[0]);
          if (img.code == 0) {
            const { url } = img.result;
            infoForm.avatar = url;
          }
        }
        const res = await updateUserInfo(infoForm);
        if (res && res.code == 0) {
          ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "修改成功"),
          });
          Object.assign(infoForm, primaryinfoForm);
          // 重新获取用户信息，更改store内存的值
          await getCurrentUserInfo();
          infoPreview.value = true;
        } else {
          ElNotification({
            offset: 60,
            title: "错误提示",
            message: h("div", { style: "color: #e47470" }, res.message),
          });
        }
        loading.value = false;
      });
    }
  });
};

// 修改密码
const updatePassword = async () => {
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      ElMessageBox.confirm("确认修改密码？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(async () => {
        const res = await updateUserPassword(pwdForm);
        if (res && res.code == 0) {
          ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "修改密码成功"),
          });
          Object.assign(pwdForm, primaryPwdForm);
          // 重新登录
          userStore.clearUserInfo();
          router.push("/");
        } else {
          ElNotification({
            offset: 60,
            title: "错误提示",
            message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
          });
        }
      });
    }
  });
};

onMounted(async () => {
  // 获取最新的当前登录用户信息
  await getCurrentUserInfo();
});
</script>

<template>
  <PageHeader />
  <div class="center_box flex flex-col justify-center items-center">
    <div class="info">
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人信息" name="info">
          <el-form
            class="info-form"
            ref="infoFormRef"
            :model="infoForm"
            :rules="infoRules"
            label-width="120px"
            label-suffix=":"
          >
            <el-form-item class="user-avatar" label="头像" prop="avatar">
              <div class="!ml-[50px]">
                <Upload
                  v-model:file-list="infoForm.avatarList"
                  :limit="1"
                  :width="100"
                  :height="100"
                  :preview="infoPreview"
                />
              </div>
            </el-form-item>
            <el-form-item label="昵称" prop="nick_name">
              <span v-if="infoPreview"> {{ infoForm.nick_name }}</span>
              <el-input
                v-else
                v-model="infoForm.nick_name"
                :style="{ width: '220px' }"
                placeholder="请输入昵称"
                clearable
              />
            </el-form-item>
          </el-form>
          <div class="pos">
            <el-button v-if="infoPreview" class="apply-button" @click="infoPreview = false"
              >编辑</el-button
            >
            <div v-else>
              <el-button class="apply-button cancel" type="info" @click="infoPreview = true"
                >取消</el-button
              >
              <el-button
                class="apply-button"
                type="danger"
                :disabled="loading"
                :loading="loading"
                @click="updateInfo"
                >保存</el-button
              >
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="密码修改" name="password">
          <el-form
            class="info-form"
            ref="pwdFormRef"
            :model="pwdForm"
            :rules="pwdRules"
            label-width="100px"
            label-suffix=":"
          >
            <el-form-item label="原密码" prop="password">
              <el-input
                v-model="pwdForm.password"
                :style="{ width: '220px' }"
                show-password
                placeholder="请输入原密码"
                clearable
              />
            </el-form-item>
            <el-form-item label="新密码" prop="password1">
              <el-input
                type="password"
                v-model="pwdForm.password1"
                show-password
                :style="{ width: '220px' }"
                placeholder="请输入新密码"
                clearable
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input
                type="password"
                v-model="pwdForm.password2"
                :style="{ width: '220px' }"
                placeholder="请确认密码"
                show-password
                clearable
              />
            </el-form-item>
          </el-form>
          <div class="pos">
            <el-button class="apply-button" type="primary" @click="updatePassword">修改</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  max-width: 400px;
  padding: 0 20px;
  .pos {
    width: 400px;
    padding: 0.8rem 0 12px 10rem;
  }

  &-button {
    height: 24px;
    padding: 0 30px;
    background-color: var(--border-color);
    border: none;
    transition: all 0.5s;
    &:hover {
      background-color: var(--primary);
    }
  }
}

.cancel {
  color: rgb(255, 118, 118);
}

:deep(.el-form-item) {
  padding: 15px 0;
  width: 400px;
}

.user-avatar {
  height: 140px;
  width: 100%;
  :deep(.el-form-item__error) {
    margin-left: 5rem;
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
}

:deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
