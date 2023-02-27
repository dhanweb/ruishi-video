import { Repository, EntityOptions } from 'typeorm';

export class Pagination {
  /**页码 */
  private pageNum: number;
  /**每页显示条数 */
  private pageSize: number;
  /**总页数 */
  private totalPage: number;
  /**总条目数 */
  private total: number;
  /**数据 */
  public data?: never[];

  public get getPageNum() {
    return this.pageNum;
  }

  public set setPageNum(pageNum: number) {
    this.pageNum = pageNum;
  }
  public get getPageSize() {
    return this.pageSize;
  }

  public set setPageSize(pageSize: number) {
    this.pageSize = pageSize;
  }
  public get getTotalPage() {
    return this.totalPage;
  }

  public set setTotalPage(totalPage: number) {
    this.totalPage = totalPage;
  }
  public get getTotal() {
    return this.total;
  }

  public set setTotal(total: number) {
    this.total = total;
  }
  public get getData() {
    return this.data;
  }

  public set setData(data: never[]) {
    this.data = data;
  }

  public static async findByPage<T>(repository: Repository<T>) {
    // repository.find({
    //   where:
    // })
  }
}
