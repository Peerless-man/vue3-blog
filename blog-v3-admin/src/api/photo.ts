import { http } from "@/utils/http";

export type photoResult = {
  code: number;
  message: string;
  result: any;
};

/** 新增相册 */
export const addAlbum = data => {
  return http.request<photoResult>("post", "/api/photoAlbum/add", { data });
};

/** 修改相册 */
export const updateAlbum = data => {
  return http.request<photoResult>("put", "/api/photoAlbum/update", { data });
};

/** 分页获取相册 */
export const getAlbumList = data => {
  return http.request<photoResult>("post", "/api/photoAlbum", { data });
};

/** 删除相册 */
export const deleteAlbum = id => {
  return http.request<photoResult>(
    "delete",
    "/api/photoAlbum/delete/" + id,
    {}
  );
};

/** 批量新增图片 */
export const addPhotos = data => {
  return http.request<photoResult>("post", "/api/photo/add", { data });
};

/** 分页获取相册的所有图片 */
export const getPhotoListByAlbumId = data => {
  return http.request<photoResult>("post", "/api/photo/getPhotoListByAlbumId", {
    data
  });
};

/** 批量恢复图片 */
export const revertPhotos = data => {
  return http.request<photoResult>("put", "/api/photo/revert", { data });
};

/** 批量删除图片 */
export const deletePhotos = data => {
  return http.request<photoResult>("put", "/api/photo/delete", { data });
};
