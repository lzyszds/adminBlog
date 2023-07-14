<script setup lang='ts'>
import Search from '../../components/Search.vue'
import { reactive } from 'vue';
// import { getComType } from './commentType'
import http from '@/http/http';
import { dayjs } from 'element-plus';
import { LNotification } from '@/utils/common';
const { data } = await http('get', `/getComments`) as any
// ? pages = ${ total.value }& limit=${ pageSize.value }& search=${ search.value }
interface getComType {
  article_id: Number, //文章id
  comId: Number //评论id
  content: String //评论内容
  email: String //邮箱
  ground_id: Number //评论楼层
  head_img: String //头像
  reply_id: Number //回复id
  time: Number //时间
  user_ip: String //用户ip
  user_name: String //用户名
}
const tableData = reactive<getComType[]>(data)
const deleteCom = (row: getComType) => {
  LNotification('success')
  http('post', '/deleteComment', { comId: row.comId })
}
const topCom = (_row: getComType) => {
  // 置顶评论
  //没想明白，先不写了
  // http('post', '/topComment', { comId: row.comId })
}
const searchValfn = (val: string) => {
  console.log(val)
}
</script>

<template>
  <Search @searchVal="searchValfn" />
  <div>
    <el-table class="tableuser" :data="tableData" style="width: 100%">
      <el-table-column prop="" label="头像" width="65">
        <template #default="{ row }">
          <el-avatar :src="row.head_img" style="width: 40px; height: 40px"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="用户名" width="90"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="评论内容" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="time" label="评论时间" width="150" show-overflow-tooltip>
        <template #default="{ row }">
          <span style="font-size: 12px !important;">{{ dayjs.unix(row.time).format('YYYY.MM.DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comId" label="评论id" width="70"></el-table-column>
      <el-table-column prop="article_id" label="文章id" width="70"></el-table-column>
      <el-table-column prop="ground_id" label="评论楼层" width="80"></el-table-column>
      <el-table-column prop="reply_id" label="回复id" width="70"></el-table-column>
      <el-table-column prop="user_ip" label="用户ip" width="140" show-overflow-tooltip> </el-table-column>
      <el-table-column fixed="right" label="Operations" width="140">
        <template #default="scope">
          <!-- 如果当前评论不为一级评论，不给予置顶功能 -->
          <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="#626AEF"
            title="Are you sure to delete this?" @confirm="topCom(scope.row)"> >
            <template #reference>
              <el-button :disabled="scope.row.ground_id != 0" type="primary" size="small">置顶</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="#626AEF"
            title="Are you sure to delete this?" @confirm="deleteCom(scope.row)"> >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
</style>
