declare global {
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  interface PageResult<T> {
    list: T;
    total: number;
  }
  type DialogType = {
    title?: string;
    visible: boolean;
  };

  type OptionType = {
    value: string;
    label: string;
    checked?: boolean;
    children?: OptionType[];
  };

  interface PagerParams {
    keyword: string;
    pageSize: number;
    pageNum: number;
    order?: 'ASC' | 'DESC';
  }

  interface PageListType<T> {
    data: T;
    count: number;
    totalPage: number;
  }
  /**
   * 封装全局的返回类型
   */
  type ResultType<T> = AxiosPromise<T>;
}
export {};
