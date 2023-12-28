<script setup lang="ts" name="Personal">
import { ref } from "vue";
import { useSite } from "./index";
import Upload from "@/components/Upload/upload.vue";

const myInfoFormRef = ref();
const passwordFormRef = ref();

const {
  myInfoForm,
  myInfoRules,
  passwordForm,
  passwordRules,
  isEditMyInfo,
  isEditPassword,
  edit,
  save,
  cancel
} = useSite();
</script>

<template>
  <div class="flex justify-between personal-card">
    <el-card class="left">
      <template #header>
        <div class="header">
          个人信息管理
          <div v-if="isEditMyInfo">
            <el-button type="info" plain @click="cancel('info', myInfoFormRef)"
              >取消</el-button
            >
            <el-button plain type="danger" @click="save('info', myInfoFormRef)"
              >保存</el-button
            >
          </div>
          <el-button v-else type="primary" plain @click="edit('info')"
            >编辑</el-button
          >
        </div>
      </template>
      <el-form
        label-width="100"
        ref="myInfoFormRef"
        :model="myInfoForm"
        :rules="myInfoRules"
      >
        <el-form-item class="user-avatar" label="个人头像">
          <Upload
            v-model:fileList="myInfoForm.avatarList"
            :limit="1"
            :width="80"
            :height="80"
            :preview="!isEditMyInfo"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input
            v-if="isEditMyInfo"
            v-model="myInfoForm.nick_name"
            placeholder="请输入昵称"
            maxlength="20"
            clearable
          />
          <span v-else>{{ myInfoForm.nick_name }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="right">
      <template #header>
        <div class="header">
          密码管理
          <div v-if="isEditPassword">
            <el-button type="info" plain @click="cancel('psd', passwordFormRef)"
              >取消</el-button
            >
            <el-button plain type="danger" @click="save('psd', passwordFormRef)"
              >保存</el-button
            >
          </div>
          <el-button v-else type="primary" plain @click="edit('psd')"
            >编辑</el-button
          >
        </div>
      </template>
      <el-form
        ref="passwordFormRef"
        label-width="120"
        :model="passwordForm"
        :rules="passwordRules"
      >
        <el-form-item label="原密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="passwordForm.password"
            placeholder="请输入原密码"
            minlength="4"
            maxlength="16"
            clearable
          />
        </el-form-item>
        <el-form-item label="新密码" prop="password1">
          <el-input
            show-password
            v-model="passwordForm.password1"
            placeholder="请输入新密码"
            minlength="4"
            maxlength="16"
            clearable
          />
        </el-form-item>
        <el-form-item label="二次确认密码" prop="password2">
          <el-input
            show-password
            v-model="passwordForm.password2"
            placeholder="请二次确认新密码"
            minlength="4"
            maxlength="16"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hide-upload {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

.personal-card {
  height: calc(100vh - 110px);

  .left {
    .user-avatar {
      margin-left: 30px;
    }
  }
}

.user-avatar {
  margin-left: 30px;
  height: 80px;
  width: 80px;
  z-index: 999;

  :deep(.el-upload-list__item) {
    width: 80px !important;
    height: 80px !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 80px;
  }

  :deep(.el-upload-list--picture-card) {
    width: 80px !important;
    height: 80px !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 80px;
  }

  :deep(.el-upload--picture-card) {
    width: 80px !important;
    height: 80px !important;
    border-radius: 80px;
  }
}

:deep(.el-card__body) {
  height: 90%;
}

@media screen and (min-width: 798px) {
  .personal-card {
    display: flex;
    justify-content: flex-start;
  }

  .left {
    width: 40%;
    height: 100%;
  }

  .right {
    margin-left: 20px;
    width: 40%;
    height: 100%;
  }
}

@media screen and (max-width: 798px) {
  .personal-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .left {
    width: 100%;
    height: 50%;
  }

  .right {
    margin-top: 20px;
    width: 100%;
    height: 50%;
  }
}
</style>
