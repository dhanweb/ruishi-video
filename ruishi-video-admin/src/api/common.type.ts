/**
 * 返回的分页列表数据
 */
export interface PageListType<T> {
  data: T;
  count: number;
  totalPage: number;
}

/**
 * 分页参数
 */
export interface PagerParams {
  keyword: string;
  pageSize: number;
  pageNum: number;
  order?: 'ASC' | 'DESC';
}
