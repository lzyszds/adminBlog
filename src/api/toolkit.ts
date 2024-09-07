import http, { HttpResonse } from "@/http";


// 获取后台首页数据
export const getAdminHomeData = <T>(): Promise<HttpResonse<T>> => {
  return http({
    url: "/toolkit/getAdminHomeData",
    method: "get",
  });
}

//获取天气api
export const getWeather = <T>(): Promise<HttpResonse<T>> => {
  return http({
    url: "/toolkit/getWeather",
    method: "get",
  });
}



