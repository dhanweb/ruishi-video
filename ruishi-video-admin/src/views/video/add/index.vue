<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form
        ref="videoFormRef"
        :model="videoForm"
        :rules="videoFormRules"
        label-width="80px"
      >
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="videoForm.title" placeholder="请输入视频标题" />
        </el-form-item>
        <el-form-item label="视频分类" prop="title">
          <el-checkbox-group v-model="videoForm.cate_id">
            <el-checkbox
              v-for="item in cateList"
              :key="item.cate_id"
              :label="item.cate_id"
              >{{ item.cate_name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="视频介绍" prop="introduction">
          <el-input
            type="textarea"
            v-model="videoForm.introduction"
            placeholder="请输入视频介绍"
          />
        </el-form-item>

        <el-form-item label="其他介绍" prop="other">
          <el-input v-model="videoForm.other" placeholder="请输入其他介绍" />
        </el-form-item>

        <el-form-item label="上映年份" prop="release">
          <el-input v-model="videoForm.release" placeholder="请输入上映年份" />
        </el-form-item>

        <el-form-item label="其他介绍" prop="release">
          <el-radio-group v-model="videoForm.is_deleted">
            <el-radio :label="true">上架</el-radio>
            <el-radio :label="false">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="UploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="coverUrl" :src="coverUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(videoFormRef)">
            保存
          </el-button>
          <!-- <el-button @click="resetForm(videoFormRef)">Reset</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ICateInfo, IVideoInfo } from '@/api/video/types';
import {
  getVideoInfoApi,
  addVideoApi,
  editVideoApi,
  getCate2List
} from '@/api/video';
import { reactive, toRefs } from 'vue';
import type { FormRules, FormInstance, UploadProps } from 'element-plus';
import { UploadUrl } from '@/globalVar';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

interface STATE {
  videoForm: IVideoInfo;
  videoFormRules: FormRules;
  videoFormRef: FormInstance;
  coverUrl: string;
  video_id: number;
  cateList: ICateInfo[];
}

const state = reactive<STATE>({
  videoForm: <IVideoInfo>{
    is_deleted: false
  },
  videoFormRules: {},
  videoFormRef: <FormInstance>{},
  coverUrl: '',
  video_id: 0,
  cateList: []
});

const {
  videoForm,
  videoFormRef,
  videoFormRules,
  coverUrl,
  video_id,
  cateList
} = toRefs(state);

const route = useRoute();
const router = useRouter();

async function initData() {
  const cateRes = await getCate2List();

  cateList.value = cateRes.data;
  video_id.value = route.params?.video_id as never as number;
  // 如果带有视频id  获取视频信息
  if (video_id.value) {
    const result = await getVideoInfoApi(video_id.value);
    const { data } = result;
    videoForm.value = data;
    coverUrl.value = data.cover;
    videoForm.value.cate_id = [];
    data.category.forEach((item: ICateInfo) => {
      videoForm.value.cate_id.push(item.cate_id);
    });
  }
}
initData();
// 提交表单
async function submitForm(formEl: FormInstance | undefined) {
  if (video_id.value) {
    await editVideoApi(video_id.value, videoForm.value);
    ElMessage.success('编辑成功');
    router.push({ name: 'videoList' });
  } else {
    await addVideoApi(videoForm.value);
    ElMessage.success('添加成功');
    router.push({ name: 'videoList' });
  }
  videoForm.value = <IVideoInfo>{};
}

// 封面图片上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  coverUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log('response', response);
  console.log('uploadFile', uploadFile);
  videoForm.value.cover = response.data;
};
</script>

<style scoped lang="less"></style>
