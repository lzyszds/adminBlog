<script setup lang='ts'>
import { ref, h, onBeforeUnmount } from 'vue'
import Search from '../../components/Search.vue'
import { ElMessageBox, ElNotification, ElPagination } from 'element-plus'
import http from '@/http/http'
import dayjs from 'dayjs'
import load from '@/uiComponents/loader/loadings'
import { httpData, Article } from './type'
import ArticleForm from './ArticleForm.vue'

const isClear = ref<boolean>(true)

const total = ref(1) //分页页数
const pageSize = ref(7) //分页大小
const tableheight = ref<number>(740) //表格高度
// tableheight.value = height.value * 0.75

//表格数据（前页数据展示进表格中）
const tableData = ref<Article[]>()
const search = ref<string>('')
//定义分页size以及当前页数据
const data = ref<httpData>({ code: 0, data: [], total: 0, })

//时间格式化处理
const setTime: any = (time: number) => {
  const formatted = dayjs.unix(time).format('YYYY-MM-DD')
  return formatted
}

//分页事件、切换页码时提供load效果 
const handleCurrentChange = async (val: number, number?) => {
  /* 此处有一个巨大的坑，接口如果没有返回toal就会导致此处的方法初始触发两次。 */
  total.value = val
  if (number != 1) load.show('#loadings')
  const pagePara = `/articleList?pages=${total.value}&limit=${pageSize.value}&search=${search.value}`
  data.value = await http('get', pagePara) as httpData
  if (data.value.total == 0) {
    // 数据清空
    tableData.value = []
    return load.hide('#loadings')
  }
  //数据处理 时间格式化 
  data.value.data.forEach((item: Article) => {
    item.createTime = setTime(item.createTime)
    item.modified = setTime(item.modified)
  })
  tableData.value = data.value.data
  setTimeout(() => {
    load.hide('#loadings')
  }, 500)
}
handleCurrentChange(1, 1)

//屁用没有，但是必须写，不然排序不了 使用模板的table列
const formatter = () => {
  return 0
}

