import { ref, reactive, onMounted } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { ElLoading } from "element-plus";
import { getUserList, updateUserRole, adminUpdateUserInfo } from "@/api/user";
import { imgUpload } from "@/api/site";

export function useColumns() {
  const param = reactive({
    current: 1,
    size: 10,
    nick_name: "", // 昵称
    role: null // 用户角色
  });
  const primaryParam = reactive({ ...param });
  const dataList = ref([]);
  const loading = ref(false);
  const tableSize = ref("small");
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 55
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 100
    },
    {
      label: "用户昵称",
      prop: "nick_name",
      minWidth: 120
    },
    {
      label: "头像",
      prop: "avatar",
      minWidth: 100,
      slot: "avatar"
    },
    {
      label: "角色",
      prop: "role",
      minWidth: 180,
      slot: "role"
    },
    {
      label: "IP",
      prop: "ip_address",
      minWidth: 180
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
      width: 80,
      slot: "operation"
    }
  ];

  const form = reactive({
    id: "",
    nick_name: "",
    avatar: "",
    avatarList: []
  });

  const primaryForm = reactive({ ...form });
  const formRules = reactive({
    nick_name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
  });
  const dialogVisible = ref(false);

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
    getPageUserList();
  }
  const resetParam = () => {
    Object.assign(param, primaryParam);
    onSearch();
  };

  function onSizeChange(val) {
    param.size = val;
    getPageUserList();
  }

  async function onCurrentChange(val) {
    if (typeof val == "number") {
      loadingConfig.text = `正在加载第${val}页...`;
      param.current = val;
      loading.value = true;
      getPageUserList();
    }
  }

  async function getPageUserList() {
    const res = await getUserList(param);
    if (res.code == 0) {
      dataList.value = res.result.list;
      pagination.total = res.result.total;
      loading.value = false;
    } else {
      loading.value = false;
    }
  }
  async function changeRole(user) {
    const { id, role } = user;

    const res = await updateUserRole(id, role == 1 ? 2 : 1);
    if (res.code == 0) {
      message("修改用户角色成功", { type: "success" });
      getPageUserList();
    }
  }

  const editUser = row => {
    Object.assign(form, row);
    if (row.avatar) {
      form.avatarList = [
        {
          id: 1,
          url: row.avatar
        }
      ];
    }
    dialogVisible.value = true;
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  function closeDialog() {
    Object.assign(form, primaryForm);
    dialogVisible.value = false;
  }

  async function submitForm(formEl) {
    if (!formEl) return;
    await formEl.validate(async valid => {
      if (valid) {
        // 先上传图片
        if (form.avatarList.length) {
          if (!form.avatarList[0].id) {
            const upLoadLoading = ElLoading.service({
              fullscreen: true,
              text: "图片上传中"
            });
            const res = await imgUpload(form.avatarList[0]);
            if (res.code == 0) {
              const { url } = res.result;
              form.avatar = url;
            }
            upLoadLoading.close();
          } else {
            form.avatar = form.avatarList[0].url;
          }
        } else {
          form.avatar = "";
        }
        // 修改用户
        const { id, nick_name, avatar } = form;
        const res = await adminUpdateUserInfo({ id, nick_name, avatar });
        if (res.code == 0) {
          message("修改成功", { type: "success" });
          dialogVisible.value = false;
          resetForm(formEl);
          Object.assign(form, primaryForm);
          getPageUserList();
        }
      }
    });
  }

  onMounted(() => {
    getPageUserList();
  });

  return {
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
    onCurrentChange,
    getPageUserList
  };
}
