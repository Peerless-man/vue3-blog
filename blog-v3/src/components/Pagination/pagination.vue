<template>
  <div class="pagination">
    <el-pagination
      background
      :layout="layout"
      :pager-count="pagerCount"
      :page-sizes="pageSizes"
      :page-size="size"
      :total="total"
      :currentPage="current"
      @size-change="sizeChange"
      @current-change="currentChange"
      @prev-click="prev"
      @next-click="next"
    ></el-pagination>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
  total: {
    type: Number,
    default: 0, //数据总数
  },
  pagerCount: {
    type: Number,
    default: 5, //如果页数很多大概展示的页码
  },
  layout: {
    type: String,
    default: "total,sizes, prev, pager, next, jumper, ->, slot", //分页组件会展示的功能项
  },
  pageSizes: {
    type: Array,
    default: () => {
      return [10, 20, 50]; //指定分页展示条数
    },
  },
  current: {
    type: Number,
    default: 1, //指定跳转到多少页
  },
  size: {
    type: Number,
    default: 1, //每页展示的条数，根据自己实际，且会带入请求
  },
});

let page = reactive({
  size: props.size,
  current: props.current,
});

const emit = defineEmits(["pagination"]);

//选择每页显示数量 Change page size
const sizeChange = (val) => {
  page.size = val;
  emit("pagination", page);
};
//选择某一页
const currentChange = (val) => {
  page.current = val;
  emit("pagination", page);
};
//上一页
const prev = (val) => {
  page.current = val - 1;
};
//下一页
const next = (val) => {
  page.current = val + 1;
};
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  padding: 10px 0;
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #00c4b6;
  color: var(--white);
  cursor: default;
  font-weight: 800;
}
:deep(.el-pager li) {
  font-weight: 600;
}
</style>
