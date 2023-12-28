<script lang="ts" setup name="Message">
import { useColumns } from ".";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";

const {
  param,
  loading,
  columns,
  dataList,
  tableSize,
  pagination,
  loadingConfig,
  onSearch,
  resetParam,
  onSizeChange,
  onCurrentChange,
  deleteBatch,
  handleSelectionChange
} = useColumns();
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">留言管理</div>
    </template>
    <el-space class="float-right mb-4">
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">中</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-space>
    <el-form :inline="true" :model="param" class="bg-bg_color w-[99/100]">
      <el-form-item label="留言内容：" prop="username">
        <el-input
          v-model="param.message"
          placeholder="请输入留言内容"
          clearable
        />
      </el-form-item>
      <el-form-item label="留言时间：" prop="username">
        <el-date-picker
          v-model="param.time"
          type="daterange"
          placeholder="请选择留言时间段"
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
    <el-space class="mb-4 w-[100%] flex justify-between items-center">
      <el-button
        type="danger"
        size="small"
        :icon="useRenderIcon(Delete)"
        @click="deleteBatch"
        >批量删除</el-button
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
      height="calc(100vh - 350px)"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <template #avatar="{ row }">
        <el-avatar :src="row.avatar">{{ row.nick_name }}</el-avatar>
      </template>
      <template #type="{ row }">
        <el-tag
          :type="row.type == 'qq' ? '' : row.type == 'wx' ? 'success' : 'info'"
          >{{ row.type }}</el-tag
        >
        <span class="ml-[5px]">{{ row.contact }}</span>
      </template>
    </pure-table>
  </el-card>
</template>

<style lang="scss" scoped>
.card {
  height: calc(100vh - 110px);
  overflow: auto;
}
</style>
