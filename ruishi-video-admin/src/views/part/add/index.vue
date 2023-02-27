<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form
        ref="partFormRef"
        :model="partForm"
        :rules="partFormRules"
        label-width="80px"
      >
        <el-form-item label="集数介绍" prop="title">
          <el-input v-model="partForm.title" placeholder="请输入集数介绍" />
        </el-form-item>
        <!--
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
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm(partFormRef)">
            保存
          </el-button>
          <!-- <el-button @click="resetForm(partFormRef)">Reset</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ICateInfo, IVideoInfo, IPartInfo } from '@/api/video/types';
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

interface STATE {
  partForm: IVideoInfo;
  partFormRules: FormRules;
  partFormRef: FormInstance;
  coverUrl: string;
  video_id: number;
  cateList: ICateInfo[];
}

const state = reactive<STATE>({
  partForm: <IVideoInfo>{
    is_deleted: false
  },
  partFormRules: {},
  partFormRef: <FormInstance>{},
  coverUrl: '',
  video_id: 0,
  cateList: []
});

const { partForm, partFormRef, partFormRules, coverUrl, video_id, cateList } =
  toRefs(state);

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
    partForm.value = data;
    coverUrl.value = data.cover;
    partForm.value.cate_id = [];
    data.category.forEach((item: ICateInfo) => {
      partForm.value.cate_id.push(item.cate_id);
    });
  }
}
initData();
// 提交表单
async function submitForm(formEl: FormInstance | undefined) {
  if (video_id.value) {
    await editVideoApi(video_id.value, partForm.value);
    ElMessage.success('编辑成功');
    router.push({ name: 'videoList' });
  } else {
    await addVideoApi(partForm.value);
    ElMessage.success('添加成功');
    router.push({ name: 'videoList' });
  }
  partForm.value = <IVideoInfo>{};
}

// 封面图片上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  coverUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log('response', response);
  console.log('uploadFile', uploadFile);
  partForm.value.cover = response.data;
};
</script>

<style scoped lang="less"></style>
