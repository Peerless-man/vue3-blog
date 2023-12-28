import { http } from "@/utils/http";

export type TalkResult = {
  code: number;
  message: string;
  result: any;
};

/** 获取说说列表 */
export const getTalkList = (data?: object) => {
  return http.request<TalkResult>("post", "/api/talk/getTalkList", { data });
};

/** 新增说说 */
export const addTalk = (data?: object) => {
  return http.request<TalkResult>("post", "/api/talk/publishTalk", { data });
};

/** 修改说说 */
export const editTalk = (data?: object) => {
  return http.request<TalkResult>("put", "/api/talk/updateTalk", { data });
};

/** 删除说说 */
export const deleteTalkById = (id, status) => {
  return http.request<TalkResult>(
    "delete",
    `/api/talk/deleteTalkById/${id}/${status}`,
    {}
  );
};

/** 公开 / 私密说说 */
export const togglePublic = (id, status) => {
  return http.request<TalkResult>(
    "put",
    `/api/talk/togglePublic/${id}/${status}`,
    {}
  );
};

/** 置顶 / 取消置顶说说 */
export const toggleTop = (id, is_top) => {
  return http.request<TalkResult>(
    "put",
    `/api/talk/toggleTop/${id}/${is_top}`,
    {}
  );
};

/** 恢复说说 */
export const revertTalk = id => {
  return http.request<TalkResult>("put", `/api/talk/revertTalk/${id}`, {});
};
/** 获取说说详情 */
export const getTalkById = id => {
  return http.request<TalkResult>("get", `/api/talk/getTalkById/${id}`, {});
};
