<script setup lang="ts">
import { ref, reactive, provide } from "vue";
import SetRight from "@/components/SetRight.vue";
import { LNotification, setMession } from "@/utils/utils";
import { ElTableColumn, dayjs } from "element-plus";
import { articleDelete, articleDetail, articleList } from "@/api/article";

import { ElNotification } from "element-plus";
import { ArticleMultipleDataType, Article } from "@/types/ArticleType";
import ArticleForm from "@/views/article/ArticleForm.vue";

import { useStore } from "@/store";
import { Popup, Requirement } from "@/types/SetRightType";
const state = useStore();

//页面配置
const requirement = reactive<Requirement>({
  search: "", //搜索内容
  pages: 1, //当前页数
  limit: 9, //每页显示条数
  api: articleList,
});
//自动加载数据
await state.handleCurrentChange<Article[]>(requirement);
//屁用没有，但是必须写，不然排序不了 使用模板的table列
const formatter = () => {
  return 0;
};

//修改用户按钮，点击后弹出确认框
const modifyData = ref<ArticleMultipleDataType>();

const modifyThe = (event: ArticleMultipleDataType) => {
  //根据点击的文章id获取文章详情信息
  articleDetail(event.aid).then((res: any) => {
    modifyData.value = res.data;
    popup.modifyVisible = true;
  });
};

//删除文章
const _delete = async (event) => {
  try {
    const res = await articleDelete<string>({ id: event.aid });
    console.log(`lzy  res:`, res);

    setMession(res.code === 200 ? "success" : "error", res.data);

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
const switchMod = async (arr: { flag: boolean; data: any; type: "修改" | "新增" }) => {
  console.log(`lzy  arr:`, arr);
  arr.type == "修改" ? (popup.modifyVisible = arr.flag) : (popup.addVisible = arr.flag);
  setMession(!arr.flag ? "success" : "error", arr.data + "文章");

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
      <ElTableColumn
        property="aid"
        label="Id"
        sortable
        width="80"
        align="center"
      ></ElTableColumn>
      <!-- <ElTableColumn property="uname" label="作者" width="80" show-overflow-tooltip>
      </ElTableColumn> -->
      <ElTableColumn label="文章封面" width="180" align="center">
        <template #default="{ row }">
          <div>
            <img
              v-ImgLoading
              :src="'/adminPublic' + row.cover_img"
              data-fancybox="gallery"
              title="o"
              alt=""
            />
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn
        property="title"
        label="文章标题"
        sortable
        width="300"
        show-overflow-tooltip
      >
      </ElTableColumn>
      <ElTableColumn label="创建时间" sortable :sort-method="formatter" width="160">
        <template #default="{ row }">
          <div class="svgTem">
            <i class="iconfont">&#x100d9;</i>
            {{ dayjs(row.create_date).format("YYYY.MM.DD") }}
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="最近修改时间" sortable :sort-method="formatter" width="150">
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
      </ElTableColumn>
      <!-- <ElTableColumn property="guid" label="文章路径" sortable>
        <template #default="{ row }">
          <div class="guidCup">
            <a target="_blank" :href="'/home/detail/' + row.aid">
              {{ "/home/detail/" + row.aid }}
            </a>
          </div>
        </template>
      </ElTableColumn> -->
      <ElTableColumn property="tags" label="类型" sortable>
        <template #default="{ row }">
          <div class="tags">
            <ElTag type="info" v-for="item in row.tags">{{ item }}</ElTag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn fixed="right" label="操作" width="140">
        <template #default="{ row }">
          <div class="tool">
            <ElButton type="primary" size="small" @click="modifyThe(row)">修改</ElButton>
            <ElButton type="danger" size="small" @click="_delete(row)">删除</ElButton>
          </div>
        </template>
      </ElTableColumn>
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
