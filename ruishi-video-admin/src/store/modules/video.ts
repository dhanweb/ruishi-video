import { defineStore } from 'pinia';
import { ref } from 'vue';
// 上传到腾讯云点播的方法
import TcVod from 'vod-js-sdk-v6';
import { getSignature, sentUploadProgress } from '@/api/video';
import { IPartInfo } from '@/api/video/types';

// 回调结果说明;
type DoneResult = {
  fileId: string;
  video: {
    url: string;
  };
  cover: {
    url: string;
  };
};

export const useVodStore = defineStore('video', () => {
  // 上传进度
  const progress = ref<number>(0);
  const colors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 }
  ];

  /**
   *
   * @param mediaFile 上传的文件
   * @param obj 上传的对象，作用是保存上传进度
   * @param callback 回调函数  用作上传完成之后调用接口重新请求数据
   */
  const useUploadToVod = (
    mediaFile: File,
    obj: IPartInfo,
    callback: () => void
  ) => {
    const tcVod = new TcVod({
      getSignature: getSignature
    });

    const uploader = tcVod.upload({
      mediaFile: mediaFile // 媒体文件（视频或音频或图片），类型为 File
    });
    uploader.on('media_progress', async function (info) {
      console.log(info); // 进度
      // obj.progress = info.percent * 100;
      const progress = info.percent * 100;
      await sentUploadProgress({
        part_id: obj?.part_id,
        progress
      });
      obj.progress = progress;
    });
    uploader.on('media_upload', function (info) {
      console.log('media_upload', info);
    });

    uploader
      .done()
      .then(function (doneResult: DoneResult) {
        // deal with doneResult
        console.log('doneResult', doneResult);
        obj.url2 = doneResult.video.url;
        setTimeout(() => {
          obj.uploading = false;
        }, 300);
        callback && callback();
      })
      .catch(function (err) {
        // deal with error
        console.log('err', err);
      });
  };

  // function useUploadToVod(file: File, obj) {
  //   tcVodUpload(getSignature, file);
  // }

  return {
    progress,
    useUploadToVod,
    colors
  };
});
