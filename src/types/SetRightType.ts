export interface Popup {
  addName: string,
  modifyName: string,
  addVisible: boolean,
  modifyVisible: boolean,
  addWidth: string,
  modifyWidth: string,
  addLeft?: string,
  modifyLeft?: string,
  addTop?: string,
  modifyTop?: string,
  alignCenter?: boolean,
}

export interface Requirement {
  search: string,
  pages: number,
  limit: number,
  api: string
}
