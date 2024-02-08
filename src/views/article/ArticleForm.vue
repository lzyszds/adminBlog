<script setup lang="ts">
import { dayjs, ElMessageBox, ElNotification } from "element-plus";
import http, { HttpResonse } from "@/http/http";
import toolbar from "@/utils/toolbar";
import { compressPic } from "@/utils/utils";
import { TagDataType, Props, InformationTypes, ArticledataType } from "@/types/ArticleType";
const articledata = useStorage("articledata", {} as ArticledataType);

if (articledata.value.title) {
  ElMessageBox({
    title: "提示",
    message: h("p", null, [h("span", null, "是否继续完成上次内容?")]),
    showCancelButton: true,
    confirmButtonText: "可以",
    cancelButtonText: "不了",
  }).then(() => {
    information.text = articledata.value.content;
    information.title = articledata.value.title;
    information.cover = articledata.value.cover_img;
    // tagData.value = articledata.value.wtype.split(",");
  }).catch(() => {
    localStorage.removeItem("articledata");
  })
}

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
    : "/api/article/getRandArticleImg"
});
//确认提交
const submitForm = () => {
  const isModify = props.type === "modify"
  const url = isModify ? "/article/updateArticle" : "/article/addArticle";
  //当前是否保存
  if (
    information.storage.text === information.text ||
    information.storage.html === information.html
  ) {
    http("post", url, setData()).then((res: any) => {
      if (res.code === 200) {
        if (isModify) {
          emit("switchMod", { flag: false, data: res.data, type: '修改' });
        } else {
          emit("switchAdd", { flag: false, data: res.data, type: '新增' });
        }
      }
    }).catch((e) => {
      if (isModify) {
        emit("switchMod", { flag: true, data: e, type: '修改' });
      } else {
        emit("switchAdd", { flag: true, data: e, type: '新增' });
      }
    })
  } else {
    ElMessageBox({
      title: "提示",
      message: h("p", null, [h("span", null, "确定要发布文章吗？")]),
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }).then(() => {
      const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
      save.click();
      submitForm();
    });
  }
};
//暂存按钮
const resetForm = () => {
  const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
  save.click();
  articledata.value = setData();
};
//本地图片上传到线上，并返回当前文件在线上的path
const handleUploadImage = (event, insertImage, files) => {
  console.log(event);

  //如果文件大小小于300kb，不进行压缩，按比例压缩
  const scale = files[0].size < 300 * 1024 ? 1 : 0.5;
  //对图片进行压缩
  compressPic(files[0], scale).then(async ({ fileCompress }) => {
    console.log(`lzy  fileCompress:`, fileCompress)
    // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    let formData = new FormData();
    formData.append("upload-image", fileCompress);

    let headers = {
      "Content-Type": "multipart/form-data",
    };
    // 此处即为向编辑框中插入的内容，url即为图片上传后返回的链接
    const res = await http<string>("post", "/article/uploadArticleImg", formData, headers);
    if (res.code === 200) {
      insertImage({
        url: "/adminPublic" + res.data,
        desc: "点击放大",
      });
    }
  }).catch((e) => {
    console.log(e);
  })
};
const clicks = (text, html) => {
  information.storage = { text, html };
};

