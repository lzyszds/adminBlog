export interface httpData {
  code: number
  data?: [],
  total?: number,
  msg?: string,
  err?: object
}

export interface User {
  uid: string
  uname: string
  username: string,
  password: string,
  power: string,
  createDate: string,
  lastLoginDate: string,
  headImg: string,
  setHeadImg: string,
  date?: any,
  perSign: string,
}

