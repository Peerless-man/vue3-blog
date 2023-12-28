import { http } from "@/utils/http";

export type MessageResult = {
  code: number;
  message: string;
  result: any;
};

/** 获取留言列表 */
export const getMessageList = (data?: object) => {
  return http.request<MessageResult>("post", "/api/message/getMessageList", {
    data
  });
};

/** 删除留言 */
export const deleteMessage = (data?: object) => {
  return http.request<MessageResult>("put", "/api/message/backDelete", {
    data
  });
};
