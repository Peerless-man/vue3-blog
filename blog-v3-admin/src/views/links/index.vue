<script lang="ts" setup name="Links">
import { ref } from "vue";
import { useColumns } from ".";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Approve from "@iconify-icons/ep/finished";
import Upload from "@/components/Upload/upload.vue";

const linksFormRef = ref();

const {
  form,
  rules,
  param,
  loading,
  columns,
  dataList,
  tableSize,
  pagination,
  linksTab,
  loadingConfig,
  dialogVisible,
  closeDialog,
  submitForm,
  onSearch,
  tabChange,
  resetParam,
  onSizeChange,
  onCurrentChange,
  editLinks,
  approveBatch,
  deleteBatch,
  handleSelectionChange
} = useColumns();
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">友链管理</div>
    </template>
    <el-space class="float-right mb-4">
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">中</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-space>
    <el-form :inline="true" :model="param" class="bg-bg_color w-[99/100]">
      <el-form-item label="网站名称：" prop="username">
        <el-input
          v-model="param.site_name"
          placeholder="请输入网站名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请时间：" prop="username">
        <el-date-picker
          v-model="param.time"
          type="daterange"
          placeholder="请选择申请时间段"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetParam">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-space class="mb-4 w-[100%] flex items-center">
      <el-button
        type="danger"
        size="small"
        :icon="useRenderIcon(Delete)"
        @click="deleteBatch"
        >批量删除</el-button
      >
      <el-button
        v-if="param.status != 2"
        class="reset-margin"
        type="primary"
        size="small"
        :icon="useRenderIcon(Approve)"
        @click="approveBatch('batch')"
        >批量审核</el-button
      >
    </el-space>
    <el-tabs @tab-click="tabChange">
      <template v-for="item of linksTab" :key="item.key">
        <el-tab-pane :lazy="true">
          <template #label>
            <el-tooltip :content="item.content" placement="top-end">
              <span>{{ item.title }}</span>
            </el-tooltip>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :size="tableSize"
      :loading="loading"
      :loading-config="loadingConfig"
      height="calc(100vh - 400px)"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <template #site_avatar="{ row }">
        <el-avatar :src="row.site_avatar || row.url + '/favicon.ico'">{{
          row.site_name
        }}</el-avatar>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status == 1 ? 'warning' : 'success'">{{
          row.status == 1 ? "待审核" : "审核通过"
        }}</el-tag>
      </template>
      <template #operation="{ row }">
        <el-button
          class="reset-margin"
          link
          type="primary"
          size="small"
          @click="editLinks(row)"
          :icon="useRenderIcon(EditPen)"
        >
          修改
        </el-button>
        <el-button
          v-if="row.status == 1"
          class="reset-margin"
          link
          type="success"
          size="small"
          @click="approveBatch('single', row)"
          :icon="useRenderIcon(Approve)"
        >
          通过
        </el-button>
      </template>
    </pure-table>
    <el-dialog
      title="修改友链"
      v-model="dialogVisible"
      :width="480"
      draggable
      :before-close="closeDialog"
    >
      <el-form
        ref="linksFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="网站名称" prop="site_name">
          <el-input
            v-model="form.site_name"
            :style="{ width: '380px' }"
            placeholder="请输入网站名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="网站描述" prop="site_desc">
          <el-input
            v-model="form.site_desc"
            :style="{ width: '380px' }"
            placeholder="请输入网站描述"
            clearable
          />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input
            v-model="form.url"
            :style="{ width: '380px' }"
            placeholder="请输入网站地址"
            clearable
          />
        </el-form-item>
        <el-form-item class="user-avatar" label="网站头像" prop="site_avatar">
          <Upload
            v-model:fileList="form.avatarList"
            :width="80"
            :height="80"
            :limit="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm(linksFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.card {
  height: calc(100vh - 110px);
  overflow: auto;
}
.user-avatar {
  height: 80px;
  width: 80px;
  z-index: 999;

  :deep(.el-upload--picture-card) {
    width: 80px !important;
    height: 80px !important;
    border-radius: 40px !important;
  }

  :deep(.el-upload-list__item) {
    width: 80px !important;
    height: 80px !important;
    border-radius: 40px !important;
    margin: 0;
  }

  :deep(.el-upload-list--picture-card) {
    width: 80px !important;
    height: 80px !important;
    border-radius: 40px !important;
  }
}
</style>
