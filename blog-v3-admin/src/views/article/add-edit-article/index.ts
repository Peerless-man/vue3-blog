import { ref, onMounted, reactive } from "vue";
import { message } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import { getCategoryDictionary } from "@/api/category";
import { getTagDictionary } from "@/api/tag";
import {
  addArticle,
  editArticle,
  getArticleById,
  titleExist
} from "@/api/article";
import { imgUpload, mdImgUpload } from "@/api/site";
import { tagV, coverV } from "./validator";
import { ElLoading } from "element-plus";
import { useNav } from "@/layout/hooks/useNav";

export function useArticle() {
  const { userId } = useNav();
  const dialogVisible = ref(false);
  const articleFormRef = ref();
  const dialogArticleFormRef = ref();
  const route = useRoute();
  const router = useRouter();
  const canPublish = ref(true);

  const articleForm = reactive({
    id: "",
    article_title: "",
    category: {},
    category_id: null,
    tagIdList: [],
    tagList: [],
    author_id: 0,
    article_content: "",
    article_cover: "",
    is_top: 2, // 置顶 1 置顶 2 取消置顶
    order: 1, // 置顶文章的排序
    status: 1, // 状态 1 公开 2 私密 3 回收站（相当于草稿）
    type: 1, // 类型 1 原创 2 翻译 3 转载
    origin_url: "", // 原文链接 翻译或转载才需要填
    coverList: [],
    article_description: "" // 文章描述
  });

  const tagOptionList = ref([]);
  const categoryOptionList = ref([]);

  const coverPreviewVisible = ref(false);
  const coverUrl = ref(null);

  // 校验规则
  const articleFormRules = reactive({
    article_title: {
      required: true,
      trigger: "blur",
      message: "请输入文章标题"
    },
    article_content: {
      required: true,
      message: "请输入文章内容",
      trigger: "blur"
    }
  });
  // 校验规则
  const dialogArticleFormRules = reactive({
    category_id: {
      required: true,
      message: "请选择文章分类",
      trigger: ["change"]
    },
    article_description: {
      required: true,
      message: "请输入文章描述",
      trigger: ["blur"]
    },
    tagIdList: {
      required: true,
      message: "请选择文章标签",
      validator: tagV,
      trigger: ["change"]
    },
    coverList: {
      required: true,
      message: "请上传文章封面",
      validator: coverV,
      trigger: ["change"]
    },
    origin_url: {
      required: true,
      message: "请输入原文链接",
      trigger: ["blur"]
    },
    order: {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入文章排序"));
        } else {
          articleForm.order = value - 0;
          callback();
        }
      },
      trigger: "blur"
    }
  });

  function closeDialog() {
    resetForm(dialogArticleFormRef.value);
    dialogVisible.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  // 发布文章 打开弹窗
  async function publish(formEl) {
    if (!formEl) return;
    if (!canPublish.value) {
      message("文章标题重复，换个标题试试", { type: "warning" });
      return;
    }
    await formEl.validate(valid => {
      if (valid) {
        dialogVisible.value = true;
      } else {
        message("请按照提示填写信息", { type: "warning" });
      }
    });
  }
  // 图片上传
  async function uploadCover() {
    if (!articleForm.coverList[0].id) {
      const upLoadLoading = ElLoading.service({
        fullscreen: true,
        text: "图片上传中"
      });
      const res = await imgUpload(articleForm.coverList[0]);
      if (res.code == 0) {
        const { url } = res.result;
        articleForm.article_cover = url;
      }
      upLoadLoading.close();
    }
  }

  async function articleTitleVAlidate() {
    const { id, article_title } = articleForm;
    const res = await titleExist({ id, article_title });
    if (res.result) {
      canPublish.value = false;
      message("文章标题已存在，换一个试试", { type: "warning" });
    } else {
      canPublish.value = true;
    }
  }

  // 上传md文章图片
  async function uploadImage(files, callback) {
    const res = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          mdImgUpload(file).then(imgData => {
            if (imgData.code == 0) {
              const { url } = imgData.result;
              resolve(url);
            } else {
              reject(imgData.message || "上传失败");
            }
          });
        });
      })
    );

    callback(res);
  }

  // 整理文章的数据返回给后端
  function arrangeArticle(articleForm) {
    const { id, category_id, tagIdList, ...restArticle } = articleForm;
    let newCategory;
    const newTagList = [];

    // 当创建新的分类或者是标签时 类型是string而id是number
    if (typeof category_id == "number") {
      newCategory = categoryOptionList.value.find(
        category => (category.id = category_id)
      );
    } else {
      newCategory = {
        category_name: category_id
      };
    }
    tagIdList.forEach(tagId => {
      if (typeof tagId == "number") {
        newTagList.push(tagOptionList.value.find(tag => tag.id == tagId));
      } else {
        newTagList.push({
          tag_name: tagId
        });
      }
    });

    restArticle.category = newCategory;
    restArticle.tagList = newTagList;
    if (id) {
      restArticle.id = id;
    }
    // 谁发布的
    if (!id) {
      restArticle.author_id = userId ? userId : 1;
    }
    if (restArticle.type == 1) {
      restArticle.origin_url = null;
    }
    return restArticle;
  }

  // 发布
  async function submitForm(formEl, type) {
    await formEl.validate(async valid => {
      if (valid) {
        // 图片上传
        await uploadCover();

        if (type == 1) {
          // 1 是保存草稿 2 是直接发布
          articleForm.status = 3;
        }

        if (articleForm.is_top == 2) {
          articleForm.order = null;
        }
        // 整合数据
        const finalArticle = arrangeArticle(articleForm);
        let res;
        if (!finalArticle.id) {
          // 新增
          res = await addArticle(finalArticle);
        } else {
          // 编辑
          res = await editArticle(finalArticle);
        }
        if (res.code == 0) {
          message(res.message, { type: "success" });
          resetForm(formEl.value);
          resetForm(articleFormRef.value);
          dialogVisible.value = false;
          setTimeout(() => {
            router.push("/article/articleList");
          }, 300);
        }
      } else {
        message("请按照提示填写信息", { type: "warning" });
      }
    });
  }

  // 获取标签列表
  async function getTagD() {
    const res = await getTagDictionary();
    if (res.code == 0) {
      tagOptionList.value = res.result;
    }
  }
  // 获取分类列表
  async function getCategoryD() {
    const res = await getCategoryDictionary();
    if (res.code == 0) {
      categoryOptionList.value = res.result;
    }
  }
  // 根据id获取文章详情
  async function getArticleDetailsById(article_id) {
    const res = await getArticleById(article_id);
    if (res.code == 0) {
      const { article_cover } = res.result;
      Object.assign(articleForm, res.result);

      articleForm.coverList = [
        {
          // 获取数组最后一位有很多种方法 article_cover.split('/').reverse()[0]
          //           article_cover.split('/').slice(-1)
          //           article_cover.split('/').at(-1)
          id: 1,
          name: article_cover.split("/").pop(),
          url: article_cover
        }
      ];
    }
  }

  onMounted(async () => {
    await getTagD();
    await getCategoryD();

    if (!route.query.articleId) return;
    // 根据id获取文章信息
    getArticleDetailsById(route.query.articleId);
  });

  return {
    coverUrl,
    articleForm,
    dialogVisible,
    tagOptionList,
    articleFormRef,
    articleFormRules,
    categoryOptionList,
    coverPreviewVisible,
    dialogArticleFormRef,
    dialogArticleFormRules,
    closeDialog,
    uploadImage,
    publish,
    submitForm,
    articleTitleVAlidate
  };
}