//新增用户按钮，点击后弹出form表单
const centVisible = ref(false)
const addUser = () => {
  centVisible.value = true
}
//修改用户按钮，点击后弹出确认框
const modifyTheVis = ref(false)
const modifyData = ref<Article>()
const modifyThe = (event: Article) => {
  modifyData.value = event
  modifyTheVis.value = true
}
//开启表单时点击空白地方 关闭form表单时的提示
const handleClose = (done: () => void) => {
  ElMessageBox({
    title: '提示',
    message: h('p', null, [
      h('span', null, '你确定关闭该对话框吗 '),
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      done()
    })
}
//子组件传来的参数 关闭form表单
const switchAdd = (boolean: boolean) => {
  centVisible.value = boolean
  ElNotification({
    title: '成功',
    message: '用户新增成功',
    type: 'success',
  })

  handleCurrentChange(total.value)
}
//子组件传来的参数 关闭form表单
const switchMod = (boolean: boolean) => {
  modifyTheVis.value = boolean
  ElNotification({
    title: '成功',
    message: '用户修改成功',
    type: 'success',
  })
  handleCurrentChange(total.value)
}

//删除文章
const deleteArticle = (event) => {
  http('post', '/deleteArticle', { id: event.aid }).then((res: httpData) => {
    ElNotification({
      title: res.code == 200 ? '成功' : '失败',
      message: '用户' + res.message,
      type: res.code == 200 ? 'success' : 'error',
    })
    if (res.code != 200) console.log(`lzy ~ res`, res.err)
    handleCurrentChange(total.value)
  })
}
//搜索框
const searchHandle = (val: string) => {
  search.value = val
  handleCurrentChange(1)
}
//监听窗口大小变化
// watch(height, (val) => {
//   tableheight.value = val * 0.75
// })
onBeforeUnmount(() => {
  //组件卸载时清除数据
  data.value = { code: 0, data: [], total: 0, }
  isClear.value = false
  tableData.value = []
  search.value = ''
  total.value = 1

})
</script>

<template>
  <div class="mainTem" v-if="isClear">
    <Search @searchVal="searchHandle" />
    <div class="tableuser" id="loadings">

      <el-table :data="tableData" cell-class-name="lzyCell" :height="tableheight" style="width: 100%">
        <template #empty>
          <div class="empty">
            <img src="@/assets/image/暂无文档.svg" alt="">
            <span>暂无数据</span>
          </div>
        </template>
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column property="aid" label="Id" sortable width="80" align="center"></el-table-column>
        <el-table-column property="author" label="作者" width="80" show-overflow-tooltip> </el-table-column>
        <el-table-column label="文章封面" sortable width="180" align="center">
          <template #default="scopre">
            <div>
              <img data-fancybox="gallery" :src="'/adminStatic' + scopre.row.coverImg" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column property="title" label="文章标题" sortable width="160" show-overflow-tooltip> </el-table-column>
        <el-table-column label="创建时间" sortable :sort-method="formatter" width="160">
          <template #default="scope">
            <div class="svgTem">
              <i class="iconfont">&#x100d9;</i>
              {{ scope.row.createTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最近修改时间" sortable :sort-method="formatter" width="160">
          <template #default="scope">
            <div class="svgTem">
              <i class="iconfont">&#x100d9;</i>
              {{ scope.row.modified }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="guid" label="文章路径" sortable>
          <template #default="scope">
            <div class="guidCup">
              <a target="_blank" :href="'/home/detail/' + scope.row.aid">{{ '/home/detail/' + scope.row.aid }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="200">
          <template #default="scope">
            <div class="tool">
              <el-button type="primary" size="small" @click="modifyThe(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="deleteArticle(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="toolfooter">
      <el-button class="add" type="primary" @click="addUser">新增文章</el-button>
      <el-dialog class="articleDialog" :close-on-press-escape="false" v-model="centVisible" top="0px"
        :before-close="handleClose" title="新增文章" width="90%" left v-if="centVisible">
        <ArticleForm type="add" :tableheight="tableheight" @switchAdd="switchAdd" />
      </el-dialog>
      <el-dialog class="articleDialog" :close-on-press-escape="false" v-model="modifyTheVis" :before-close="handleClose"
        title="修改文章" width="90%" left v-if="modifyTheVis">
        <ArticleForm type="modify" :data="modifyData!" :tableheight="tableheight" @switchMod="switchMod" />
      </el-dialog>
      <div class="example-pagination-block lzyColor">
        <div class="example-demonstration" v-if="data.total != 1">When you have more than
          {{ data.total! % pageSize == 0 ? data.total! / pageSize : (data.total! / pageSize >> 0) + 1 }}
          pages of data, use a pagination.
        </div>
        <el-pagination small v-model="total" :currentPage="total" v-model:page-size="pageSize" background
          :total="data.total" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url('@/assets/css/headSearch.less');

div :deep(img[data-fancybox="gallery"]) {
  width: 150px;
  height: 73px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: .1s ease-out;
  box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.5);
  border: 1px solid #000;
  margin-top: 5px;
  transform: scale(0.95);

  &:hover {
    transform: scale(1);
    border-color: #fff;
  }
}

:deep(.el-dialog).articleDialog {
  border-radius: 20px;
  background: #f5f5f5;
  position: relative;
  padding: 1.8rem;
  border: 2px solid #c3c6ce;
  transition: 0.5s ease-out;
  overflow: visible;
  margin: 25px auto;

  .el-dialog__header {
    font-family: 'almama';
    text-align: center;
    margin-bottom: 30px;
    padding: 0;

    .el-dialog__title {
      font-size: 3rem;
      font-weight: 400;
      color: #000;
      user-select: none;
    }

    button {
      margin-top: 15px;
      margin-right: 30px;
      font-size: 20px;
      color: var(--themeColor);

      &:hover .el-icon {
        color: var(--themeColor);
      }
    }
  }

  &:hover {
    border-color: var(--themeColor);
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }
}

.toolfooter {
  & :deep(.el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
