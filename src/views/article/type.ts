export interface httpData {
  code: number
  data: [],
  total?: number,
  message?: string,
  err?: object
}

export interface Article {
  aid: string
  authorId: string
  createTime: string,
  title: string,
  content: string,
  modified: string,
  guid: string,
  wtype: string
}
