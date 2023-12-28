<script lang="ts" setup name="Tag">
import { ref } from "vue";
import { useColumns } from ".";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Add from "@iconify-icons/ep/circle-plus";

const tagFormRef = ref();

const {
  form,
  param,
  rules,
  loading,
  columns,
  dataList,
  tableSize,
  pagination,
  loadingConfig,
  dialogVisible,
  closeDialog,
  submitForm,
  onSearch,
  resetParam,
  onSizeChange,
  onCurrentChange,
  updateTag,
  deleteTag,
  deleteBatch,
  handleSelectionChange
} = useColumns();
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">标签管理</div>
    </template>
    <el-space class="float-right mb-4">
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">中</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-space>
    <el-form :inline="true" :model="param" class="bg-bg_color w-[99/100]">
      <el-form-item label="标签名称：" prop="username">
        <el-input
          v-model="param.tag_name"
          placeholder="请输入标签名称"
          clearable
          class="!w-[160px]"
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
    <el-space class="mb-4 w-[100%] flex justify-between items-center">
      <!-- <el-button type="primary" size="small" :icon="useRenderIcon(Upload)"
        >批量导入</el-button
      > -->
      <el-button
        type="danger"
        size="small"
        :icon="useRenderIcon(Delete)"
        @click="deleteBatch"
        >批量删除</el-button
      >
      <el-button
        class="reset-margin"
        type="primary"
        size="small"
        :icon="useRenderIcon(Add)"
        @click="updateTag"
        >新增</el-button
      >
    </el-space>

    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :size="tableSize"
      :loading="loading"
      :loading-config="loadingConfig"
      height="calc(100vh - 360px)"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ row }">
        <el-button
          class="reset-margin"
          link
          type="primary"
          size="small"
          @click="updateTag(row)"
          :icon="useRenderIcon(EditPen)"
        >
          修改
        </el-button>
        <el-popconfirm
          :title="`删除标签${row.tag_name}?`"
          icon-color="#66b1ff"
          @confirm="deleteTag(row)"
        >
          <template #reference>
            <el-button
              class="reset-margin"
              link
              type="danger"
              size="small"
              :icon="useRenderIcon(Delete)"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </pure-table>
    <el-dialog
      :title="form.id ? '编辑标签' : '新增标签'"
      v-model="dialogVisible"
      :width="480"
      draggable
      :before-close="closeDialog"
    >
      <el-form
        ref="tagFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标签名称" prop="tag_name">
          <el-input
            v-model="form.tag_name"
            :style="{ width: '380px' }"
            placeholder="请输入标签名称"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm(tagFormRef)">
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
</style>
