import { PageDto } from './pagination.dto';
import { rslog } from 'src/utils/rslog';
import { Repository, Like } from 'typeorm';

export class Pagination {
  /**
   * 根据关键字 模糊查询数据  带分页
   */
  async findByKeyword<T>(
    repository: Repository<T>,
    pager: PageDto,
    conditions?: string[],
    order?: any,
    relations?: string[],
  ) {
    const { keyword, pageNum, pageSize } = pager;
    const _pageNum = pageNum || 1;
    const _pageSize = pageSize || 5;
    const where = [];

    conditions?.forEach((item) => {
      where.push({
        [item]: Like(`%${keyword}%`),
      });
    });

    const skip = (_pageNum - 1) * _pageSize;
    const result = await repository.findAndCount({
      order,
      where,
      skip,
      take: _pageSize,
      relations,
    });
    const count = result[1];
    const totalPage = Math.ceil(count / _pageSize);
    return {
      data: result[0],
      total: count,
      totalPage,
    };
  }
}
