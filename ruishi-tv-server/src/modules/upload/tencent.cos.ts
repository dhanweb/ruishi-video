import { rslog } from 'src/utils/rslog';

import configuration from '../../../config/index';
import { createReadStream, statSync } from 'fs';
const { file } = configuration();
// const COS = require('cos-nodejs-sdk-v5');
import COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
  SecretId: file.SecretId,
  SecretKey: file.SecretKey,
});

// const filePath = 'temp-file-to-upload'; // 本地文件路径
/**
 *
 * @param filePath 本地文件路径
 * @param filePath 保存到文件服务器的名字
 * @param type 图片的类型  用于对象存储中分类
 *
 */
export const uploadCos = (
  filePath: string,
  fileName: string,
  type: 'avatar' | 'cover',
) => {
  return new Promise((resolv, reject) => {
    cos.putObject(
      {
        /* 存储桶的名称，命名规则为 BucketName-APPID，此处填写的存储桶名称必须为此格式 */
        Bucket: file.Bucket,
        Region: file.Region /* 存储桶所在地域，例如 ap-beijing，必须字段 */,
        /* 上传到对象存储的文件名（例如1.jpg，a/b/test.txt），必须字段 */
        Key: type + '/' + fileName,
        StorageClass: file.StorageClass,
        /* 当 Body 为 stream 类型时，ContentLength 必传，否则 onProgress 不能返回正确的进度信息 */
        Body: createReadStream(filePath), // 上传文件对象
        ContentLength: statSync(filePath).size,
        onProgress: function (progressData) {
          rslog.log(JSON.stringify(progressData));
        },
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolv('https://' + data.Location);
          console.log('data', data);
        }
      },
    );
  });
};
