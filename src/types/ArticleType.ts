
export interface Article {
  aid: string
  author: string
  comNumber: string,
  content: string,
  coverContent: string,
  coverImg: string,
  createTime: string,
  main: string,
  modified: string,
  title: string,
  wtype: string,
}
export interface TagDataType {
  isUse: string,
  name: string,
  tId: number
}


export interface Props {
  type: string,
  data?: Article,
  tableheight: number,
}

export interface Storagetype {
  text: string,
  html: string,
}
export interface InformationTypes {
  storage: Storagetype,
  text: any,
  html: any,
  title: string,
  cover: string,
}

export interface ArticledataType {
  author: string,
  title: InformationTypes['title'],
  //文章开头第一段话
  coverContent: string,
  content: InformationTypes['storage']['text'],
  main: InformationTypes['storage']['html'],
  coverImg: string,
  modified: number,
  wtype: string,
  aid: string | null,
}
