import { ref, reactive, onMounted } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { useStaticStoreHook } from "@/store/modules/static";
import { ElLoading } from "element-plus";
import { imgUpload } from "@/api/site";

import {
  getLinksList,
  approveLinks,
  updateLinks,
  deleteLinks
} from "@/api/links";
import { ElMessageBox } from "element-plus";

const urlV = (rule, value, cb) => {
  if (!value) {
    return cb(new Error("请输入网站地址"));
  } else if (value.indexOf("http") == -1) {
    return cb(new Error("请输入带http://或https://的网站地址"));
  } else {
    cb();
  }
};

export function useColumns() {
  const param = reactive<any>({
    current: 1,
    size: 10,
    time: "",
    status: "",
    site_name: ""
  });
  const linksTab = useStaticStoreHook().linksTab;
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
      label: "网站头像",
      prop: "site_avatar",
      slot: "site_avatar",
      width: 80
    },
    {
      label: "网站名称",
      prop: "site_name"
    },
    {
      label: "网站描述",
      prop: "site_desc"
    },
    {
      label: "网站地址",
      prop: "url"
    },
    {
      label: "状态",
      prop: "status",
      slot: "status"
    },
    {
      label: "申请日期",
      prop: "createdAt"
    },
    {
      label: "通过日期",
      prop: "updatedAt"
    },
    {
      label: "操作",
      fixed: "right",
      minWidth: 120,
      slot: "operation"
    }
  ];
  const form = reactive({
    id: "",
    site_name: "",
    site_desc: "",
    url: "",
    site_avatar: "",
    avatarList: []
  });
  const primaryForm = reactive({ ...form });
  const rules = reactive({
    site_name: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
    site_desc: [{ required: true, message: "请输入网站描述", trigger: "blur" }],
    url: [{ required: true, validator: urlV, trigger: "blur" }]
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
    getPageLinksList();
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

  function onSizeChange(val) {
    param.size = val;
    getPageLinksList();
  }
  function tabChange(val: any) {
    param.status = val.index ? Number(val.index) : null;
    getPageLinksList();
  }

  async function onCurrentChange(val) {
    if (typeof val == "number") {
      loadingConfig.text = `正在加载第${val}页...`;
      param.current = val;
      loading.value = true;
      getPageLinksList();
    }
  }

  // 批量审核友链
  function approveBatch(type = "batch", row?) {
    if (type == "single") {
      if (row.id) {
        ElMessageBox.confirm("确认审核通过？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }).then(async () => {
          const list = [row.id];
          const res = await approveLinks({ idList: list });
          if (res.code == 0) {
            message(`审核友链成功`, { type: "success" });
            getPageLinksList();
          }
        });
      }
    } else if (type == "batch") {
      if (selectList.value.length) {
        ElMessageBox.confirm("确认审核通过？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }).then(async () => {
          const list = selectList.value.map(se => se.id);
          const res = await approveLinks({ idList: list });
          if (res.code == 0) {
            message(`批量审核友链成功`, { type: "success" });
            getPageLinksList();
          }
        });
      } else {
        message("请先选择友链", { type: "warning" });
      }
    }
  }

  // 批量删除友链接
  function deleteBatch() {
    if (selectList.value.length) {
      ElMessageBox.confirm("确认删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(async () => {
        const list = selectList.value.map(se => se.id);
        const res = await deleteLinks({ idList: list });
        if (res.code == 0) {
          message(`批量删除友链成功`, { type: "success" });
          getPageLinksList();
        }
      });
    } else {
      message("请先选择友链", { type: "warning" });
    }
  }

  function closeDialog() {
    Object.assign(form, primaryForm);
    dialogVisible.value = false;
  }

  const editLinks = row => {
    Object.assign(form, row);
    if (row.site_avatar) {
      form.avatarList = [
        {
          id: 1,
          url: row.site_avatar
        }
      ];
    }
    dialogVisible.value = true;
  };

  async function submitForm(formEl) {
    if (!formEl) return;
    await formEl.validate(async valid => {
      if (valid) {
        if (form.avatarList.length) {
          if (!form.avatarList[0].id) {
            const upLoadLoading = ElLoading.service({
              fullscreen: true,
              text: "图片上传中"
            });
            const res = await imgUpload(form.avatarList[0]);
            if (res.code == 0) {
              const { url } = res.result;
              form.site_avatar = url;
            }
            upLoadLoading.close();
          } else {
            form.site_avatar = form.avatarList[0].url;
          }
        } else {
          form.site_avatar = "";
        }
        const res = await updateLinks(form);
        if (res.code == 0) {
          message("修改成功", { type: "success" });
          dialogVisible.value = false;
          resetForm(formEl);
          Object.assign(form, primaryForm);
          getPageLinksList();
        }
      }
    });
  }

  async function getPageLinksList() {
    const res = await getLinksList(param);
    if (res.code == 0) {
      dataList.value = res.result.list;
      pagination.total = res.result.total;
      loading.value = false;
    } else {
      loading.value = false;
    }
  }

  onMounted(() => {
    getPageLinksList();
  });

  return {
    form,
    rules,
    param,
    loading,
    columns,
    linksTab,
    dataList,
    tableSize,
    pagination,
    loadingConfig,
    dialogVisible,
    closeDialog,
    submitForm,
    onSearch,
    tabChange,
    resetParam,
    resetForm,
    onSizeChange,
    onCurrentChange,
    editLinks,
    approveBatch,
    deleteBatch,
    handleSelectionChange,
    getPageLinksList
  };
}
