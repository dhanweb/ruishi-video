import { Repository } from 'typeorm';
export class PageDto {
  keyword: string;
  pageNum: number;
  pageSize: number;
  order?: 'ASC' | 'DESC';
}

export class OrderDto {
  [item: string]: 'ASC' | 'DESC';
}

// export class WhereDto = {

// }

export class FindByKeywordDto<T> {
  repository: Repository<T>;
  pager: PageDto;
  order?: never;
  conditions?: T[];
}
