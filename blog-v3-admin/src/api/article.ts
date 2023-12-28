import { http } from "@/utils/http";

export type ArticleResult = {
  code: number;
  message: string;
  result: any;
};

/** 条件分页获取文章 */
export const getArticleList = (data?: object) => {
  return http.request<ArticleResult>("post", "/api/article/getArticleList", {
    data
  });
};

/** 新增文章 */
export const addArticle = (data?: object) => {
  return http.request<ArticleResult>("post", "/api/article/add", { data });
};

/** 修改文章 */
export const editArticle = (data?: object) => {
  return http.request<ArticleResult>("put", "/api/article/update", { data });
};

/** 删除文章  传文章状态 1、2会假删除 3会真删除*/
export const deleteArticle = (id, status) => {
  return http.request<ArticleResult>(
    "delete",
    `/api/article/delete/${id}/${status}`,
    {}
  );
};

/** 修改文章置顶 */
export const updateArticleTop = (id, is_top) => {
  return http.request<ArticleResult>(
    "put",
    `/api/article/updateTop/${id}/${is_top}`,
    {}
  );
};

/** 恢复文章 */
export const revertArticle = id => {
  return http.request<ArticleResult>("put", `/api/article/revert/${id}`, {});
};

/** 公开或隐藏文章 1 公开 2 私密 */
export const isArticlePublic = (id, status) => {
  return http.request<ArticleResult>(
    "put",
    `/api/article/isPublic/${id}/${status}`,
    {}
  );
};

/** 根据文章id获取文章详细信息 */
export const getArticleById = id => {
  return http.request<ArticleResult>(
    "get",
    `/api/article/getArticleById/${id}`,
    {}
  );
};

/** 根据文章标题 和 id 判断文章标题是否重复了 */
export const titleExist = data => {
  return http.request<ArticleResult>("post", `/api/article/titleExist`, {
    data
  });
};
