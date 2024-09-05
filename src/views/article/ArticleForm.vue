<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import http, { HttpResonse } from "@/http";
import toolbar from "@/utils/toolbar";
import { optimizeImage, isEqual, toProxys, tipNotify, setMession } from "@/utils/utils";
import {
  TagDataType,
  Props,
  InformationTypes,
  ArticledataType,
} from "@/types/ArticleType";
import {
  addArticleCategory,
  articleAdd,
  articleEditor,
  getArticleCategory,
  uploadArticleImg,
} from "@/api/article";
import { Response } from "@/types/PublicType";
// 获取数据
const {
  value: { title, content, cover_img },
} = useStorage("articledata", {} as ArticledataType);
const emit = defineEmits(["switchMod", "switchAdd"]);
const orderTool = `emoji undo redo clear |h bold italic strikethrough quote addTag  mark |left center right ul ol table hr | link image code tip music| save tips`;
const props = defineProps<Props>();

const information = reactive<InformationTypes>({
  storage: { text: "", html: "" },
  text: props.data?.content,
  html: props.data?.main,
  title: props.data?.title || "",
  cover: props.data?.cover_img
    ? "/adminPublic" + props.data?.cover_img
    : "/firstHonoApi/api/article/getRandArticleImg?time=" + new Date().getTime(),
});

const message = h("p", null, [h("span", null, "是否继续完成上次内容?")]);
const config = {
  title: "提示",
  message,
  showCancelButton: true,
  confirmButtonText: "可以",
  cancelButtonText: "不了",
};

// 异步函数，用于显示MessageBox
(async () => {
  try {
    // 如果存在title
    if (title) {
      // 等待MessageBox显示结果
      const result = await ElMessageBox(config);
      // 如果点击了确认按钮
      if (result === "confirm") {
        // 设置information对象的属性
        information.text = content;
        information.title = title;
        information.cover = cover_img;
        // 如果需要，可以在这里处理wtype的逻辑
      }
    }
  } catch (error) {
    // 打印错误信息
    console.error("Error displaying MessageBox:", error);
  }
})();

const protoInformation = toProxys(props.data!);
// 确认提交
const submitForm = async () => {
  const { type } = props;
  const data = setData(type);
  // 检查内容是否相同
  try {
    const res = type === "modify" ? await articleEditor(data) : await articleAdd(data);
    console.log(`lzy  res:`, res);
    if (res.code === 200) {
      emitResult(type === "modify" ? "Mod" : "Add", res.data, false);
    } else {
      tipNotify("添加失败" + res.msg, 2000);
    }
  } catch (e) {
    //添加失败
    tipNotify("添加失败", 2000);
  }

  const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
  save.click();
};

// 发送结果
const emitResult = async (type, data, isError) => {
  const emitName = `switch${type}` as "switchMod" | "switchAdd";
  emit(emitName, {
    flag: isError,
    data,
    type: type === "Mod" ? "修改" : "新增",
  });
};
//暂存按钮
const resetForm = () => {
  const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
  save.click();
  // articledata.value = setData();
};
const handleUploadImage = async (event, insertImage, files) => {
  // 如果文件大小小于300kb，不进行压缩，按比例压缩
  const scale = files[0].size < 300 * 1024 ? 1 : 0.5;

  try {
    // 对图片进行压 缩
    const { fileCompress } = await optimizeImage(files[0], scale);

    // 上传图片
    const res = await uploadArticleImg<string>(fileCompress);
    console.log(`lzy  res:`, res);

    if (res.code === 200) {
      insertImage({
        url: "/adminPublic" + res.data,
        desc: "点击放大",
      });
    }
  } catch (e) {
    console.error("图片上传或插入过程中出现错误:", e);
    // 可以在这里添加错误处理逻辑，例如重试上传或通知用户
  }
};

const saveToInformationStorage = (text, html) => {
  // 确保information对象和storage属性已经定义
  if (!information || !information.storage) {
    throw new Error("information.storage未定义");
  }
  information.storage = { text, html };
};

/**
 * 设置数据
 * @returns {ArticledataType} 文章数据
 */
function setData(type: "modify" | "add"): ArticledataType {
  // 判断是否修改文章
  const isModify = type === "modify";
  // 初始化文章数据
  console.log(information.html);
  const data = {
    title: information.title, // 文章标题
    partial_content: document.querySelector(".vuepress-markdown-body")?.firstElementChild!
      .innerHTML!, // 文章开头第一段话
    content: information.text, // 文章内容
    main: document.querySelector(".vuepress-markdown-body")?.innerHTML!, // 文章主体内容
    cover_img: (information.cover || props.data?.cover_img)?.replace("/adminPublic", "")!, // 文章封面图片
    aid: isModify ? props.data?.aid! : null, // 文章ID（修改时为当前文章ID，创建时为null）
    tags: tagDataTem.value, // 文章标签
  };
  // 判断数据是否与原始数据相同
  return isEqual(data, protoInformation, "aid");
}

