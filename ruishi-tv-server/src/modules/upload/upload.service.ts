import { rslog } from 'src/utils/rslog';
import { Injectable } from '@nestjs/common';
import { uploadCos } from './tencent.cos';
import tencentcloud = require('tencentcloud-sdk-nodejs');
const VodClient = tencentcloud.vod.v20180717.Client;
import configuration from '../../../config/index';
const { file } = configuration();
// 实例化要请求产品的client对象,clientProfile是可选的
const client = new VodClient({
  secretId: file.SecretId,
  secretKey: file.SecretKey,
});

@Injectable()
export class UploadService {
  // uploadPic(filePath, file) {
  //   uploadCos()
  // }
  uplods() {
    const params = {
      MediaType: 'mp4',
      Region: 'ap-guangzhou',
    };
    client.ApplyUpload(params, (err, data) => {
      if (err) {
        // reject(err);
        rslog.error('error:', err);
      } else {
        rslog.log('DescribeTasks:data', data);
        // resolve(data);
      }
    });
  }
  CommitUpload() {
    const params = {
      Region: 'ap-guangzhou',

      VodSessionKey:
        '3FEmq9DWHlB/Cekv0oUhRk1a35GeKd8umpeWV5N04EAOH1swAIGPs5h01B13ViAl1VDBkCo5zEKZ+lH3eLwzwWXs1y1WHOwjJPcT5ed46J3BY4/0JAqcNnXeTIJoTG+69aUPCpRGeaCofA95eZy5zEV+YPZ2ELaXBb+kGRlMSmKcJTs8MO27C5iFWZ4Jov+SRZ2L5tDXfdDxLWERjrbmejpmufvO17SQOJFcvUdCnG5V8Tw7DZgWFhyu3m2Zo0TfzNIFWesdBOdIQ6VNgebVwHW/pD1Smttj+o/AYZLmPOzuOrTsLhvP+Ta6hri0WzRW//RsffRLwZtEyfvc15TEmrT+ShTwH93X6kDmmNf6bIFa4hXgAgIlJDuLP6IJ2PMKM0BkQEKEqe+o7L+dY46NkoGyHSvPqxsP66Zv8KB2OKjyI/4lFlX99J9sFgsabyPrWPkGvnz4jPsUrLN4zkL8WS+1RDfbpWbBfHlJs1vnPZKEGS8lsDag3NYIyEnjS3a5jpaO0eI12Xf5m7zYeIuMvSOOJ/3BuazlIvQi/2LYl+4H/hF+LW1q',
    };
    client.CommitUpload(params, (err, data) => {
      if (err) {
        // reject(err);
        rslog.error('error:', err);
      } else {
        rslog.log('DescribeTasks:data', data);
        // resolve(data);
      }
    });
  }
}
