import { ref, onMounted, reactive } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { useRouter } from "vue-router";
import {
  getArticleList,
  updateArticleTop,
  revertArticle,
  deleteArticle,
  isArticlePublic
} from "@/api/article";
import { getCategoryDictionary } from "@/api/category";
import { getTagDictionary } from "@/api/tag";
import { message } from "@/utils/message";

export function useColumns() {
  const router = useRouter();

  const param = reactive({
    current: 1,
    size: 10,
    article_title: null,
    tag_id: null,
    category_id: null,
    is_top: null,
    status: null,
    create_time: null
  });
  const primaryParam = reactive({ ...param });
  const tableImageList = ref([]);
  const tableData = ref([]);
  const categoryOptionList = ref([]);
  const tagOptionList = ref([]);
  const loading = ref(false);
  const tableSize = ref("small");

  const columns: TableColumnList = [
    // {
    //   type: "selection",
    //   align: "left"
    // },
    {
      label: "序号",
      type: "index",
      width: 55
    },
    {
      label: "文章标题",
      prop: "article_title",
      minWidth: 130
    },
    {
      label: "文章描述",
      prop: "article_description",
      minWidth: 130
    },
    {
      label: "分类",
      prop: "category",
      cellRenderer: ({ row }) => <el-tag>{row.categoryName}</el-tag>
    },
    {
      label: "标签",
      prop: "tagNameList",
      minWidth: 220,
      cellRenderer: ({ row }) =>
        row.tagNameList.map(tagName => (
          <el-tag style="margin-left: 3px;">{tagName}</el-tag>
        ))
    },
    {
      label: "封面",
      prop: "article_cover",
      width: 200,
      slot: "image"
    },
    {
      label: "是否置顶",
      prop: "is_top",
      slot: "isTop"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 80,
      cellRenderer: ({ row }) => (
        <span>
          {row.status == 1 ? "公开" : row.status == 2 ? "私密" : "草稿箱"}
        </span>
      )
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 80,
      cellRenderer: ({ row }) => (
        <span>
          {row.type === 1 ? "原创" : row.type === 2 ? "转载" : "私密"}
        </span>
      )
    },
    {
      label: "发布日期",
      prop: "createdAt"
    },
    {
      label: "修改日期",
      prop: "updatedAt"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

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
    text: "正在加载第一页...",
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
  // tabChange
  const tabChange = (val: any) => {
    param.status = val.index ? Number(val.index) : null;
    pageGetArticleList();
  };
  // 搜
  function onSearch() {
    pageGetArticleList();
  }

  // 重置参数
  const resetParam = () => {
    Object.assign(param, primaryParam);
    pageGetArticleList();
  };

  // 修改文章置顶信息
  async function changeTop(val) {
    if (val) {
      const { id, is_top } = val;
      const res = await updateArticleTop(id, is_top);
      if (res.code == 0) {
        message(`${is_top == 1 ? "置顶" : "取消置顶"} 成功`, {
          type: "success"
        });
      }
    }
  }

  // 恢复文章
  async function revertArticleById(id, article_title) {
    if (id) {
      const res = await revertArticle(id);
      if (res.code == 0) {
        message(`恢复文章 ${article_title}成功`, { type: "success" });
      }
      pageGetArticleList();
    }
  }
  // 公开隐藏文章
  async function changeArticlePublic(id, status) {
    const res = await isArticlePublic(id, status);
    if (res.code == 0) {
      message(`${status == 1 ? "隐藏" : "公开"} 文章成功`, { type: "success" });
    }
    pageGetArticleList();
  }

  function onSizeChange(val) {
    param.size = val;
    pageGetArticleList();
  }

  function onCurrentChange(val) {
    if (typeof val == "number") {
      loadingConfig.text = `正在加载第${val}页...`;
      param.current = val;
      pageGetArticleList();
    }
  }
  function editArticle(row) {
    router.push({ path: "/article/editArticle", query: { articleId: row.id } });
  }
  function addArticle() {
    router.push({ path: "/article/addArticle" });
  }

  // 通过id删除文章
  async function deleteArticleById(id, status, article_title) {
    const res = await deleteArticle(id, status);
    if (res.code == 0) {
      if (status == 3) {
        message(`删除文章 ${article_title}成功`, { type: "success" });
      } else {
        message(`文章 ${article_title}已进入回收站`, { type: "success" });
      }
      pageGetArticleList();
    }
  }

  // 分页获取文章
  async function pageGetArticleList() {
    loading.value = true;
    const res = await getArticleList(param);

    if (res.code == 0) {
      tableData.value = res.result.list;
      pagination.total = res.result.total;
      tableImageList.value = [];
      tableImageList.value = tableData.value.map(v => {
        return v.article_cover;
      });
    }
    loading.value = false;
  }

  async function getTagD() {
    const res = await getTagDictionary();
    if (res.code == 0) {
      tagOptionList.value = res.result;
    }
  }
  async function getCategoryD() {
    const res = await getCategoryDictionary();
    if (res.code == 0) {
      categoryOptionList.value = res.result;
    }
  }

  onMounted(async () => {
    // 获取文章列表
    await pageGetArticleList();

    // 获取选择列表
    await getCategoryD();
    await getTagD();
  });

  return {
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
  };
}
