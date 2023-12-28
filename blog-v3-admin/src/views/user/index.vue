<script lang="ts" setup name="User">
import { ref } from "vue";
import { useColumns } from ".";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import EditPen from "@iconify-icons/ep/edit-pen";
import Upload from "@/components/Upload/upload.vue";

const userFormRef = ref(null);

const {
  form,
  param,
  loading,
  columns,
  dataList,
  formRules,
  tableSize,
  pagination,
  dialogVisible,
  loadingConfig,
  onSearch,
  editUser,
  changeRole,
  submitForm,
  resetParam,
  closeDialog,
  onSizeChange,
  onCurrentChange
} = useColumns();
</script>

<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">用户管理</div>
    </template>
    <el-space class="float-right mb-4">
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">中</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-space>
    <el-form :inline="true" :model="param" class="bg-bg_color w-[99/100]">
      <el-form-item label="用户昵称：" prop="nick_name">
        <el-input
          v-model="param.nick_name"
          placeholder="请输入用户昵称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="用户角色：" prop="nick_name">
        <el-select
          v-model="param.role"
          placeholder="选择用户角色"
          clearable
          class="!w-[180px]"
        >
          <el-option label="管理员" :value="1" />
          <el-option label="普通用户" :value="2" />
        </el-select>
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

    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :size="tableSize"
      :loading="loading"
      :loading-config="loadingConfig"
      height="calc(100vh - 300px)"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
      <template #avatar="{ row }">
        <el-avatar
          :size="45"
          :src="
            row.avatar ||
            'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          "
        />
      </template>
      <template #role="{ row }">
        <el-switch
          :value="row.role"
          :active-value="1"
          :inactive-value="2"
          active-text="管理员"
          inactive-text="普通用户"
          @change="changeRole(row)"
        />
      </template>
      <template #operation="{ row }">
        <el-button
          class="reset-margin"
          link
          type="primary"
          size="small"
          :icon="useRenderIcon(EditPen)"
          @click="editUser(row)"
        >
          修改
        </el-button>
      </template>
    </pure-table>
    <el-dialog
      title="编辑用户"
      v-model="dialogVisible"
      :width="480"
      draggable
      :before-close="closeDialog"
    >
      <el-form
        ref="userFormRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="昵称" prop="nick_name">
          <el-input
            v-model="form.nick_name"
            :style="{ width: '380px' }"
            placeholder="请输入用户昵称"
            clearable
          />
        </el-form-item>
        <el-form-item class="user-avatar" label="头像">
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
        <el-button type="primary" @click="submitForm(userFormRef)">
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
  margin-left: 30px;
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