const coverFile = ref<HTMLInputElement>();
//异步执行，等待dom渲染完成
nextTick(() => {
  //通过点击图片 ，获取图片的src 以及将图片存入线上服务器
  useEventListener(coverFile, "change", () => {
    const files = coverFile.value!.files as FileList;
    //对图片进行压缩
    optimizeImage(files[0], 0.5).then(({ fileCompress }) => {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      let formData = new FormData();
      formData.append("upload-image", fileCompress);

      let headers = {
        "Content-Type": "multipart/form-data",
      };
      // 此处即为向编辑框中插入的内容，url即为图片上传后返回的链接
      http({
        url: "/article/uploadArticleImg",
        method: "post",
        data: formData,
        headers,
      }).then((res: HttpResonse<string>) => {
        if (res.code === 200) {
          information.cover = "/adminPublic" + res.data;
        } else {
          console.log(res.msg);
        }
      });
    });
  });
});
//更新封面
const coverUpdate = () => {
  //将input type=file 作用触发 从而触发change事件
  coverFile.value!.click();
};

//标签弹窗控制flag
const visible = ref<boolean>(false);
//全部标签数据
const tagData: any = ref(props.data?.tags || []);
//当前文章的标签数据 当前文章的标签数据 是否已经有标签
// tagData.value = props.data?.w ? props.data?.wtype.split(",") : [];
//临时存储数据
const tagDataTem: any = ref(tagData.value);
//标签列表
const tagList = ref<TagDataType[]>();
// 获取标签列表
try {
  const result = await getArticleCategory<Response<TagDataType>>();
  tagList.value = result.data.data;
} catch (e) {
  console.log(e);
}

// 标签激活函数
const tagActive = (tag) => {
  if (tagDataTem.value.includes(tag)) {
    // 如果存在则删除
    tagDataTem.value.splice(tagDataTem.value.indexOf(tag), 1);
  } else {
    if (tagDataTem.value.length >= 4) {
      setMession("warning", "最多只能选择4个标签");
      return;
    }
    tagDataTem.value.push(tag);
  }
};

// 标签激活类名
const tagActiveClass = (tag) => {
  return tagDataTem.value.includes(tag) ? "tag-active" : "";
};

// 添加标签
const addTag = (flag: boolean) => {
  if (flag) {
    tagData.value = tagDataTem.value;
  } else {
    tagDataTem.value = tagData.value;
  }
  visible.value = false;
};

// 输入类型
const typeInput = ref("");
//添加文章分类小标题
const addArticleType = async () => {
  //非空判断
  if (!typeInput.value) return;

  //获取当前所有的文章分类
  const data = tagList.value!.map((res) => {
    return res.name;
  });
  //判断当前输入的类型是否已经存在 如果不存在 则添加
  if (data?.includes(typeInput.value as any)) {
    if (tagDataTem.value.includes(typeInput.value as any)) {
      return setMession("warning", "该标签已存在");
    }
    return tagDataTem.value.push(typeInput.value);
  }
  await addArticleCategory({ name: typeInput.value });
  const { data: tagData } = await getArticleCategory<Response<TagDataType>>();
  tipNotify("添加成功");
  tagList.value = tagData.data;
};
</script>

