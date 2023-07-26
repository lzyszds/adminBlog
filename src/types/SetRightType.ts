export interface Popup {
  addName: string,
  modifyName: string,
  addVisible: boolean,
  modifyVisible: boolean,
  addWidth: string,
  modifyWidth: string,
  addLeft: string,
  modifyLeft: string,
  addTop: string,
  modifyTop: string,
}

export interface Requirement {
  search: string,
  currentPage: number,
  pageSize: number,
  api: string
}
