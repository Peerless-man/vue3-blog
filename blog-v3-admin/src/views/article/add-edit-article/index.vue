<script lang="ts" setup name="AddEditArticle">
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import DocumentChecked from "@iconify-icons/ep/document-checked";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Upload from "@/components/Upload/upload.vue";

import { useArticle } from "./index";
const {
  coverUrl,
  articleForm,
  dialogVisible,
  tagOptionList,
  articleFormRef,
  articleFormRules,
  categoryOptionList,
  coverPreviewVisible,
  dialogArticleFormRef,
  dialogArticleFormRules,
  closeDialog,
  publish,
  submitForm,
  uploadImage,
  articleTitleVAlidate
} = useArticle();
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">{{ articleForm.id ? "编辑" : "新增" }}文章</div>
    </template>
    <el-form
      ref="articleFormRef"
      :inline="true"
      :model="articleForm"
      :rules="articleFormRules"
      class="bg-bg_color w-[99/100] h-[100%]"
      label-width="120"
    >
      <el-form-item
        style="width: 65%"
        label-width="80"
        label="文章标题"
        prop="article_title"
      >
        <el-input
          v-model="articleForm.article_title"
          placeholder="请输入文章标题"
          clearable
          maxlength="55"
          @change="articleTitleVAlidate"
        />
      </el-form-item>
      <el-form-item style="width: 25%">
        <div class="publish-btn">
          <el-button
            type="danger"
            size="small"
            :icon="useRenderIcon(DocumentChecked)"
            @click="publish(articleFormRef)"
            >{{ articleForm.id ? "修改文章" : "发布文章" }}</el-button
          >
        </div>
      </el-form-item>
      <el-form-item style="width: 100%; height: auto" prop="article_content">
        <MdEditor
          v-model="articleForm.article_content"
          @onUploadImg="uploadImage"
        />
      </el-form-item>
    </el-form>
    <el-dialog
      title="发布文章"
      v-model="dialogVisible"
      :width="800"
      draggable
      :fullscreen="true"
      :before-close="closeDialog"
    >
      <el-form
        ref="dialogArticleFormRef"
        :inline="true"
        :model="articleForm"
        :rules="dialogArticleFormRules"
        class="bg-bg_color w-[99/100]"
        label-width="120"
      >
        <el-form-item
          class="form-item100"
          label="文章标题"
          prop="article_title"
        >
          {{ articleForm.article_title }}
        </el-form-item>
        <el-form-item
          class="form-item100"
          label="文章描述"
          prop="article_description"
        >
          <el-input
            v-model="articleForm.article_description"
            placeholder="说点儿什么，太抽象了可不好"
            style="width: 70%"
            clearable
            type="textarea"
            maxlength="150"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 3 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="文章分类" prop="category_id">
          <el-select
            v-model="articleForm.category_id"
            :style="{ width: '380px' }"
            placeholder="请选择分类"
            filterable
            clearable
            allow-create
          >
            <el-option
              v-for="item in categoryOptionList"
              :key="item.value"
              :label="item.category_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签" prop="tagIdList">
          <el-select
            v-model="articleForm.tagIdList"
            :style="{ width: '380px' }"
            placeholder="请选择标签"
            multiple
            filterable
            clearable
            allow-create
            :multiple-limit="3"
          >
            <el-option
              v-for="item in tagOptionList"
              :key="item.value"
              :label="item.tag_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="form-item100 article-cover"
          label="文章缩略图"
          prop="coverList"
        >
          <Upload
            v-model:file-list="articleForm.coverList"
            :width="260"
            :height="150"
            :limit="1"
          />
        </el-form-item>
        <el-form-item class="form-item100" label="置顶">
          <el-switch
            v-model="articleForm.is_top"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="2"
          />
        </el-form-item>
        <el-form-item
          v-if="articleForm.is_top == 1"
          class="form-item100"
          label="排序"
          prop="order"
        >
          <el-input-number
            v-model="articleForm.order"
            placeholder="请输入排序"
            style="width: 20%"
            :min="1"
            :max="9999"
            :precision="0"
            :controls="false"
          />
        </el-form-item>
        <el-form-item class="form-item100" label="状态">
          <el-radio-group v-model="articleForm.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
            <el-radio :label="3">草稿箱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="form-item100" label="文章类型">
          <el-radio-group v-model="articleForm.type">
            <el-radio :label="1">原创</el-radio>
            <el-radio :label="2">转载</el-radio>
            <el-radio :label="3">翻译</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="[2, 3].includes(Number(articleForm.type))"
          class="form-item100"
          label="原文链接"
          prop="origin_url"
        >
          <el-input
            v-model="articleForm.origin_url"
            placeholder="请输入原文链接"
            style="width: 80%"
            clearable
            type="textarea"
            maxlength="225"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="closeDialog()">取消</el-button>
        <el-button
          size="small"
          type="danger"
          plain
          @click="submitForm(dialogArticleFormRef, 1)"
        >
          保存草稿
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="submitForm(dialogArticleFormRef, 2)"
        >
          {{ articleForm.id ? "修改文章" : "发布文章" }}
        </el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="coverPreviewVisible">
      <img w-full :src="coverUrl" alt="Preview Image" />
    </el-dialog>
  </el-card>
</template>
<style lang="scss" scoped>
.card {
  height: calc(100vh - 110px);
  overflow: hidden;
}
.publish-btn {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.flex_r {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.form-item {
  &45 {
    width: 45%;
    font-weight: bold;
  }

  &100 {
    width: 100%;
    font-weight: bold;
  }
}

:deep(.el-select-dropdown__item) {
  padding: 0 5px;
}

:deep(.el-dialog.is-fullscreen) {
  width: 800px;
  overflow-y: auto;
  overflow-x: hidden;
}

:deep(.el-dialog__footer) {
  position: absolute;
  bottom: 0;
  right: 5%;
}

.md-editor {
  height: calc(100vh - 260px);
}

.article-cover {
  :deep(.el-form-item__content) {
    width: 260px !important;
    height: 150px !important;
  }

  :deep(.el-upload-list__item) {
    width: 260px !important;
    height: 150px !important;
    margin: 0 !important;
    border: none !important;
  }

  :deep(.el-upload--picture-card) {
    width: 260px !important;
    height: 150px !important;
  }

  :deep(.el-upload-list--picture-card) {
    width: 260px !important;
    height: 150px !important;
    margin: 0 !important;
    border: none !important;
  }
}
</style>
