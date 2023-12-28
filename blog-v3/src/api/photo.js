import http from "@/config/request";

/** 获取所有的相册 */
export const getAllAlbum = () => {
  return new Promise((resolve, reject) => {
    http.get("/api/photoAlbum/getAllAlbumList", {}).then((res) => {
      resolve(res);
    });
  });
};

/** 获取相册内的图片 */
export const getAllPhotosByAlbumId = (id) => {
  return new Promise((resolve, reject) => {
    http.get(`/api/photo/getAllPhotosByAlbumId/${id}`, {}).then((res) => {
      resolve(res);
    });
  });
};
