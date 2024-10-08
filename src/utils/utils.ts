import http from '@/http'
import { ElNotification, dayjs, ElMessage, } from 'element-plus'

import type { ElMessageBoxOptions, MessageBoxState } from 'element-plus'

// 此函数获取一个数组并将其拆分为更小的块
export function splitArray(array: any, size) {
  // 创建一个空数组以容纳较小的块
  let data: any[] = [];
  // 在原始阵列上循环
  for (let i = 0; i < array.length; i += size) {
    // 对于每个迭代，向新数组添加一个新块
    data.push(array.slice(i, i + size))
  }
  // return 一个新数组
  return data
}

//时间格式化为字符串 比如说前天 几天前，几小时前
export function timeAgo(time) {
  const t = dayjs().unix() - time // Y-m-d H:i:s
  let i = 60
  let h = i * 60
  let d = h * 24
  let m = d * 30
  let y = m * 12
  const mp: any = new Map([
    //n是时间戳（key），t是当前时间戳 ,>>0 是向下取整
    [n => n < i, () => '一分钟'],
    [n => n < h, n => (n / i >> 0) + '分钟'],
    [n => n < d, n => (n / h >> 0) + '小时'],
    [n => n < m, n => (n / d >> 0) + '天'],
    [n => n < y, n => (n / m >> 0) + '月'],
    [() => true, n => (n / y >> 0) + '年'],
  ])
  return ([...mp].find(([n]) => n(t)).pop())(t) + '前'
}

/**
 * 获取IP天气信息
 * @returns {Promise<any>} IP天气信息
 */
export async function getIpWeather(): Promise<any> {
  try {
    const response = await getWeather()
    if (response.msg === 'success' || response.message === "success") {
      return response.data;
    } else {
      throw new Error(response.message); // 抛出错误，让调用者处理
    }
  } catch (error) {
    // 这里可以添加错误处理逻辑
    console.error('Error fetching IP weather:', error);
    throw error; // 重新抛出错误，让调用者知道发生了错误
  }
}


/**
 * 将base64编码的字符串转换为Blob对象
 * @param {string} dataurl - base64编码的字符串
 * @returns {Blob} - 转换后的Blob对象
 */
export function base64toBlob(dataurl) {
  // base64 转 二进制流(blob)
  let arr = dataurl.split(","), // 将base64编码的字符串按逗号分割成数组
    mime = arr[0].match(/:(.*?);/)[1], // 提取MIME类型
    bstr = atob(arr[1]), // 将base64编码的字符串解码为二进制流
    n = bstr.length, // 二进制流的长度
    u8arr = new Uint8Array(n); // 创建一个指定长度的无符号8位整数数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n); // 将二进制流的每个字节转换为无符号8位整数并存入数组
  }
  return new Blob([u8arr], {
    type: mime, // 设置Blob对象的MIME类型
  });
}


// 二进制流转换为base64 格式。
export function getBase64(data, type) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([data], { type: type }); // 必须指定type类型
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}


/**
 * 压缩图片 
 * @param file - 图片文件
 * @param quality - 压缩质量 0-1之间  值越小压缩的越大 图片质量越差
 * @returns Promise对象，包含base64格式的压缩图片和压缩后的文件对象
 */
export function optimizeImage(file, quality): Promise<{ base64: string, fileCompress: Blob }> {
  return new Promise((resolve, reject) => {
    getBase64(file, file.type).then((res: string) => {
      const canvas = document.createElement("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = res;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0, img.width, img.height);
        const base64 = canvas.toDataURL(file.type, quality);
        const fileCompress = base64toBlob(base64);
        resolve({ base64, fileCompress });
      };
      img.onerror = function () {
        reject(new Error('图片加载失败'));
      };
    });
  });
}

//消息提醒

export const setMession = (type: MessageBoxState["type"], val: string, arg?) => {
  ElMessage({
    message: val,
    type: type,
    duration: 2000,
    center: true,
    grouping: true,
    plain: true,
    ...arg
  })
}

// 默认弹窗
export const LNotification = (val: string, time: number = 2000, postion: any = 'bottom-right', type: "success" | "warning" | "error" | "info" = "success") => {
  ElNotification.closeAll()
  ElNotification({
    dangerouslyUseHTMLString: true,
    message: "操作提示:" + val,
    position: postion,
    duration: time,
    customClass: 'copy-success',
    type: type
  })
}

// 复制内容提示版权信息
import { useEventListener } from "@vueuse/core";
import { getWeather } from '@/api/toolkit';

export const copyTip = () => {
  useEventListener(window, 'keydown', e => {
    if (e.ctrlKey && e.key === 'c') {
      LNotification(`<i class="iconfont icon-tishi"></i> 复制成功,转载请声明来源！`)
    }
  })
}

// 提示通知
/**
 * 创建一个提示通知。
 * @param val 通知的内容
 * @param time 可选的显示时间
 */
