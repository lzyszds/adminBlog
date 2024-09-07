import http, { HttpResonse } from "@/http";


// 获取邮箱任务配置
export const getEmailTaskConfig = <T>(): Promise<HttpResonse<T>> => {
  return http({
    url: "/plantask/getEmailTaskConfig",
    method: "get",
  })
}

//更新邮箱任务配置
export const updateEmailTaskConfig = <T>(data: object): Promise<HttpResonse<T>> => {
  return http({
    url: "/plantask/updateEmailTaskConfig",
    method: "post",
    data,
  })
}



