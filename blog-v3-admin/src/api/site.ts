import { getToken } from "@/utils/auth";
import { http } from "@/utils/http";
import Axios from "axios";
import { ElMessage } from "element-plus";
import { imageConversion } from "@/utils/utils";

export type SiteResult = {
  code: number;
  message: string;
  result: any;
};

/** 获取网站config */
export const getConfigDetail = () => {
  return http.request<SiteResult>("get", "/api/config", {});
};

/** 获取gitee代码提交记录 */
export const getCommitList = () => {
  return http.request<Array<object>>(
    "get",
    "/gitee/contribution_timeline?url=%2Fmrzym%2Fcontribution_timeline&scope=my&day=&start_date=&end_date=&year=&limit=180&prev_id=&_=1683426798995"
  );
};

/** 修改网站config */
export const updateConfigDetail = data => {
  return http.request<SiteResult>("post", "/api/config/update", { data });
};

/** 增加网站访问量 */
export const addView = () => {
  return http.request<SiteResult>("put", "/api/config/addView", {});
};

/** 图片上传接口 */
export const imgUpload = async data => {
  // 文件压缩 太大了上传不了，我的服务器比较垃圾
  let res;
  // 没有raw.size 就表示已经压缩过了（多图片上传那里我压缩了一次） 有的话小于800不用压缩
  if (data.raw.size / 1024 > 820) {
    const file = await imageConversion(data.raw);
    if (!file) {
      ElMessage.error("图片上传失败");
      return;
    } else {
      res = file;
    }
  } else {
    res = data.raw;
  }

  const formData = new FormData();
  formData.append("file", res);
  const token = getToken();

  return new Promise<SiteResult>(resolve => {
    Axios({
      method: "post",
      url: "/api/upload/img",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token.token
      }
    }).then(response => {
      resolve(response.data);
    });
  });
};

/** md文档的图片上传接口 */
export const mdImgUpload = async data => {
  // 文件压缩 太大了上传不了，我的服务器比较垃圾
  let res;
  // 没有raw.size 就表示已经压缩过了（多图片上传那里我压缩了一次） 有的话小于820不用压缩
  if (data.size / 1024 > 820) {
    const file = await imageConversion(data);
    if (!file) {
      ElMessage.error("图片上传失败");
      return;
    } else {
      res = file;
    }
  } else {
    res = data;
  }

  const formData = new FormData();
  formData.append("file", res);
  const token = getToken();

  return new Promise<SiteResult>(resolve => {
    Axios({
      method: "post",
      url: "/api/upload/img",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token.token
      }
    }).then(response => {
      resolve(response.data);
    });
  });
};