<template>
  <div>
    <div class="headelement">
      <div class="markDowmInput">
        <span>类别：</span>
        <ElPopover
          :width="380"
          placement="bottom"
          :visible="visible"
          trigger="click"
          transition="el-zoom-in-top"
        >
          <template #reference>
            <!-- <el-tooltip class="box-item" @click="visible = true" effect="dark" content="点击分类选择" placement="top"> -->
            <div class="boxType" @click="visible = true">
              <el-tag
                class="ml-1"
                type="info"
                v-for="(item, index) in tagData"
                :key="index"
                >{{ item }}</el-tag
              >
            </div>
            <!-- </el-tooltip> -->
          </template>
          <template #default>
            <div class="typePopover">
              <div class="item-search">
                <input
                  v-model="typeInput"
                  @keydown.enter="addArticleType"
                  type="text"
                  placeholder="自定义标签"
                />
                <button @click="addArticleType">添加</button>
              </div>
              <div class="item-box">
                <el-tag
                  type="info"
                  v-for="(item, index) in tagList"
                  :key="index"
                  @click="tagActive(item.name)"
                  :class="tagActiveClass(item.name)"
                  >{{ item.name }}
                </el-tag>
              </div>
              <div class="item-tool">
                <button @click="addTag(false)">取消</button>
                <button @click="addTag(true)">确定</button>
              </div>
            </div>
          </template>
        </ElPopover>
        <span>封面图片：</span>
        <div @click="coverUpdate" class="coverImg">
          <img :src="information.cover" alt="" />
          <input type="file" ref="coverFile" id="coverFile" />
        </div>
        <span>文章标题：</span>
        <input class="title" type="text" v-model="information.title" />
      </div>
      <v-md-editor
        class="markDowmLzy"
        v-model="information.text"
        :disabled-menus="[]"
        :left-toolbar="orderTool"
        @save="saveToInformationStorage"
        @upload-image="handleUploadImage"
        height="95%"
        :toolbar="toolbar"
      >
      </v-md-editor>
    </div>
    <div class="btnTool">
      <ElButton class="card-button" type="primary" @click="submitForm()"
        >发布内容</ElButton
      >
      <ElButton class="card-button" @click="resetForm()">暂存内容</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.headelement {
  height: 70vh;
  & .v-md-editor {
    box-shadow: 1px 1px 5px 1px #0000001a;
  }

  .markDowmInput {
    height: 40px;
    display: flex;
    font-size: 20px;
    align-items: center;
    background-color: #fff;
    color: #000;
    // border-radius: 5px;
    font-family: "almama";
    // border: 1px solid var(--themeColor);
    padding: 0 0 0 20px;
    border-bottom: 2px solid #000;
    border-radius: 10px 10px 0 0;

    span {
      font-size: 1vmax;
    }

    .coverImg {
      position: relative;
      height: 85%;
      margin-right: 30px;
      cursor: pointer;

      #coverFile {
        display: none;
      }

      &:after {
        content: "+";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        border-radius: 50%;
        border: 1px solid #fff;
        width: 20px;
        height: 20px;
        line-height: 16px;
        text-align: center;
      }

      img {
        width: 100px;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      flex: 3;
      border: none;
      outline: none;
      font-size: 20px;
    }

    .boxType {
      // flex: 1;
      width: 300px;
      height: 100%;
      overflow-y: hidden;
      overflow-x: auto;
      text-overflow: inherit;
      border: none;
      outline: none;
      font-size: 20px;
      white-space: nowrap;
      margin: 0 30px 0 0;
      line-height: 40px;
      cursor: pointer;

      &:deep(.el-tag.el-tag--info) {
        background-color: var(--themeColor);
        color: #fff;
        border: 2px solid #000;
        margin-right: 5px;
        font-size: 12px;
      }
    }
  }

  .fa-folder-open {
    cursor: pointer;
  }

  :deep(.v-md-editor__menu)::-webkit-scrollbar {
    height: 0;
  }

  ::-webkit-scrollbar {
    height: 0;
  }
}

.btnTool {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;

  .card-button {
    // transform: translate(-50%, 100%);
    width: 100px;
    border-radius: 1rem;
    border: none;
    background-color: var(--themeColor);
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    transition: 0.3s ease-out;

    &:nth-child(2) {
      background-color: #fff;
      color: var(--themeColor);
      border: 2px solid var(--themeColor);
    }

    &:hover {
      transform: scale(1.1);
    }
  }
}

.el-popper.is-light > .typePopover {
  .item-search {
    display: flex;
    border-bottom: 2px solid var(--themeColor);

    input {
      width: 100%;
      border: none;
      padding-bottom: 5px;

      &:focus {
        outline: none;
      }
    }

    button {
      border: none;
      background-color: var(--themeColor);
      color: #fff;
      width: 60px;
      border-radius: 5px;
      margin-left: 10px;
      margin-bottom: 3px;
    }
  }

  &:deep(.el-tag.el-tag--info) {
    margin-top: 10px;
    margin-left: 4px;
    background-color: #fff;
    color: #000;
    user-select: none;
    cursor: pointer;
    border: 2px solid #000;

    &.tag-active {
      background-color: var(--themeColor);
      color: #fff;
    }
  }

  .item-tool {
    text-align: right;
    margin-top: 10px;
    padding-top: 10px;

    button {
      border: none;
      background-color: var(--themeColor);
      color: #fff;
      width: 60px;
      border-radius: 5px;
      margin-left: 10px;
      margin-bottom: 3px;
      border: 2px solid #000;
    }
  }
}
</style>

<!-- 修改自定义elementPlus 动画 -->
<style lang="scss">
.el-popper {
  animation-duration: 0.5s; /* 你可以调整这个值 */
  animation-fill-mode: both;
}
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  animation: zoomInDown 0.5s;
  transform: none;
  transition: var(--el-transition-md-fade);
}

.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  transform: none;
  animation: zoomOutDown 0.5s;
}
</style>
