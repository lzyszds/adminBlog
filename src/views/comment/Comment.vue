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
  const res: any = await http<string>({
    method: "post",
    url: "/comment/deleteComment",
    data: { ids: row.comment_id },
  });
  if (res.data === "删除成功") {
    state.handleCurrentChange(requirement);
  }
  LNotification(res.data, 100000000, "top-right");
};
provide("setRightProps", {
  requirement: requirement,
});
</script>

<template>
  <SetRight>
    <template #table>
      <ElTableColumn prop="" label="头像" width="65">
        <template #default="{ row }">
          <ElAvatar
            :src="'/api/public' + row.head_img"
            style="width: 40px; height: 40px"
          ></ElAvatar>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="user_name" label="用户名" width="90"></ElTableColumn>
      <ElTableColumn
        prop="email"
        label="邮箱"
        width="180"
        show-overflow-tooltip
      ></ElTableColumn>
      <ElTableColumn
        prop="content"
        label="评论内容"
        width="220"
        show-overflow-tooltip
      ></ElTableColumn>
      <ElTableColumn prop="time" label="评论时间" show-overflow-tooltip>
        <template #default="{ row }">
          <span>
            {{ dayjs.unix(row.time).format("YYYY.MM.DD HH:mm") }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="comment_id" label="评论id" width="70"></ElTableColumn>
      <ElTableColumn prop="article_id" label="文章id" width="70"></ElTableColumn>
      <ElTableColumn prop="ground_id" label="评论楼层" width="80"></ElTableColumn>
      <ElTableColumn prop="reply_id" label="回复id" width="70"></ElTableColumn>
      <ElTableColumn prop="user_ip" label="用户ip" width="160" show-overflow-tooltip>
      </ElTableColumn>
      <ElTableColumn fixed="right" label="操作" width="140">
        <template #default="scope">
          <!-- 如果当前评论不为一级评论，不给予置顶功能 -->
          <ElPopconfirm
            width="220"
            confirm-button-text="OK"
            cancElButton-text="No, Thanks"
            icon-color="#626AEF"
            title="Are you sure to delete this?"
            @confirm="topCom(scope.row)"
          >
            <template #reference>
              <ElButton :disabled="scope.row.ground_id != 0" type="primary" size="small">
                置顶
              </ElButton>
            </template>
          </ElPopconfirm>
          <ElPopconfirm
            width="220"
            confirm-button-text="确定"
            cancElButton-text="取消"
            icon-color="#626AEF"
            title="确定要删除这条评论吗?"
            @confirm="_delete(scope.row)"
          >
            <template #reference>
              <ElButton type="danger" size="small">删除</ElButton>
            </template>
          </ElPopconfirm>
        </template>
      </ElTableColumn>
    </template>
  </SetRight>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/headSearch.scss");
</style>
