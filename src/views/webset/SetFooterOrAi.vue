<script setup lang="ts">
const { $axios } = window;
import { LNotification } from "@/utils/utils";
const aiKeyData = await $axios({
  url: "/aiService/getAiKeysList",
  method: "get",
});

const footerData = await $axios({
  url: "/common/getFooterInfo",
  method: "get",
});
const footerRefData = ref(footerData);

const append = (data: any) => {
  const newChild = {};
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  footerRefData.value = [...footerRefData.value];
};

const remove = (node: Node, data: any) => {
  //@ts-ignore
  const parent = node.parent;
  const children: any[] = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.footer_id === data.footer_id);
  children.splice(index, 1);
  footerRefData.value = [...footerRefData.value];
};

const save = async (data) => {
  const result = await $axios({
    url: "/common/updateFooterInfo",
    method: "post",
    data: data,
  });
  if (result.code === 200) {
    LNotification(result.message, 2000, "bottom-right", "success");
  }
};

//通过数据返回当前节点的级别
const getLevel = (data: any) => {
  if (data.footer_content == "页脚数据设置") {
    return 1;
  } else if (!data.footer_url) {
    return 2;
  } else {
    return 3;
  }
};
</script>

<template>
  <div class="setFooterOrAi">
    <div class="setAikey">
      <ElTable
        :data="[...aiKeyData, ...aiKeyData, ...aiKeyData]"
        style="width: 100%; max-height: 420px; overflow-y: auto"
      >
        <ElTableColumn prop="keyName" label="AiKey" width="100">
          <template #default="scope">
            <ElInput v-model="scope.row.keyName" size="small" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="keyValue" label="AiValue">
          <template #default="scope">
            <ElInput v-model="scope.row.keyValue" size="small" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="操作" width="80px">
          <template #default>
            <ElButton size="small">删除</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div class="setFooter">
      <el-tree
        style="max-width: 600px"
        :data="footerRefData"
        node-key="footer_id"
        default-expand-all
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span v-if="getLevel(data) === 1">{{ data.footer_content }}</span>
            <ElInput v-else v-model="data.footer_content" size="small" />
            <ElInput v-if="data.footer_url" v-model="data.footer_url" size="small" />
            <span>
              <a v-if="getLevel(data) === 1" @click="save(data)"> 保存设置 </a>
              <a v-if="getLevel(data) !== 1" @click="remove(node, data)"> 删除 </a>
              <a v-if="getLevel(data) !== 3" @click="append(data)"> 新增 </a>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  gap: 5px;
  & .el-input:nth-child(1) {
    width: 200px;
  }
}
</style>
<style lang="scss" scoped>
.setFooterOrAi {
  display: grid;
  grid-template-columns: 1fr 1fr;

  .setAikey {
    border: 3px solid var(--themeColor);
    border-radius: 10px 0 0 10px;
    /* 隐藏滚动条 */
    ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    .ElTable {
      border-radius: 10px;
    }
  }
  .setFooter {
    border: 3px solid var(--themeColor);
    border-left: none;
    overflow-y: auto;
    border-radius: 0;
    padding: 5px 0;
    border-radius: 0 10px 10px 0;
  }
}
</style>
