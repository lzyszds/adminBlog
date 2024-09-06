import http, { HttpResonse } from "@/http";


// 获取 ai key 列表
export const getAiKeysList = <T>(): Promise<HttpResonse<T>> => {
     return http({
          url: "/openAI/getAiKeysList",
          method: "get",
     })
}



//设置ai key

export const setAiKey = <T>(data: object): Promise<HttpResonse<T>> => {
     return http({
          url: "/aiService/addAiKey",
          method: "post",
          data,
     })
}



