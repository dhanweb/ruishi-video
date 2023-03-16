import Redis from 'ioredis';

// import { redisConfig, redisClusterConfig } from '../../config/redis.config';
import configuration from '../../config';
const { redis } = configuration();

export class RedisInstance {
  static async initRedis() {
    // if (connectType && connectType === 'cluster') {
    //   const cluster = new Redis.Cluster(redis);
    //   cluster.on('error', (err) => console.log('Redis cluster Error', err));
    //   cluster.on('connect', () => console.log('redis集群连接成功'));
    //   return cluster;
    // } else {
    const ioredis = new Redis(redis.port, redis.host, { name: redis.name });
    ioredis.on('error', (err) => console.log('Redis cluster Error', err));
    ioredis.on('connect', () => console.log('redis连接成功'));
    return ioredis;
    // }
  }
}
