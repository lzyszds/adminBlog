import http, { HttpResonse } from "@/http";


// 获取系统配置
export const getSystemConfig = <T>(): Promise<HttpResonse<T>> => {
     return http({
          url: "/system/getSystemConfig?type=admin",
          method: "get",
     });
}


// 更新系统配置
export const updateSystemConfig = <T>(data: object): Promise<HttpResonse<T>> => {
     return http({
          url: "/system/updateSystemConfig",
          method: "post",
          data
     });
}


// 获取系统图片懒加载的图片
export const getSystemLoadImages = <T>(): Promise<HttpResonse<T>> => {
     return http({
          url: "/system/getSystemLoadImages",
          method: "get",
     });
}

// 获取底部信息
export const getFooterInfo = <T>(): Promise<HttpResonse<T>> => {
     return http({
          url: "/system/getFooterInfo",
          method: "get",
     });
}

// 新增底部信息
export const addFooterInfo = <T>(data: object): Promise<HttpResonse<T>> => {
     return http({
          url: "/system/addFooterInfo",
          method: "post",
          data,
     })
}
// 更新底部信息
export const updateFooterInfo = <T>(data: object): Promise<HttpResonse<T>> => {
     return http({
          url: "/system/updateFooterInfo",
          method: "post",
          data,
     })
}

