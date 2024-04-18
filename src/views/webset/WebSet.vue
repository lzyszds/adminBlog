<script setup lang="ts">
import { WebDataType } from "@/types/WebSetType";
import { ElButton, ElInput } from "element-plus";
import { useStore } from "@/store";
import LzyIcon from "@/components/lzyIcon.vue";
const state = useStore();

const { $axios } = window;

const loadGifList = await $axios({
  url: "/common/getLoadGif",
  method: "get",
});

const result = await $axios({
  url: "/common/getSystemConfig",
  method: "get",
});

const footerData = await $axios({
  url: "/common/getFooterInfo",
  method: "get",
});
const footerRefData = ref(footerData);

state.loading = false;
const webData = reactive<WebDataType>(
  result.reduce((acc, cur) => {
    acc[cur.config_key] = cur.config_value;
    return acc;
  }, {} as WebDataType)
);

//点击加载图片将图片地址设置为系统的加载图片
const handleLoadGif = async (val: string) => {
  webData.loadGif = val;
  await updateSystemData("loadGif", val, 5);
};

//更新系统配置
const updateSystemData = async (key: string, val: string, id: number) => {
  return await $axios({
    url: "/common/updateSystemConfig",
    method: "post",
    data: {
      config_key: key,
      config_value: val,
      config_id: id,
    },
  });
};

let id = 1000;

const append = (data: any) => {
  const newChild = { id: id++, label: "testtest", children: [] };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  footerRefData.value = [...footerRefData.value];
};

const remove = (node: Node, data: any) => {
  console.log(`lzy  node:`, node);
  const parent = node.parent;
  const children: any[] = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.footer_id === data.footer_id);
  children.splice(index, 1);
  footerRefData.value = [...footerRefData.value];
};
</script>

<template>
  <div class="webset-container">
    <h3>系统配置</h3>
    <div class="setLoadGif">
      <div class="loadGifList">
        <div
          v-for="(item, index) in loadGifList"
          :key="index"
          :class="['loadGifItem', { active: item === webData.loadGif }]"
          @click="handleLoadGif(item)"
        >
          <img :src="'/api' + item" alt="" />
        </div>
      </div>
    </div>

    <div class="setSystem">
      <div
        class="rows"
        v-for="(item, index) in result"
        :key="index"
        :title="item.config_desc"
        v-show="item.config_key !== 'loadGif'"
      >
        <ElInput class="inputKey" v-model="item.config_key" />
        <ElInput class="inputValue" v-model="item.config_value" />
        <LzyBtn
          class="btn"
          name="gg:clipboard"
          tipsContent="保存"
          position="center"
        ></LzyBtn>
      </div>
    </div>

    <div class="setFooter">
      <el-tree
        style="max-width: 600px"
        :data="footerRefData"
        show-checkbox
        node-key="footer_id"
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span v-if="!data.footer_url">{{ data.footer_content }}</span>
            <ElInput v-else v-model="data.footer_content" size="small" />
            <ElInput
              v-if="data.footer_url"
              v-model="data.footer_url"
              size="small"
            />
            <span>
              <a @click="append(data)"> 新增 </a>
              <a @click="remove(node, data)"> 删除 </a>
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
  gap: 20px;
  & .el-input:nth-child(1) {
    width: 200px;
  }
}
</style>

<style lang="scss" scoped>
.webset-container {
  padding: 20px;
  display: grid;
  grid-template-rows: 25px 1fr 300px 180px;
  color: var(--themeColor);

  & > h3 {
    font-size: 20px;
    margin: 0;
    font-family: "dindin";
    text-align: center;
  }

  .setLoadGif {
    border: 3px solid var(--themeColor);
    border-radius: 10px;
    padding: 15px;
    position: relative;

    &::before {
      content: "图片懒加载动画选择";
      display: block;
      clear: both;
      position: absolute;
      z-index: 99;
      top: -5px;
      left: 5px;
      background-color: #fff;
      padding: 0 5px;
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .loadGifList {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;

      .loadGifItem {
        img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
          filter: blur(3px);
          cursor: pointer;
          border: 2px solid transparent;
        }
        &:hover {
          img {
            filter: blur(0);
          }
        }
        &.active {
          img {
            filter: blur(0);
            border: 2px solid var(--themeColor);
          }
        }
      }
    }
  }
  .setSystem {
    display: grid;
    gap: 8px;
    grid-template-rows: repeat(auto-fill, minmax(50px, 1fr));
    overflow-y: auto;
    padding: 5px;
    padding-left: 0;
    .rows {
      display: grid;
      align-items: center;
      grid-template-columns: 200px 1fr 40px;
      position: relative;
      justify-content: center;

      &::before {
        content: attr(title);
        display: block;
        clear: both;
        position: absolute;
        z-index: 99;
        top: -5px;
        left: 5px;
        background-color: #fff;
        padding: 0 5px;
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.3rem;
        color: #000;
        font-family: "dindin";
      }
      .inputKey {
        border: 3px solid var(--themeColor);
        border-radius: 0;
        border-right: none;
        border-radius: 7px 0 0 7px;
        :focus {
          border-color: #409eff;
        }
      }
      .inputValue {
        border: 3px solid var(--themeColor);
        border-radius: 0;
        border-width: 3px 0 3px 0;
        // border-radius: 0 7px 7px 0;
        :focus {
          border-color: #409eff;
        }
        &::before {
          content: " ";
          display: block;
          width: 3px;
          height: 100%;
          background-color: var(--themeColor);
          z-index: 99;
          position: absolute;
          left: 0;
          top: 0%;
        }
      }
      .btn {
        border: 3px solid var(--themeColor);
        border-radius: 0;
        border-left: none;
        border-radius: 0 7px 7px 0;
        padding: 0 10px;
        height: 36.8px;
      }

      :deep(.el-input__wrapper) {
        box-shadow: none;
      }
    }
  }
  .setFooter {
    overflow-y: auto;
  }
}
</style>
