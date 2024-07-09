<script setup lang="ts">
import { reactive, provide } from "vue";
import SetRight from "@/components/SetRight.vue";
import http from "@/http/http";
import { ElTableColumn, dayjs } from "element-plus";

import { useStore } from "@/store";
import { Requirement } from "@/types/SetRightType";
import { getComType } from "@/types/CommentType";
import { LNotification } from "@/utils/utils";
const state = useStore();

//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  pages: 1, //当前页数
  limit: 15, //每页显示条数
  api: "/comment/getAllComment",
});
//自动加载数据
await state.handleCurrentChange(requirement);

const topCom = (_row: getComType) => {
  // 置顶评论
  //没想明白，先不写了
  // http('post', '/topComment', { comId: row.comId })
};
//删除评论
const _delete = async (row: getComType) => {
  LNotification("success");
  const res: any = await http<string>({
    method: "post",
    url: "/comment/deleteComment",
    data: { comId: row.comId, aid: row.article_id },
  });
  if (res.data === "删除成功") {
    state.handleCurrentChange(requirement);
  }
};
console.log(`lzy  requirement:`, requirement);
provide("setRightProps", {
  requirement: requirement,
});
</script>

<template>
  <SetRight>
    <template #table>
      <el-table-column prop="" label="头像" width="65">
        <template #default="{ row }">
          <el-avatar
            :src="'/api/public' + row.head_img"
            style="width: 40px; height: 40px"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="用户名" width="90"></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        width="220"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="time" label="评论时间" show-overflow-tooltip>
        <template #default="{ row }">
          <span>
            {{ dayjs.unix(row.time).format("YYYY.MM.DD HH:mm") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="comment_id" label="评论id" width="70"></el-table-column>
      <el-table-column prop="article_id" label="文章id" width="70"></el-table-column>
      <el-table-column prop="ground_id" label="评论楼层" width="80"></el-table-column>
      <el-table-column prop="reply_id" label="回复id" width="70"></el-table-column>
      <el-table-column prop="user_ip" label="用户ip" width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="scope">
          <!-- 如果当前评论不为一级评论，不给予置顶功能 -->
          <el-popconfirm
            width="220"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="#626AEF"
            title="Are you sure to delete this?"
            @confirm="topCom(scope.row)"
          >
            <template #reference>
              <el-button :disabled="scope.row.ground_id != 0" type="primary" size="small"
                >置顶</el-button
              >
            </template>
          </el-popconfirm>
          <el-popconfirm
            width="220"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="#626AEF"
            title="Are you sure to delete this?"
            @confirm="_delete(scope.row)"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </template>
  </SetRight>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/headSearch.scss");
</style>
@/store
