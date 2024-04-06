//全局变量声明 window $axios $axios: typeof import('./http/request')['default']
declare global {
  interface Window {
    $axios: typeof import('@/http/request')['default']
  }
}

export { }
