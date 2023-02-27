import configuration from 'config/index';
import { rslog } from 'src/utils/rslog';
// src/database/redis.ts
import Redis from 'ioredis';

const config = configuration();

let n = 0;
const redisIndex = []; // 用于记录 redis 实例索引
const redisList = []; // 用于存储 redis 实例

export class RedisInstance {
  static async initRedis(method: string, db = 0) {
    const isExist = redisIndex.some((x) => x === db);
    if (!isExist) {
      rslog.debug(
        `[Redis ${db}]来自 ${method} 方法调用, Redis 实例化了 ${++n} 次 `,
      );
      redisList[db] = new Redis({ ...config.redis, db });
      redisIndex.push(db);
    } else {
      rslog.debug(`[Redis ${db}]来自 ${method} 方法调用`);
    }
    return redisList[db];
  }
}
