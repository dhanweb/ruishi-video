import { transcodingResult } from './../upload/dto/transcoding.dto';
import { RedisInstance } from 'src/common/redis';
import { rslog } from 'src/utils/rslog';
import { VodUploadClient, VodUploadRequest } from 'vod-node-sdk';
// import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import tencentcloud = require('tencentcloud-sdk-nodejs');
const VodClient = tencentcloud.vod.v20180717.Client;
import configuration from '../../../config/index';
const { file } = configuration();

const Redis = null;
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
          // Redis = await RedisInstance.initRedis('ruishi-video', 0);
          // // 将转码的任务id放入缓存  键为part_id
          // Redis.setex(part_id, 300000, TaskId);
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