function setData(): ArticledataType {
  const isModify = props.type === "modify";
  return {
    title: information.title,
    //文章开头第一段话
    partial_content: document.querySelector(".vuepress-markdown-body")?.firstElementChild!.innerHTML!,
    content: information.storage.text,
    main: information.storage.html,
    cover_img: (information.cover || props.data?.cover_img)?.replace(
      "/adminPublic",
      ""
    )!,
    aid: isModify ? props.data?.aid! : null,
    modified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    tags: tagDataTem.value,
  };
}
const coverFile = ref<HTMLInputElement>();
//异步执行，等待dom渲染完成
nextTick(() => {
  //通过点击图片 ，获取图片的src 以及将图片存入线上服务器
  useEventListener(coverFile, "change", () => {
    const files = coverFile.value!.files as FileList;
    //对图片进行压缩
    compressPic(files[0], 0.5).then(({ fileCompress }) => {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      let formData = new FormData();
      formData.append("upload-image", fileCompress);

      let headers = {
        "Content-Type": "multipart/form-data",
      };
      // 此处即为向编辑框中插入的内容，url即为图片上传后返回的链接
      http("post", "/article/uploadArticleImg", formData, headers).then(
        (res: HttpResonse<string>) => {
          if (res.code === 200) {
            information.cover = "/adminPublic" + res.data;
          } else {
            console.log(res.msg);
          }
        }
      );
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
const tagData: any = ref([]);
//当前文章的标签数据 当前文章的标签数据 是否已经有标签
// tagData.value = props.data?.w ? props.data?.wtype.split(",") : [];
//临时存储数据
const tagDataTem: any = ref(tagData.value);
//标签列表
const tagList = ref<TagDataType[]>();

try {
  //获取标签列表
  const result = await http("get", "/article/getArticleTypeList") as any;
  tagList.value = result.data;
} catch (e) {
  console.log(e);
}

const tagActive = (tag) => {
  //数量不能超过4个
  if (tagDataTem.value.length >= 4) {
    console.log(123);
    ElNotification({
      title: "提示",
      message: "最多只能选择4个标签",
      type: "warning",
    });
    return;
  }
  if (tagDataTem.value.includes(tag)) {
    tagDataTem.value = tagDataTem.value.filter((item) => item !== tag) as any;
  } else {
    tagDataTem.value.push(tag);
  }
};
const tagActiveClass = (tag) => {
  return tagDataTem.value.includes(tag) ? "tag-active" : "";
};
const addTag = (flag: boolean) => {
  if (flag == true) tagData.value = tagDataTem.value;
  else tagDataTem.value = tagData.value;
  visible.value = false;
};
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
    return tagDataTem.value.push(typeInput.value);
  }
  const result = await http<null>("post", "/article/addArticleType", { name: typeInput.value });
  if (result.code == 200) {
    const { data } = await http<TagDataType[]>("get", "/article/addArticleType");
    console.log(data);
  }
};
</script>

<template>
  <div>
    <div class="headelement">
      <div class="markDowmInput">
        <span>类别：</span>
        <el-popover :width="380" placement="bottom" :visible="visible" trigger="click">
          <template #reference>
            <!-- <el-tooltip class="box-item" @click="visible = true" effect="dark" content="点击分类选择" placement="top"> -->
            <div class="boxType" @click="visible = true">
              <el-tag class="ml-1" type="info" v-for="(item, index) in tagData" :key="index">{{ item }}</el-tag>
            </div>
            <!-- </el-tooltip> -->
          </template>
          <template #default>
            <div class="typePopover">
              <div class="item-search">
                <input v-model="typeInput" @keydown.enter="addArticleType" type="text" placeholder="自定义标签" />
                <button @click="addArticleType">添加</button>
              </div>
              <div class="item-box">
                <el-tag type="info" v-for="(item, index) in tagList" :key="index" @click="tagActive(item.name)"
                  :class="tagActiveClass(item.name)">{{ item.name }}
                </el-tag>
              </div>
              <div class="item-tool">
                <button @click="addTag(false)">取消</button>
                <button @click="addTag(true)">确定</button>
              </div>
            </div>
          </template>
        </el-popover>
        <span>封面图片：</span>
        <div @click="coverUpdate" class="coverImg">
          <img :src="information.cover" alt="" />
          <input type="file" ref="coverFile" id="coverFile" />
        </div>
        <span>文章标题：</span>
        <input class="title" type="text" v-model="information.title" />
      </div>
      <v-md-editor class="markDowmLzy" v-model="information.text" :disabled-menus="[]" :left-toolbar="orderTool"
        @save="clicks" @upload-image="handleUploadImage" :height="(tableheight! * 0.9) + 'px'" :toolbar="toolbar">
      </v-md-editor>
    </div>
    <div class="btnTool">
      <el-button class="card-button" type="primary" @click="submitForm()">发布内容</el-button>
      <el-button class="card-button" @click="resetForm()">暂存内容</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.headelement {
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
      cursor: var(--linkCup);

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
      line-height: 35px;
      cursor: var(--linkCup);

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
    cursor: var(--linkCup);
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

.el-popper.is-light>.typePopover {
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
    cursor: var(--linkCup);
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
    }
  }
}
</style>

