<script lang="ts" setup name="ArticleManage">
import { useColumns } from "./";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useStaticStoreHook } from "@/store/modules/static";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Add from "@iconify-icons/ep/circle-plus";
import Hide from "@iconify-icons/ep/hide";
import View from "@iconify-icons/ep/view";
const articleTab = useStaticStoreHook().articleTab;

const {
  param,
  loading,
  columns,
  tableData,
  tableImageList,
  tableSize,
  pagination,
  loadingConfig,
  tagOptionList,
  categoryOptionList,
  tabChange,
  resetParam,
  onSearch,
  onSizeChange,
  onCurrentChange,
  editArticle,
  addArticle,
  deleteArticleById,
  changeTop,
  revertArticleById,
  changeArticlePublic
} = useColumns();
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">文章管理</div>
    </template>
    <el-space class="float-right mb-4">
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button label="large">大</el-radio-button>
        <el-radio-button label="default">中</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
      </el-radio-group>
    </el-space>
    <el-form :inline="true" class="bg-bg_color">
      <el-form-item label="文章标题：">
        <el-input
          v-model="param.article_title"
          placeholder="请输入文章标题"
          clearable
        />
      </el-form-item>
      <el-form-item label="文章分类：">
        <el-select
          v-model="param.category_id"
          placeholder="请选择文章分类"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="(item, index) in categoryOptionList"
            :key="index"
            :label="item.category_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标签：" prop="status">
        <el-select
          v-model="param.tag_id"
          placeholder="请选择文章标签"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="(item, index) in tagOptionList"
            :key="index"
            :label="item.tag_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶：">
        <el-select
          v-model="param.is_top"
          placeholder="请选择是否置顶"
          clearable
          class="!w-[160px]"
        >
          <el-option label="是" value="1" />
          <el-option label="否" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-date-picker
          v-model="param.create_time"
          type="daterange"
          placeholder="请选择发布时间段"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
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
    <el-space>
      <!-- <el-button type="primary" size="small" :icon="useRenderIcon(Upload)"
        >批量导入</el-button
      > -->
      <!-- <el-button type="danger" size="small" :icon="useRenderIcon(Delete)"
        >批量删除</el-button
      > -->
      <el-button
        type="primary"
        size="small"
        :icon="useRenderIcon(Add)"
        @click="addArticle"
        >新增</el-button
      >
    </el-space>
    <el-tabs @tab-click="tabChange">
      <template v-for="item of articleTab" :key="item.key">
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
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
      <template #image="{ row, index }">
        <el-image
          preview-teleported
          loading="lazy"
          :src="row.article_cover"
          :preview-src-list="tableImageList.map(v => v)"
          :initial-index="index"
          fit="cover"
          class="w-[160px] h-[80px]"
        />
      </template>
      <template #isTop="{ row }">
        <el-switch
          v-model="row.is_top"
          :active-value="1"
          :inactive-value="2"
          @change="changeTop(row)"
        />
      </template>

      <template #operation="{ row }">
        <el-button
          class="reset-margin"
          link
          type="primary"
          size="small"
          @click="editArticle(row)"
          :icon="useRenderIcon(EditPen)"
        >
          修改
        </el-button>
        <el-popconfirm
          v-if="[1, 2].includes(Number(row.status))"
          :title="`确认 ${row.status == 1 ? '隐藏' : '公开'}文章?`"
          icon-color="#66b1ff"
          @confirm="changeArticlePublic(row.id, row.status)"
        >
          <template #reference>
            <el-button
              class="reset-margin"
              link
              type="success"
              size="small"
              :icon="
                row.status == 1 ? useRenderIcon(Hide) : useRenderIcon(View)
              "
            >
              {{ row.status == 1 ? "隐藏" : "公开" }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          :title="`确认删除文章${row.article_title}?`"
          icon-color="#66b1ff"
          @confirm="deleteArticleById(row.id, row.status, row.article_title)"
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
        <el-popconfirm
          v-if="row.status == 3"
          :title="`确认恢复文章${row.article_title}?`"
          icon-color="#66b1ff"
          @confirm="revertArticleById(row.id, row.article_title)"
        >
          <template #reference>
            <el-button
              class="reset-margin"
              link
              type="success"
              size="small"
              :icon="useRenderIcon(EditPen)"
            >
              恢复
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </pure-table>
  </el-card>
</template>
