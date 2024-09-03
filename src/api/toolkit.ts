import http, { HttpResonse } from "@/http";


// 获取后台首页数据
export const getAdminHomeData = <T>(): Promise<HttpResonse<T>> => {
  return http({
    url: "/toolkit/getAdminHomeData",
    method: "get",
  });
}




