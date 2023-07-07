<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, h, onMounted, onBeforeUnmount } from 'vue'
import { dayjs, ElMessageBox } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import http from '@/http/http'
import toolbar from './toolbar'
import { compressPic } from '@/utils/common'

const emit = defineEmits(['switchMod', 'switchAdd'])
const orderTool = `emoji undo redo clear |h bold italic strikethrough quote addTag  test |left center right ul ol table hr | link image code tip music| save tips`
const props = defineProps({
  type: String,
  data: Object,
  tableheight: Number,
})


interface storageType {
  text: string,
  html: string,
}
interface informationTypes {
  storage: storageType,
  text: any,
  html: any,
  title: string,
  cover: string,
}

const information = reactive<informationTypes>({
  storage: { text: '', html: '' },
  text: props.data?.content,
  html: props.data?.html,
  title: props.data?.title || '',
  cover: props.data?.coverImg || '/public/img/articleImages/upload-image1667660540602.jpeg',
})
//确认提交
const submitForm = () => {
  const data = {
    author: 'lzy',
    title: information.title,
    //文章开头第一段话
    coverContent: document.querySelector('.vuepress-markdown-body')?.firstElementChild?.innerHTML,
    content: information.storage.text,
    main: information.storage.html,
    coverImg: information.cover || props.data!.coverImg,
    aid: props.type === 'modify' ? props.data?.aid : null,
    modified: dayjs().unix(),
    wtype: tagData.value,
  }
  const url = props.type === 'modify' ? 'updateArticle' : 'addArticle'
  //当前是否保存
  if (information.storage.text === information.text || information.storage.html === information.html) {
    http('post', `/adminApi/${url}`, data).then((res: any) => {
      if (res.code === 200) {
        emit('switchMod', false)
        emit('switchAdd', false)
      }
    })
  } else {
    ElMessageBox({
      title: '提示',
      message: h('p', null, [
        h('span', null, '输入内容还未保存，是否需要保存 '),
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(() => {
        const save = document.querySelector('.v-md-icon-save') as HTMLLIElement
        save.click()
        submitForm()
      })
  }
}
//暂存按钮
const resetForm = () => {

}
//本地图片上传到线上，并返回当前文件在线上的path
const handleUploadImage = (event, insertImage, files) => {
  console.log(event);
  //对图片进行压缩
  compressPic(files[0], 0.5).then(({ fileCompress }) => {
    // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    let formData = new FormData();
    formData.append('upload-image', fileCompress);

    let headers = {
      'Content-Type': 'multipart/form-data',
    }
    // 此处即为向编辑框中插入的内容，url即为图片上传后返回的链接
    http('post', '/adminApi/uploadArticleImg', formData, headers)
      .then((res: { code: Number, message }) => {
        if (res.code === 200) {
          insertImage({
            url: '/adminApi' + res.message,
            desc: '点击放大',
          });
        }
      })
  })
}
const clicks = (text, html) => {
  information.storage = { text, html, }
}

//异步执行，等待dom渲染完成 
onMounted(() => {
  //通过点击图片 ，获取图片的src 以及将图片存入线上服务器 
  const coverFile = document.querySelector('#coverFile') as HTMLInputElement
  useEventListener(coverFile, 'change', () => {
    const files = coverFile.files as FileList;
    //对图片进行压缩
    compressPic(files[0], 0.5).then(({ fileCompress }) => {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      let formData = new FormData();
      formData.append('upload-image', fileCompress);

      let headers = {
        'Content-Type': 'multipart/form-data',
      }
      // 此处即为向编辑框中插入的内容，url即为图片上传后返回的链接
      http('post', '/adminApi/uploadArticleImg', formData, headers)
        .then((res: { code: Number, message }) => {
          if (res.code === 200) {
            information.cover = res.message
          }
        })
    })
  })
})
//更新封面
const coverUpdate = () => {
  //将input type=file 作用触发 从而触发change事件
  const coverFile = document.querySelector('#coverFile') as HTMLInputElement
  coverFile.click()
}

interface TagType {
  code?: string,
  data?: [
    {
      isUse: string,
      name: string,
      tId: number
    }
  ]
}
const visible = ref<boolean>(false)
const tagData: any = ref([])
tagData.value = props.data?.wtype ? props.data?.wtype.split(',') : []
const tagDataTem: any = ref(tagData.value)
const tagList = ref<TagType>({})

tagList.value = await http('get', '/adminApi/articleType') as TagType

const tagActive = (tag) => {
  if (tagDataTem.value.includes(tag)) {
    tagDataTem.value = tagDataTem.value.filter(item => item !== tag) as any
  } else {
    tagDataTem.value.push(tag)
  }
}
const tagActiveClass = (tag) => {
  return tagDataTem.value.includes(tag) ? 'tag-active' : ''
}
const addTag = (flag: boolean) => {
  if (flag == true) tagData.value = tagDataTem.value
  else tagDataTem.value = tagData.value
  visible.value = false

}
const typeInput = ref('')
const addArticleType = () => {
  const data = tagList.value.data?.map(res => {
    return res.name
  })
  if (data?.includes(typeInput.value as any)) {
    return tagDataTem.value.push(typeInput.value)
  }
  if (!typeInput.value) return
  const result = http('post', '/adminApi/addArticleType', { name: typeInput.value })
  result.then(async (res: any) => {
    if (res.code == 200) {
      tagList.value = await http('get', '/adminApi/articleType') as TagType
    }
  })
}
onBeforeUnmount(() => {
  Object.keys(information).map(item => {
    information[item] = ''
  })
  tagList.value = {}
  tagData.value = []
  tagDataTem.value = []
  typeInput.value = ''
})
</script>

<template>
  <div>
    <div class="headelement">
      <div class="markDowmInput">
        <span>封面图片：</span>
        <div @click="coverUpdate" class="coverImg">
          <img :src="'/adminApi' + information.cover" alt="">
          <input type="file" id="coverFile">
        </div>
        <span>文章标题：</span>
        <input class="title" type="text" v-model="information.title" />
        <span>类别：</span>
        <div class="boxType">
          <el-tag class="ml-1" type="info" v-for="(item, index) in tagData" :key="index">{{ item }}</el-tag>
        </div>

        <el-popover :width="380" placement="left" :visible="visible" trigger="click">
          <template #reference>
            <div @click="visible = true">
              <el-tooltip class="box-item" effect="dark" content="分类选择" placement="top">
                <i class="fa fa-folder-open"></i>
              </el-tooltip>
            </div>
          </template>
          <template #default>
            <div class="typePopover">
              <div class="item-search">
                <input v-model="typeInput" @keydown.enter="addArticleType" type="text" placeholder="自定义标签">
                <button @click="addArticleType">添加</button>
              </div>
              <div class="item-box">
                <el-tag type="info" v-for="(item, index) in tagList?.data" :key="index" @click="tagActive(item.name)"
                  :class="tagActiveClass(item.name)">{{
                    item.name
                  }}
                </el-tag>
              </div>
              <div class="item-tool">
                <button @click="addTag(false)">取消</button>
                <button @click="addTag(true)">确定</button>
              </div>
            </div>
          </template>
        </el-popover>
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
    font-family: 'almama';
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
        content: '+';
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

      &:deep(.el-tag.el-tag--info) {
        background-color: var(--themeColor);
        color: #fff;
        border: 2px solid #000;
        margin-right: 5px;
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
    padding: .5rem 1rem;
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