export const tipNotify = (val: string, time?: number): void => {
  // 定义样式常量
  const style = `color: var(--themeColor); font-size: 16px;`;

  // 使用模板字符串构建图标字符串
  const icon = `<i class="iconfont icon-tongzhi" style="${style}"></i>`;

  // 调用 LNotification 函数创建通知
  LNotification(`${icon} ${val}`, time);
};


// 获取cookie
export const getCookie = (name: string) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((item) => item.includes(`${name}=`));
  if (cookie) {
    const [nameValue, ...rest] = cookie.split('=');
    return rest
  }
  return null;
};

// 设置cookie
export const setCookie = (name: string, value: string, time: number) => {
  const date = dayjs().add(time, 'day').format('ddd, dd-MMM-yyyy HH:mm:ss');
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date}`;
};

/* 数组去重 arr: 要处理数组, key: 去重的key值 单一数组不需要key */
export const unique = (arr: any[], key?: string) => {
  const res = new Map();
  return arr.filter((a) => {
    const arrKey = key ? a[key] : a
    // has判断当前值是否在map对象中存在 ,如果不存在则将当前值添加进map对象中
    return !res.has(arrKey) && res.set(arrKey, 1)
  })
}


//数组对象去重
// function unique(arr, key) {
//   const res = new Map();
//   return arr.filter((a) => {
//     // has判断当前值是否在map对象中存在 ,如果不存在则将当前值添加进map对象中
//     return !res.has(a[key]) && res.set(a[key], 1)
//   })
// }
// //去重data
// const _res = new Map();
// const items = data.map((item, index) => _res.set(item.url, index))
// let newdata = [..._res.values()].map(index => {
//   return data[index]
// })
// const newArr = [...new Set(arr)]
// //去重data 使用map对象
// const map = new Map();
// for (const item of data) {
//   if (!map.has(item.url)) {
//     map.set(item.url, item);
//   }
// }
// const result = [...map.values()];

//时间格式化处理
export const setTime: any = (time: string) => {
  const formatted = dayjs(time).format('YYYY-MM-DD')
  return formatted
}


/**
 * 将代理对象转换为普通对象
 *
 * @param obj 要转换的代理对象
 * @returns 转换后的普通对象
 */
export function toProxys(obj: any): any {
  // 如果obj不是对象，则直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 初始化结果对象
  let result: any = {};

  // 遍历obj的每个键值对
  for (const key in obj) {
    const value = obj[key];

    // 如果键对应的值是数组
    if (Array.isArray(value)) {
      // 使用展开运算符创建数组的深拷贝
      result[key] = [...value];

      // 如果键对应的值是对象
    } else if (value && typeof value === 'object' && value !== null) {
      // 递归调用toProxys函数转换对象
      result[key] = toProxys(value);

      // 否则直接将值赋值给结果对象
    } else {
      result[key] = value;
    }
  }

  // 返回转换后的结果对象
  return result;
}


/**
 * 比较两个对象是否相等
 *
 * @param obj 要比较的第一个对象
 * @param other 要比较的第二个对象
 * @param keepNeededValue 需要保留的值
 * @param newResult 用来存储比较结果的空对象
 * @returns 比较结果对象，如果两个对象相等，则返回空对象，否则返回包含差异的键值对
 */
export function isEqual(obj: object, other: object, keepNeededValue: string[] | string, newResult: object = {}): any {

  // 遍历第一个对象的每个键
  for (const key in obj) {
    // 如果需要保留的值是字符串，转换为数组
    if (typeof keepNeededValue === 'string') {
      keepNeededValue = [keepNeededValue]
    }
    // 如果需要保留的值存在
    if (obj.hasOwnProperty(key) && keepNeededValue.includes(key)) {
      newResult[key] = obj[key]
      continue
    }

    // 如果键对应的值是数组
    if (obj[key] instanceof Array && other[key] instanceof Array) {
      // 递归比较两个数组
      newResult[key] = obj[key].filter((item, index) => item !== other[key][index])
      // 如果键对应的值是对象
    } else if (obj[key] instanceof Object && other[key] instanceof Object) {
      // 递归比较两个对象
      newResult = isEqual(obj[key], other[key], keepNeededValue, newResult)

      // 如果两个键对应的值不相等
    } else if (obj[key] !== other[key]) {
      // 将差异的键值对添加到结果对象中
      newResult[key] = obj[key]
    }
  }

  // 返回比较结果对象
  return newResult
}


export default {
  splitArray,//把一个数组拆分成几个数组
  timeAgo,//时间转换
  getIpWeather,//获取当前ip以及天气
  base64toBlob,//base64转二进制流
  getBase64,//二进制流转换为base64 格式。
  optimizeImage,//上传图片，图片太大，如何在前端实现图片压缩后上传
  copyTip,//复制内容提示版权信息
  tipNotify,//提示通知
  LNotification,//提示弹窗
  setMession,//消息提醒
  getCookie,//获取cookie
  setCookie,//设置cookie
  unique,//数组对象去重（区别单数组以及数组中嵌套一层对象）
  setTime,//时间格式化处理
  isEqual,//深度比较两个对象是否相等
}
