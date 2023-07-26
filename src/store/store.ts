import { defineStore } from 'pinia'
import http from "@/http/http";
import { hide, show } from '@/utils/loading';
import dayjs from 'dayjs';
import { Requirement } from '@/types/SetRightType';

interface YourDataType {
  createTime: string; // 假设createTime是一个字符串类型属性，你可以根据实际情况调整类型
  modified: string;
}


export const useStore = defineStore('main', {
  state: () => {
    return {
      tableData: [] as any[],
      search: '' as string,
      total: 0 as number,
      time: 0 as number,
    }
  },
  /**
     * 类似组件的 computed, 用来封装计算属性, 具有缓存特性
     */
  getters: {
    //时间格式化处理
    setTime: (state) => dayjs.unix(state.time).format('YYYY-MM-DD') as string
  },
  /**
   * 类似组件的 methods, 封装业务逻辑, 修改state
   * 注意: 里面的函数不能定义成箭头函数(函数体中会用到this)
   */
  actions: {
    // 1、设置表格数据
    setTableData(val) {
      this.tableData = val
    },
    // 2、设置搜索框数据
    setSearch(val) {
      this.search = val
    },
    /* 
      获取表格数据 T:泛型 传入的数据类型
      requirement: Requirement 传入的参数
      val: number 当前页码
    */
    async handleCurrentChange<T>(requirement: Requirement, val?: number,): Promise<void> {
      const { pageSize, search, api } = requirement
      /* 此处有一个巨大的坑，接口如果没有返回toal就会导致此处的方法初始触发两次。 */
      requirement.currentPage = val ?? requirement.currentPage
      const pagePara = `${api}?pages=${requirement.currentPage}&limit=${pageSize}&search=${search}`
      const data = await http<T[]>('get', pagePara)
      this.total = data.total!
      if (data.total == 0) {
        // 数据清空
        this.tableData = []
        return hide('#loadings')
      }
      this.tableData = data.data
      if (document.querySelector('#loadings')) hide('#loadings')
    }
  }
})

