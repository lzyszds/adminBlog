// 一、配置axios
import axios, { AxiosResponse } from 'axios'
import { ElMessageBox } from 'element-plus'
import { getCookie, setMession } from '@/utils/utils'
/**
 * 在 Vue.js 中，使用 vue-router 来处理路由时，有时可能会遇到在响应拦截器中无法访问路由的情况。
 * 这通常是因为在拦截器中，路由对象（$route）可能还没有被创建，
 * 或者因为异步操作的原因，拦截器代码在路由切换之前执行。
 * 为了在响应拦截器中访问路由信息，
 * 你可以使用 Vue Router 提供的 beforeEach 导航守卫来确保在路由切换之前执行你的拦截器逻辑。
*/
import router from '@/router/index'; // 导入你的路由实例

export interface HttpResonse<T> {
  code: number
  data: T,
  msg?: string,
  total?: number,
  message?: string,
  err?: object,
  error?: object,
}

export interface ResonseData<T> {
  data: T
  total: number
}

const instance = axios.create({
  baseURL: '/firstHonoApi/api', // api的base_url
  // timeout: 5000,
  withCredentials: true,//表示跨域请求时是否需要使用凭证
})

// 响应拦截器
instance.interceptors.response.use((response: AxiosResponse): any => {
  if (!getCookie('token_remderDay')) {
    // 如果没有名为 'token_remderDay' 的 Cookie，清空本地存储
    localStorage.setItem('lzy_token', '')
  }
  if (response.status === 200) {
    // 993登录过期
    if (response.data.code == '401') {
      let timer: any = setTimeout(() => {
        router.push('/login')
        ElMessageBox.close()
      }, 1000 * 2)
      localStorage.setItem('lzy_token', '') // 清空本地存储
      ElMessageBox.alert('登陆验证失败，请重新登陆！！(2秒后自动退出)', '提示', {
        // 弹出提示框，告知用户登录验证失败
        // 如果要禁用其自动对焦
        // autofocus: false,
        confirmButtonText: '确定',
        callback: () => {
          router.push('/login')
          clearTimeout(timer)
          ElMessageBox.close()
        },
      })
      return Promise.resolve({
        code: 401,
        data: '未登录',
      })
    } else {
      return Promise.resolve(response)
    }
  } else {
    // 如果响应状态码不为 200，返回对应的错误信息
    return Promise.reject(identifyCode(response.status, response))
  }
})
//导出ts接口

/**
 * IHttpConfig 接口定义了HTTP请求的配置项
 */
interface IHttpConfig {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  headers?: any
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
}

/**
 * 默认的HTTP请求函数
 * @param httpConfig HTTP请求的配置项
 * @returns 返回一个Promise，Promise的resolve值为HttpResonse对象
 */
export default async function http<T>(httpConfig: IHttpConfig): Promise<HttpResonse<T>> {
  let { method = 'get', url, data, params, headers } = httpConfig;
  // 设置默认头部信息
  const defaultHeaders: any = {
    'access-control-allow-origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin-Type': '*',
    'Authorization': localStorage.getItem('lzy_token') || '',
  };

  // 将默认头部与自定义头部合并
  headers = { ...defaultHeaders, ...headers };

  // 判断是否为多部分请求
  const isMultipart = headers['Content-Type'] === 'multipart/form-data';


  try {
    const response = await instance({ method, url, data, headers });
    if (response.data.code !== 200) {
      setMession('error', response.data.msg)
      return Promise.reject(response.data.message)
    }
    return response.data as HttpResonse<T>; // 假设响应数据为getComType[]类型
  } catch (error: any) {
    setMession('error', error.msg)
    return Promise.reject(error);
  }

}

function identifyCode(code: number | string, err: any) {
  code == 400 && (code = '请求错误')
  code == 401 && (code = '未授权，请登录')
  code == 403 && (code = '拒绝访问')
  code == 404 && (code = `请求地址出错: ${err.response.config.url}`)
  code == 408 && (code = '请求超时')
  code == 500 && (code = '服务器内部错误')
  code == 501 && (code = '服务未实现')
  code == 502 && (code = '网关错误')
  code == 503 && (code = '服务不可用')
  code == 504 && (code = '网关超时')
  code == 505 && (code = 'HTTP版本不受支持')
  return code
}
