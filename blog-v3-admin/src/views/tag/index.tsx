import { ref, reactive, onMounted } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";

import { getTagList, deleteTagList, addTag, editTag } from "@/api/tag";

export function useColumns() {
  const param = reactive({
    current: 1,
    size: 10,
    tag_name: ""
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
      label: "标签",
      prop: "tag_name",
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
    tag_name: ""
  });
  const primaryForm = reactive({ ...form });
  const rules = reactive({
    tag_name: [{ required: true, message: "请输入标签名称", trigger: "blur" }]
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
    getPageTagList();
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
    getPageTagList();
  }

  async function onCurrentChange(val) {
    if (typeof val == "number") {
      loadingConfig.text = `正在加载第${val}页...`;
      param.current = val;
      loading.value = true;
      getPageTagList();
    }
  }
  async function updateTag(row) {
    dialogVisible.value = true;
    if (row) {
      Object.assign(form, row);
    }
  }
  async function deleteTag(row) {
    const res = await deleteTagList({ tagIdList: [row.id] });
    if (res.code == 0) {
      message(`删除标签${row.tag_name}成功`, { type: "success" });
      getPageTagList();
    }
  }
  async function deleteBatch() {
    if (selectList.value.length) {
      const list = selectList.value.map(se => se.id);
      const res = await deleteTagList({ tagIdList: list });
      if (res.code == 0) {
        message(`批量删除标签成功`, { type: "success" });
        getPageTagList();
      }
    } else {
      message("请先选择标签", { type: "warning" });
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
          res = await editTag(form);
        } else {
          res = await addTag(form);
        }
        if (res.code == 0) {
          message(`${form.id ? "修改" : "新增"}成功`, { type: "success" });
          dialogVisible.value = false;
          resetForm(formEl);
          Object.assign(form, primaryForm);
          getPageTagList();
        }
      }
    });
  }

  async function getPageTagList() {
    const res = await getTagList(param);
    if (res.code == 0) {
      dataList.value = res.result.list;
      pagination.total = res.result.total;
      loading.value = false;
    } else {
      loading.value = false;
    }
  }

  onMounted(() => {
    getPageTagList();
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
    updateTag,
    deleteTag,
    deleteBatch,
    handleSelectionChange,
    getPageTagList
  };
}
