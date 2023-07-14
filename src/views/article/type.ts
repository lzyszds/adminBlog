export interface httpData {
  code: number
  data: [],
  total?: number,
  message?: string,
  err?: object
}

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
export interface TagType {
  code?: string,
  data?: [
    {
      isUse: string,
      name: string,
      tId: number
    }
  ]
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
export interface Informationtypes {
  storage: Storagetype,
  text: any,
  html: any,
  title: string,
  cover: string,
}
