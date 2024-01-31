<script setup lang='ts'>
import { ref, reactive, provide } from 'vue'
import SetRight from '@/components/SetRight.vue';
import http from "@/http/http";
import { ElTableColumn, dayjs } from 'element-plus';

import { ElNotification } from 'element-plus'
import { User } from '@/types/UserType'
import UserForm from '@/views/user/UserForm.vue'

import { useStore } from '@/store';
import { Popup, Requirement } from '@/types/SetRightType';
const state = useStore()
//页面配置
const requirement = reactive<Requirement>({
  search: '', //搜索内容
  pages: 1, //当前页数
  limit: 11, //每页显示条数
  api: '/user/getUserList'
})
//自动加载数据
await state.handleCurrentChange(requirement)

//设置头像图片
const setheadImg = (headImg: User['setHeadImg']) => {
  return '/api/public' + headImg
}

//屁用没有，但是必须写，不然排序不了 使用模板的table列
const formatter = () => {
  return 0
}

//修改用户按钮，点击后弹出确认框
const modifyData = ref<User>()

const modifyThe = (event: User) => {
  modifyData.value = event
  popup.modifyVisible = true
}

//删除用户
const _delete = async (event) => {
  const res = await http('post', '/user/deleteUser', { uid: event.uid })
  ElNotification({
    title: res.code == 200 ? '成功' : '失败',
    message: '用户' + res.msg,
    type: res.code == 200 ? 'success' : 'error',
  })
  if (res.code != 200) console.log(`lzy ~ res`, res.err)
  state.handleCurrentChange(requirement)
}

const popup = reactive<Popup>({
  addName: '新增用户',
  modifyName: '修改用户',
  addVisible: false,
  modifyVisible: false,
  addWidth: '26%',
  modifyWidth: '26%',
})
//子组件传来的参数 关闭form表单
const switchMod = (boolean: boolean, isAdd) => {
  if(isAdd) {
    popup.addVisible = boolean
  } else {
    popup.modifyVisible = boolean
  }
  state.handleCurrentChange(requirement)
}

// watch(() => state.search, async (newVal) => {
//   requirement.search = newVal
//   await state.handleCurrentChange(requirement)
// }, { deep: true })

function formatDate(date) {
  return date ? dayjs(date).format('YYYY.MM.DD') : ''
}


provide("setRightProps", {
  popup,
  requirement
})
</script>

<template>
  <SetRight>
    <template #table>
      <el-table-column property="uid" label="Id" sortable width="80" align="center"></el-table-column>

      <el-table-column label="头像" width="70">
        <template #default="{ row }">
          <div class="headImg">
            <el-avatar :src="setheadImg(row.head_img)" alt=""></el-avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.uname }}
        </template>
      </el-table-column>
      <el-table-column property="username" label="登陆账号" min-width="180" />
      <el-table-column label="权限" width="100px" align="center">
        <template #default="{ row }">
          <div class="power">
            <span v-if="row.power === 0" class="powerAdmin">管理员</span>
            <span v-else>普通用户</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="允许" width="100px" align="center">
        <template #default="{ row }">
          <div class="power">
            <div class="checkbox-con">
              <input id="checkbox" type="checkbox" disabled v-model="row.isUse">
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" sortable :sort-method="formatter" width="160">
        <template #default="{ row }">
          <div class="svgTem">
            <lzyicon name="memory:calendar-month"></lzyicon>
            <span> {{ formatDate(row.create_date) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上一次登陆时间" sortable :sort-method="formatter" width="160">
        <template #default="{ row }">
          <div class="svgTem">
            <lzyicon name="memory:calendar-month"></lzyicon>
            <span>{{ formatDate(row.last_login_date) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="注册时的IP" sortable :sort-method="formatter" width="160">
        <template #default="{ row }">
          <div class="svgTem">
            <lzyicon name="memory:calendar-month"></lzyicon>
            <span>{{ row.create_ip == '::1' ? "127.0.0.1" : row.create_ip }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="{ row }">
          <div class="tool">
            <el-button type="primary" size="small" @click="modifyThe(row)">修改</el-button>
            <el-popconfirm width="220" @confirm="_delete(row)" confirm-button-text="确定" cancel-button-text="取消"
              title="你确定要删除吗?">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </template>
    <!-- 新增文章 -->
    <template #popupAdd>
      <UserForm type="add" @switchMod="switchMod" />
    </template>
    <!-- 修改文章 -->
    <template #popupModify>
      <UserForm type="modify" :data="modifyData" @switchMod="switchMod" />
    </template>
  </SetRight>
</template>
<style lang="less" scoped>
@import url('@/assets/css/headSearch.less');

:deep(.el-dialog).articleDialog {
  padding: 5rem;
}
</style>
@/store
