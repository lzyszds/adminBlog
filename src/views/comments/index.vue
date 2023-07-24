<script setup lang="ts">
import Search from "../../components/Search.vue";
import { ref, onBeforeUnmount } from "vue";
import load from "@/uiComponents/loader/loadings";
import http, { HttpResonse } from "@/http/http";
import {
  dayjs,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElPopconfirm,
  ElButton,
} from "element-plus";
import { LNotification, setTime } from "@/utils/utils";
const data = await http("get", `/getAllComment`) as any;
import { getComType } from "@/types/CommentType";
// ? pages = ${ total.value }& limit=${ pageSize.value }& search=${ search.value }

const search = ref(""); //搜索关键字
const total = ref(1); //分页页数
const pageSize = ref(10); //分页大小
const isClear = ref<boolean>(true)

const tableData = ref<getComType[]>(data.data);
const deleteCom = async (row: getComType) => {
  LNotification("success");
  const res: any = await http("post", "/deleteComment", {
    comId: row.comId,
    aid: row.article_id,
  });
  if (res.data === "删除成功") {
    const { data } = (await http(
      "get",
      `/getAllComment?pages=${total.value}&limit=${pageSize.value}&search=${search.value}`
    )) as any;
    tableData.value = data;
  }
};
const topCom = (_row: getComType) => {
  // 置顶评论
  //没想明白，先不写了
  // http('post', '/topComment', { comId: row.comId })
};
const searchValfn = async (val: string) => {
  search.value = val;
  handleCurrentChange(1);
};

//分页事件、切换页码时提供load效果
const handleCurrentChange = async (val: number, number?) => {
  /* 此处有一个巨大的坑，接口如果没有返回toal就会导致此处的方法初始触发两次。 */
  total.value = val;
  if (number != 1) load.show("#loadings");
  const pagePara = `/getAllComment?pages=${total.value}&limit=${pageSize.value}&search=${search.value}`;
  data.value = await http<HttpResonse<getComType[]>>("get", pagePara);
  if (data.value.total == 0) {
    // 数据清空
    tableData.value = [];
    return load.hide("#loadings");
  }
  //数据处理 时间格式化
  data.value.data.forEach((item: getComType) => {
    item.time = setTime(item.time);
  });
  tableData.value = data.value.data;
  setTimeout(() => {
    load.hide("#loadings");
  }, 50);
};
//组件卸载时清除数据
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
    <Search @searchVal="searchValfn" />
    <div id="loadings">
      <el-table class="tableuser" :data="tableData" style="width: 100%">
        <template #empty>
          <div class="empty">
            <img src="@/assets/image/暂无文档.svg" alt="" />
            <span>暂无数据</span>
          </div>
        </template>
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
            <span style="font-size: 12px !important">{{
              dayjs.unix(row.time).format("YYYY.MM.DD HH:mm")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="comId" label="评论id" width="70"></el-table-column>
        <el-table-column prop="article_id" label="文章id" width="70"></el-table-column>
        <el-table-column prop="ground_id" label="评论楼层" width="80"></el-table-column>
        <el-table-column prop="reply_id" label="回复id" width="70"></el-table-column>
        <el-table-column prop="user_ip" label="用户ip" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="140">
          <template #default="scope">
            <!-- 如果当前评论不为一级评论，不给予置顶功能 -->
            <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="#626AEF"
              title="Are you sure to delete this?" @confirm="topCom(scope.row)">
              <template #reference>
                <el-button :disabled="scope.row.ground_id != 0" type="primary" size="small">置顶</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" icon-color="#626AEF"
              title="Are you sure to delete this?" @confirm="deleteCom(scope.row)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="toolfooter">
      <div class="example-pagination-block lzyColor">
        <div class="example-demonstration">When you have more than
          {{ data.total! % pageSize == 0 ? data.total! / pageSize : (data.total! / pageSize >> 0) + 1 }}
          pages of data, use a pagination.
        </div>
        <el-pagination small v-model="total" :page-size="pageSize" background :total="data.total"
          @current-change="handleCurrentChange" layout="prev, pager, next, jumper" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url("@/assets/css/headSearch.less");
</style>
@/utils/utils
