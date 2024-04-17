<script setup lang="ts">
import { ref, reactive, provide } from "vue";
import SetRight from "@/components/SetRight.vue";
import http from "@/http/http";
import { LNotification } from "@/utils/utils";
import { ElTableColumn, dayjs } from "element-plus";

import { ElNotification } from "element-plus";
import { ArticleMultipleDataType } from "@/types/ArticleType";
import ArticleForm from "@/Views/article/ArticleForm.vue";

import { useStore } from "@/store";
import { Popup, Requirement } from "@/types/SetRightType";
const state = useStore();

//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  pages: 1, //当前页数
  limit: 7, //每页显示条数
  api: "/article/getArticleList",
});
//自动加载数据
await state.handleCurrentChange(requirement);
//屁用没有，但是必须写，不然排序不了 使用模板的table列
const formatter = () => {
  return 0;
};

//修改用户按钮，点击后弹出确认框
const modifyData = ref<ArticleMultipleDataType>();

const modifyThe = (event: ArticleMultipleDataType) => {
  //根据点击的文章id获取文章详情信息
  http({
    url: "/article/getArticleInfo/" + event.aid,
    method: "get",
  }).then((res: any) => {
    modifyData.value = res.data;
    popup.modifyVisible = true;
  });
};

//删除文章
const _delete = async (event) => {
  try {
    const res = await http({
      url: "/article/deleteArticle",
      method: "post",
      data: { id: event.aid },
    });

    ElNotification({
      title: res.code === 200 ? "成功" : "失败",
      message: `${res.data}`,
      type: res.code === 200 ? "success" : "error",
    });

    await state.handleCurrentChange(requirement);
  } catch (error) {
    // 处理可能的异步错误
    console.error("Error deleting article:", error);
    LNotification("删除失败", 2000, "error");
    return false;
  }
};

const popup = reactive<Popup>({
  addName: "新增文章",
  modifyName: "修改文章",
  addVisible: false,
  modifyVisible: false,
  addWidth: "90%",
  modifyWidth: "90%",
  alignCenter: true,
});

//子组件传来的参数 关闭form表单
const switchMod = async (arr: {
  flag: boolean;
  data: any;
  type: "修改" | "新增";
}) => {
  console.log(`lzy  arr:`, arr);
  arr.type == "修改"
    ? (popup.modifyVisible = arr.flag)
    : (popup.addVisible = arr.flag);
  if (arr.flag) {
    return ElNotification({
      title: arr.type + "失败",
      message: arr.type + "文章",
      type: "error",
    });
  }
  ElNotification({
    title: arr.type + "成功",
    message: arr.data,
    type: "success",
  });
  await state.handleCurrentChange(requirement);
};

// watch(() => state.search, async (newVal) => {
//   requirement.search = newVal
//   await state.handleCurrentChange(requirement)
// }, { deep: true })

provide("setRightProps", {
  popup,
  requirement,
});
</script>

<template>
  <SetRight>
    <template #table>
      <el-table-column
        property="aid"
        label="Id"
        sortable
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        property="uname"
        label="作者"
        width="80"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="文章封面" width="180" align="center">
        <template #default="{ row }">
          <div>
            <img
              v-ImgLoading
              :src="'/api/public' + row.cover_img"
              data-fancybox="gallery"
              title="o"
              alt=""
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        property="title"
        label="文章标题"
        sortable
        width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        sortable
        :sort-method="formatter"
        width="160"
      >
        <template #default="{ row }">
          <div class="svgTem">
            <i class="iconfont">&#x100d9;</i>
            {{ dayjs(row.create_date).format("YYYY.MM.DD") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="最近修改时间"
        sortable
        :sort-method="formatter"
        width="150"
      >
        <template #default="{ row }">
          <div class="svgTem">
            <i class="iconfont">&#x100d9;</i>
            {{
              row.modified_date
                ? dayjs(row.modified_date).format("YYYY.MM.DD")
                : "暂无修改记录"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="guid" label="文章路径" sortable>
        <template #default="{ row }">
          <div class="guidCup">
            <a target="_blank" :href="'/home/detail/' + row.aid">
              {{ "/home/detail/" + row.aid }}
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="tags" label="类型" sortable width="250">
        <template #default="{ row }">
          <div class="tags">
            <el-tag
              type="info"
              v-for="(item, index) in row.tags"
              :key="index"
              >{{ item }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="{ row }">
          <div class="tool">
            <el-button type="primary" size="small" @click="modifyThe(row)"
              >修改</el-button
            >
            <el-button type="danger" size="small" @click="_delete(row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </template>
    <!-- 新增文章 -->
    <template #popupAdd>
      <ArticleForm
        type="add"
        :data="([] as any)"
        :tableheight="740"
        @switchAdd="switchMod"
      ></ArticleForm>
    </template>
    <!-- 修改文章 -->
    <template #popupModify>
      <ArticleForm
        type="modify"
        :data="modifyData!"
        :tableheight="740"
        @switchMod="switchMod"
      ></ArticleForm>
    </template>
  </SetRight>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/headSearch.scss");
</style>
