<script setup lang="ts">
import { ref, reactive, provide } from "vue";
import SetRight from "@/components/SetRight.vue";
import http from "@/http/http";
import { ElTableColumn, dayjs } from "element-plus";

import { ElNotification } from "element-plus";
import { Article } from "@/types/ArticleType";
import ArticleForm from "@/Views/article/ArticleForm.vue";

import { useStore } from "@/store/store";
import { Popup, Requirement } from "@/types/SetRightType";
const state = useStore();

//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  currentPage: 1, //当前页数
  pageSize: 10, //每页显示条数
  api: "/overtApis/articleList",
});
//自动加载数据
await state.handleCurrentChange(requirement);

//屁用没有，但是必须写，不然排序不了 使用模板的table列
const formatter = () => {
  return 0;
};

//修改用户按钮，点击后弹出确认框
const modifyData = ref<Article>();

const modifyThe = (event: Article) => {
  modifyData.value = event;
  popup.modifyVisible = true;
};

//删除文章
const _delete = async (event) => {
  if (false) {
    const res = await http("post", "/deleteArticle", { id: event.aid });
    ElNotification({
      title: res.code == 200 ? "成功" : "失败",
      message: "用户" + res.message,
      type: res.code == 200 ? "success" : "error",
    });
    if (res.code != 200) console.log(`lzy ~ res`, res.err);
  }
  // handleCurrentChange(total.value)
};

const popup = reactive<Popup>({
  addName: "新增文章",
  modifyName: "修改文章",
  addVisible: false,
  modifyVisible: false,
  addWidth: "90%",
  modifyWidth: "90%",
  addLeft: "0px",
  modifyLeft: "0px",
  addTop: "0px",
  modifyTop: "0px",
});

//子组件传来的参数 关闭form表单
const switchMod = async (boolean: boolean) => {
  popup.modifyVisible = boolean;
  ElNotification({
    title: "成功",
    message: "文章",
    type: "success",
  });
  await state.handleCurrentChange(requirement);
};

provide("setRightProps", {
  popup,
  requirement
})

</script>

<template>
  <SetRight>
    <template #table>
      <el-table-column property="aid" label="Id" sortable width="80" align="center"></el-table-column>
      <el-table-column property="author" label="作者" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="文章封面" width="180" align="center">
        <template #default="{ row }">
          <div>
            <img v-ImgLoading data-fancybox="gallery" :src="'/api/public' + row.coverImg" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column property="title" label="文章标题" sortable width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="创建时间" sortable :sort-method="formatter" width="160">
        <template #default="{ row }">
          <div class="svgTem">
            <i class="iconfont">&#x100d9;</i>
            {{ dayjs(row.createTime * 1000).format("YYYY-MM-DD") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最近修改时间" sortable :sort-method="formatter" width="160">
        <template #default="{ row }">
          <div class="svgTem">
            <i class="iconfont">&#x100d9;</i>
            {{ dayjs(row.modified * 1000).format("YYYY-MM-DD") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="guid" label="文章路径" sortable>
        <template #default="{ row }">
          <div class="guidCup">
            <a target="_blank" :href="'/home/detail/' + row.aid">{{
              "/home/detail/" + row.aid
            }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="200">
        <template #default="{ row }">
          <div class="tool">
            <el-button type="primary" size="small" @click="modifyThe(row)">修改</el-button>
            <el-button type="danger" size="small" @click="_delete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </template>
    <!-- 新增文章 -->
    <template #popupAdd>
      <ArticleForm type="add" :data="([] as any)" :tableheight="740" @switchMod="switchMod" />
    </template>
    <!-- 修改文章 -->
    <template #popupModify>
      <ArticleForm type="modify" :data="modifyData!" :tableheight="740" @switchMod="switchMod" />
    </template>
  </SetRight>
</template>
<style lang="less" scoped>
@import url("@/assets/css/headSearch.less");
</style>
