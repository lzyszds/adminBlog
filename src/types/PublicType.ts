
export interface Response<T> {
  total: number;
  data: T[]
}

export interface PaginatedResponse<T> {
  data: Response<T>;
  code: number;
  msg: string;
}
