import http, { HttpResonse } from "@/http";


// 获取评论列表
export const getCommentList = <T>(params): Promise<HttpResonse<T>> => {
  return http({
    url: "/comment/getAllComment" + params,
    method: "get",
  });
}


// 添加评论
export const addComment = <T>(params): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/comment/addComment",
    method: "post",
    data: params,
  });
}

// 修改评论
export const editComment = <T>(params): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/comment/editComment",
    method: "post",
    data: params,
  });
}

// 删除评论
export const deleteComment = <T>(id): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/comment/deleteComment",
    method: "post",
    data: {
      ids: id,
    },
  });
}


