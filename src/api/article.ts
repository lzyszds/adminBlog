import http, { HttpResonse } from "@/http";


// 获取文章列表
export const articleList = <T>(params): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/getArticleList" + params,
    method: "get",
  });
}

//获取文章详情页
export const articleDetail = <T>(id): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/getArticleDetail?id=" + id,
    method: "get",
  });
}

// 发表文章
export const articleAdd = <T>(params): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/addArticle",
    method: "post",
    data: params,
  });
}

// 修改文章
export const articleEditor = <T>(params): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/updateArticle",
    method: "post",
    data: params,
  });
}

// 删除文章
export const articleDelete = <T>(params): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/deleteArticle",
    method: "post",
    data: params,
  });
}

//上传文章图片
export const uploadArticleImg = <T>(fileCompress): Promise<HttpResonse<T>> => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  let formData = new FormData();
  formData.append("upload-image", fileCompress);

  let headers = {
    "Content-Type": "multipart/form-data",
  };
  return http({
    url: "/article/uploadArticleImg",
    method: "post",
    data: formData,
    headers
  });
}

//获取所有文章分类
export const getArticleCategory = <T>(): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/getArticleTypeList",
    method: "get",
  });
}

//添加文章分类
export const addArticleCategory = <T>(params): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/addArticleType",
    method: "post",
    data: params,
  });
}

//删除文章分类
export const deleteArticleCategory = <T>(id): Promise<HttpResonse<T>> => {
  return http({
    url: "/article/deleteArticleType",
    method: "post",
    data: {
      id
    },
  });
}
