
import http, { HttpResonse } from "@/http";

//登陆
export const login = <T>(params): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/users/login",
    method: "post",
    data: params,
  });
}


//获取用户token详情
export const getUserInfoToken = <T>(): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/users/getUserInfoToken",
    method: "get",
  });
}

//获取用户列表
export const getUserList = <T>(params): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/users/getUserList" + params,
    method: "get",
  });
}

//添加用户
export const addUser = <T>(params): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/users/addUser",
    method: "post",
    data: params,
  });
}

//编辑用户
export const editUser = <T>(params): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/users/editUser",
    method: "post",
    data: params,
  });
}

//删除用户
export const deleteUser = <T>(id): Promise<HttpResonse<T>> => {
  return http<T>({
    url: "/users/deleteUser",
    method: "post",
    data: {
      id,
    },
  });
}


//获取随机头像
export const getAvatar = <T>(): Promise<HttpResonse<T>> => {
  return http({
    url: "/users/getRandHeadImg",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      time: Date.now(),
    },
  });
}

//上传头像
export const uploadAvatar = <T>(formData): Promise<HttpResonse<T>> => {
  return http({
    url: "/users/uploadHead",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
}
