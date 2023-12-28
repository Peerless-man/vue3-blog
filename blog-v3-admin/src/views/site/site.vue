<script setup lang="ts" name="Site">
import { ref } from "vue";
import { useSite } from "./index";
import Upload from "@/components/Upload/upload.vue";

const siteInfoFormRef = ref();

const {
  loading,
  siteInfoForm,
  siteInfoRules,
  isEditSiteInfo,
  edit,
  save,
  cancel
} = useSite();
</script>

<template>
  <el-form
    label-width="80"
    ref="siteInfoFormRef"
    :model="siteInfoForm"
    :rules="siteInfoRules"
  >
    <el-row :gutter="10">
      <el-col :sm="24" :md="12">
        <el-card class="site-card">
          <template #header>
            <div class="header">
              博客信息管理
              <div v-if="isEditSiteInfo">
                <el-button
                  type="info"
                  plain
                  @click="cancel('site', siteInfoFormRef)"
                  >取消</el-button
                >
                <el-button
                  plain
                  type="danger"
                  :disabled="loading"
                  :loading="loading"
                  @click="save('site', siteInfoFormRef)"
                  >保存</el-button
                >
              </div>
              <el-button v-else type="primary" plain @click="edit('site')"
                >编辑</el-button
              >
            </div>
          </template>

          <el-form-item class="avatar-form" prop="blog_avatar">
            <div class="bg-upload">
              <Upload
                v-model:fileList="siteInfoForm.bgList"
                :limit="1"
                :preview="!isEditSiteInfo"
                :width="300"
                :height="140"
              />
            </div>
            <div class="avatar-upload">
              <Upload
                v-model:fileList="siteInfoForm.avatarList"
                :limit="1"
                :preview="!isEditSiteInfo"
                :width="60"
                :height="60"
              />
            </div>
          </el-form-item>
          <el-form-item label="博客名称" prop="blog_name">
            <el-input
              v-if="isEditSiteInfo"
              v-model="siteInfoForm.blog_name"
              clearable
              placeholder="请输入博客名称"
              maxlength="20"
            />
            <span v-else>{{ siteInfoForm.blog_name }}</span>
          </el-form-item>
          <el-form-item label="个性签名" prop="personal_say">
            <el-input
              v-if="isEditSiteInfo"
              type="textarea"
              v-model="siteInfoForm.personal_say"
              clearable
              placeholder="请输入个性签名"
              maxlength="225"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
            />
            <span v-else>{{ siteInfoForm.personal_say || "暂无个签" }}</span>
          </el-form-item>
          <el-form-item label="码云" prop="git_ee_link">
            <el-input
              v-if="isEditSiteInfo"
              v-model="siteInfoForm.git_ee_link"
              placeholder="请输入gitee链接"
              clearable
              maxlength="225"
            />
            <span v-else>{{ siteInfoForm.git_ee_link || "暂无gitee" }}</span>
          </el-form-item>
          <el-form-item label="B站">
            <el-input
              v-if="isEditSiteInfo"
              v-model="siteInfoForm.bilibili_link"
              placeholder="请输入bilibili链接"
              clearable
              maxlength="225"
            />
            <span v-else>{{
              siteInfoForm.bilibili_link || "暂无bilibili"
            }}</span>
          </el-form-item>
          <el-form-item label="github">
            <el-input
              v-if="isEditSiteInfo"
              v-model="siteInfoForm.github_link"
              placeholder="请输入github链接"
              clearable
              maxlength="225"
            />
            <span v-else>{{ siteInfoForm.github_link || "暂无github" }}</span>
          </el-form-item>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="12">
        <el-card class="site-card site-card2">
          <el-form-item class="link-cover" label="企鹅">
            <Upload
              v-model:fileList="siteInfoForm.qqCoverList"
              :width="80"
              :height="80"
              :preview="!isEditSiteInfo"
              :limit="1"
            />
          </el-form-item>
          <el-form-item class="link-cover" label="微信">
            <Upload
              v-model:fileList="siteInfoForm.weChatCoverList"
              :width="80"
              :height="80"
              :preview="!isEditSiteInfo"
              :limit="1"
            />
          </el-form-item>
          <el-form-item class="link-cover" label="企鹅群组">
            <Upload
              v-model:fileList="siteInfoForm.qqGroupList"
              :width="80"
              :height="80"
              :preview="!isEditSiteInfo"
              :limit="1"
            />
          </el-form-item>
          <el-form-item class="link-cover" label="微信群组">
            <Upload
              v-model:fileList="siteInfoForm.weChatGroupList"
              :width="80"
              :height="80"
              :preview="!isEditSiteInfo"
              :limit="1"
            />
          </el-form-item>
          <el-form-item class="link-cover" label="绿宝宝">
            <Upload
              v-model:fileList="siteInfoForm.weChatPayGroupList"
              :width="80"
              :height="80"
              :preview="!isEditSiteInfo"
              :limit="1"
            />
          </el-form-item>
          <el-form-item class="link-cover" label="蓝宝宝">
            <Upload
              v-model:fileList="siteInfoForm.aliPayGroupList"
              :width="80"
              :height="80"
              :preview="!isEditSiteInfo"
              :limit="1"
            />
          </el-form-item>
          <el-form-item label="博客公告">
            <el-input
              v-if="isEditSiteInfo"
              type="textarea"
              v-model="siteInfoForm.blog_notice"
              placeholder="请输入博客公告"
              maxlength="225"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
            />
            <span v-else>{{ siteInfoForm.blog_notice || "暂无公告" }}</span>
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
.flex_row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-card {
  height: calc(100vh - 110px);
  position: relative;

  :deep(.el-card__body) {
    height: 100%;
    overflow: auto;
  }

  .avatar-form {
    height: 160px;
    margin-left: -50px;
  }

  .site-avatar {
    margin: 100px 0 0 30px;
    z-index: 999;
  }

  .site-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 140px;
  }
}

.hide-upload {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

.bg-upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  :deep(.el-upload--picture-card) {
    width: 300px;
    height: 140px;
  }

  :deep(.el-upload-list__item) {
    width: 300px;
    height: 140px;
    border: none;
  }

  :deep(.el-upload-list--picture-card) {
    width: 300px;
    height: 140px;
    border: none;
  }
}

.avatar-upload {
  margin: 100px 0 0 30px;
  height: 60px;
  width: 60px;

  :deep(.el-upload--picture-card) {
    width: 60px !important;
    height: 60px !important;
    border-radius: 30px !important;
  }

  :deep(.el-upload-list__item) {
    width: 60px !important;
    height: 60px !important;
    border-radius: 30px !important;
    margin: 0;
  }

  :deep(.el-upload-list--picture-card) {
    width: 60px !important;
    height: 60px !important;
    border-radius: 30px !important;
  }
}

.link-cover {
  :deep(.el-form-item__content) {
    height: 80px;
  }

  :deep(.el-upload-list__item) {
    width: 80px !important;
    height: 80px !important;
    margin: 0 !important;
    border: none !important;
  }

  :deep(.el-upload--picture-card) {
    width: 80px !important;
    height: 80px !important;
  }

  :deep(.el-upload-list--picture-card) {
    width: 80px !important;
    height: 80px !important;
  }
}

:deep(.el-card__body) {
  height: 90%;
}

@media screen and (max-width: 798px) {
  .site-card2 {
    margin-top: 10px;
  }
}
</style>
