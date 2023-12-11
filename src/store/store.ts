import { defineStore } from 'pinia'
import http from "@/http/http";
import { tipNotify } from '@/utils/utils'
import dayjs from 'dayjs';
import { Requirement } from '@/types/SetRightType';



export const useStore = defineStore('main', {
  state: () => {
    return {
      tableData: [] as any[],
      search: '' as string,
      total: 0 as number,
      time: 0 as number,
      loading: false as boolean,
      formLoading: false as boolean,
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
      const { limit, search, api } = requirement
      /* 此处有一个巨大的坑，接口如果没有返回toal就会导致此处的方法初始触发两次。 */
      requirement.currentPage = val ?? requirement.currentPage
      const pagePara = `${api}?pages=${requirement.currentPage}&limit=${limit}&search=${search}`
      const data = await http<T[]>('get', pagePara)

      if (data.total == 0) {
        //如果 data.total 等于 0，那么 this.tableData 被设置为空数组，this.total 被设置为 data.total。
        //这可能表示没有数据可用，所以清空表格数据并设置总数为0。
        this.tableData = []
      } else if (data.code == 500) {
        //如果 data.code 等于 500，那么会调用 tipNotify 函数显示一个消息，持续时间为2000毫秒，
        //然后 this.tableData 被设置为空数组。这可能表示服务器返回了一个错误，所以清空表格数据并显示一个提示。
        tipNotify(data.msg!, 2000)
        this.tableData = []
      } else {
        //否则，this.total 被设置为 data.total，this.tableData 被设置为 data.data。这可能表示数据加载成功，所以更新表格数据和总数。
        //设置总页数
        this.total = Math.floor(data.total! / limit) + (data.total! % limit > 0 ? 1 : 0)
        this.tableData = data.data
      }
      //最后，调用 this.hideLoading() 和 this.hideformLoading() 方法，这两个方法将 loading 和 formLoading 状态设置为 false，可能表示数据加载完成，不再需要显示加载指示器。
      this.hideLoading()
      this.hideformLoading()
    },
    /**
     * hideLoading 方法将 loading 状态设置为 false。
     * 这通常表示应用已经完成了某个需要显示加载指示器的操作（例如数据的异步加载）。
     */
    hideLoading() {
      this.loading = false
    },
    /**
     * hideformLoading 方法将 formLoading 状态设置为 false。
     * 这可能表示表单的提交或验证已经完成，不再需要显示表单的加载指示器。
     */
    hideformLoading() {
      this.formLoading = false
    }
  },

})

