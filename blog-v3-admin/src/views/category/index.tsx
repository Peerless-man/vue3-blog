import { ref, reactive, onMounted } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";

import {
  getCategoryList,
  deleteCategoryList,
  addCategory,
  editCategory
} from "@/api/category";

export function useColumns() {
  const param = reactive({
    current: 1,
    size: 10,
    category_name: ""
  });
  const primaryParam = reactive({ ...param });
  const dialogVisible = ref(false);
  const dataList = ref([]);
  const loading = ref(false);
  const tableSize = ref("small");
  const selectList = ref<any>([]);
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      width: 30
    },
    {
      label: "序号",
      type: "index",
      width: 55
    },
    {
      label: "分类",
      prop: "category_name",
      minWidth: 130
    },
    {
      label: "创建日期",
      prop: "createdAt"
    },
    {
      label: "修改日期",
      prop: "updatedAt"
    },
    {
      label: "操作",
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];
  const form = reactive({
    id: "",
    category_name: ""
  });
  const primaryForm = reactive({ ...form });
  const rules = reactive({
    category_name: [
      { required: true, message: "请输入分类名称", trigger: "blur" }
    ]
  });

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 15, 20],
    total: 0,
    align: "right",
    background: true,
    small: true
  });

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第1页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    // svg: "",
    // background: rgba()
  });

  function onSearch() {
    getPageCategoryList();
  }
  const resetParam = () => {
    Object.assign(param, primaryParam);
    onSearch();
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };
  function handleSelectionChange(val) {
    selectList.value = val;
  }
  function onChange(val) {
    pagination.small = val;
  }

  function onSizeChange(val) {
    param.size = val;
    getPageCategoryList();
  }

  async function onCurrentChange(val) {
    if (typeof val == "number") {
      loadingConfig.text = `正在加载第${val}页...`;
      param.current = val;
      loading.value = true;
      getPageCategoryList();
    }
  }
  async function updateCategory(row) {
    dialogVisible.value = true;
    if (row) {
      Object.assign(form, row);
    }
  }
  async function deleteCategory(row) {
    const res = await deleteCategoryList({ categoryIdList: [row.id] });
    if (res.code == 0) {
      message(`删除分类${row.category_name}成功`, { type: "success" });
      getPageCategoryList();
    }
  }
  async function deleteBatch() {
    if (selectList.value.length) {
      const list = selectList.value.map(se => se.id);
      const res = await deleteCategoryList({ categoryIdList: list });
      if (res.code == 0) {
        message(`批量删除分类成功`, { type: "success" });
        getPageCategoryList();
      }
    } else {
      message("请先选择分类", { type: "warning" });
    }
  }
  function closeDialog() {
    Object.assign(form, primaryForm);
    dialogVisible.value = false;
  }
  async function submitForm(formEl) {
    if (!formEl) return;
    await formEl.validate(async valid => {
      if (valid) {
        let res;
        if (form.id) {
          res = await editCategory(form);
        } else {
          res = await addCategory(form);
        }
        if (res.code == 0) {
          message(`${form.id ? "修改" : "新增"}成功`, { type: "success" });
          dialogVisible.value = false;
          resetForm(formEl);
          Object.assign(form, primaryForm);
          getPageCategoryList();
        }
      }
    });
  }

  async function getPageCategoryList() {
    const res = await getCategoryList(param);
    if (res.code == 0) {
      dataList.value = res.result.list;
      pagination.total = res.result.total;
      loading.value = false;
    } else {
      loading.value = false;
    }
  }

  onMounted(() => {
    getPageCategoryList();
  });

  return {
    form,
    rules,
    param,
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
    resetForm,
    onChange,
    onSizeChange,
    onCurrentChange,
    updateCategory,
    deleteCategory,
    deleteBatch,
    handleSelectionChange,
    getPageCategoryList
  };
}
