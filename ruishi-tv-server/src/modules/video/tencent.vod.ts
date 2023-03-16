import { IEventSet } from './dto/create-video.dto';
import { transcodingResult } from './../upload/dto/transcoding.dto';
import { rslog } from 'src/utils/rslog';
import { VodUploadClient, VodUploadRequest } from 'vod-node-sdk';
import tencentcloud = require('tencentcloud-sdk-nodejs');
const VodClient = tencentcloud.vod.v20180717.Client;

import { stringify } from 'querystring';
import { createHmac } from 'crypto';
import configuration from '../../../config/index';
const { file } = configuration();

// import { RedisInstance } from '../../common/redis';
// import type { Redis } from 'ioredis';
// let redis = {} as Redis;

// function initRedis() {
//   RedisInstance.initRedis().then(async (res) => {
//     redis = res;
//   });
// }
/**
 * 视频上传
 * @param filePath 视频绝对路径
 */
export const uploadVod = async (
  part_id: number,
  filePath: string,
): Promise<{ TaskId: string }> => {
  return new Promise((resolve, reject) => {
    const client = new VodUploadClient(file.SecretId, file.SecretKey);

    const req = new VodUploadRequest();
    req.MediaFilePath = filePath;

    client.upload(
      'ap-guangzhou',
      req,
      async function (err, data: { FileId: string }) {
        if (err) {
          // 处理业务异常
          rslog.warn('error', err);
          reject(err);
        } else {
          // 获取上传成功后的信息
          console.log('上传成功后的信息', data);
          const { FileId } = data;
          // 开始转码
          const result = await transcodingVideo(FileId);
          // const { TaskId } = result;
          resolve(result);
        }
      },
    );
  });
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new VodClient({
  secretId: file.SecretId,
  secretKey: file.SecretKey,
});

/**
 * 视频转码
 * @param fileId 上传到腾讯云点播的文件id，视频上传完成之后会返回
 */
const transcodingVideo = async (fileId): Promise<{ TaskId: string }> => {
  return new Promise((resolve, reject) => {
    const params = {
      FileId: fileId,
      MediaProcessTask: {
        TranscodeTaskSet: [
          {
            Definition: 100210,
          },
        ],
        CoverBySnapshotTaskSet: [
          {
            Definition: 10,
            PositionType: 'Percent',
            PositionValue: Math.ceil(Math.random() * 80),
          },
        ],
      },
    };

    client.ProcessMedia(params, async (err, data: { TaskId: string }) => {
      if (err) {
        reject(err);
        rslog.error('error:', err);
      } else {
        rslog.log('transcodingVideo:data', data);
        resolve(data);
      }
    });
  });
};

/**
 * 获取任务详情/转码进度
 * @param TaskId 任务id
 */
export const getTaskDetail = (TaskId): Promise<transcodingResult> => {
  const params = {
    TaskId,
  };
  return new Promise((resolve, reject) => {
    client.DescribeTaskDetail(params, (err, data) => {
      if (err) {
        reject(err);
        rslog.error('error:', err);
      } else {
        rslog.log('gettTskDetail:data', data);
        resolve(data);
      }
    });
  });
};

/**
 * 获取事件通知
 */

export const getPullEventsVod = (): Promise<IEventSet> => {
  return new Promise((resolve, reject) => {
    const params = {};
    client.PullEvents(params, (err, data) => {
      if (err) {
        rslog.error('error:', err);
      } else {
        rslog.log('DescribeTasks:data', data);
        resolve(data);
      }
    });
  });
};

/**
 * 修改文件信息
 */
export function modifyMediaInfoVod(FileId: string, Name: string) {
  const params = {
    FileId,
    Name,
  };
  client.ModifyMediaInfo(params, (err, data) => {
    if (err) {
      rslog.error('error:', err);
    } else {
      rslog.log('DescribeTasks:data', data);
    }
  });
}

/**
 * 拉取云点播事件通知状态
 */
export const getDescribeEventsState = () => {
  const params = {};
  client.DescribeEventsState(params, (err, data) => {
    if (err) {
      // reject(err);
      rslog.error('error:', err);
    } else {
      rslog.log('DescribeTasks:data', data);
      // resolve(data);
    }
  });
};

/**
 * 生成上传签名
 */
export const generateSignature = () => {
  // initRedis();
  // 生成随机数用作id

  // redis.set(random, random);
  // 确定 app 的云 API 密钥
  const secret_id = file.SecretId;
  const secret_key = file.SecretKey;

  // 确定签名的当前时间和失效时间
  const current = parseInt(new Date().getTime() / 1000 + '');
  const expired = current + 86400; // 签名有效期：1天

  // 向参数列表填入参数
  const arg_list = {
    secretId: secret_id,
    currentTimeStamp: current,
    expireTime: expired,
    random: Math.round(Math.random() * Math.pow(2, 32)),
    storageRegion: 'ap-guangzhou',
    // 任务流模板，转码+截取封面
    procedure: 'turnHlsAndCover',
    taskNotifyMode: 'Change',
  };

  // 计算签名
  const orignal = stringify(arg_list);
  const orignal_buffer = Buffer.from(orignal, 'utf8');

  const hmac = createHmac('sha1', secret_key);
  const hmac_buffer = hmac.update(orignal_buffer).digest();

  const signature = Buffer.concat([hmac_buffer, orignal_buffer]).toString(
    'base64',
  );
  rslog.log('signature', signature);
  return signature;
};

/**
 * 确认事件通知
 */
export function confirmEventsVod(eventHandle: string[]) {
  const params = {
    EventHandles: eventHandle,
  };
  client.ConfirmEvents(params, (err, data) => {
    if (err) {
      // reject(err);
      rslog.error('error:', err);
    } else {
      rslog.log('DescribeTasks:data', data);
      // resolve(data);
    }
  });
}
