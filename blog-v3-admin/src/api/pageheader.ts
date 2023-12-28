import { http } from "@/utils/http";

export type pageResult = {
  code: number;
  message: string;
  result: any;
};

/** 获取所有背景 */
export const getPageHeaderList = (data?: object) => {
  return http.request<pageResult>("get", "/api/pageHeader/getAll", { data });
};

/** 新增/修改背景 */
export const addOrUpdatePageHeader = (data?: object) => {
  return http.request<pageResult>("post", "/api/pageHeader/addOrUpdate", {
    data
  });
};

/** 删除背景 */
export const deletePageHeader = data => {
  return http.request<pageResult>("post", "/api/pageHeader/delete", { data });
};
