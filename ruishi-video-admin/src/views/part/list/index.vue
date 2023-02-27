<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5">
        <el-image :src="video.cover"></el-image>
      </el-col>
      <el-col :span="18" class="center">
        <el-descriptions
          title="视频信息"
          direction="vertical"
          :column="3"
          border
        >
          <el-descriptions-item label="视频名称">
            {{ video.title }}</el-descriptions-item
          >

          <el-descriptions-item label="其他介绍" :span="2">
            {{ video.other }}</el-descriptions-item
          >
          <el-descriptions-item label="视频分类">
            <el-tag
              class="mr-2"
              size="small"
              v-for="tag in video.category"
              :key="tag.cate_id"
              >{{ tag.cate_name }}</el-tag
            >
          </el-descriptions-item>
          <el-descriptions-item label="简介">
            {{ video.introduction }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-button type="success" class="mt-10" @click="addPart"
      >添加集数</el-button
    >
    <div class="part-list">
      <el-row class="flex">
        <el-col
          v-for="part in video.parts"
          :key="part.part_id"
          :span="4"
          style="margin-right: 20px; margin-bottom: 20px"
        >
          <el-card
            shadow="hover"
            :body-style="{
              padding: '0px',
              textAlign: 'center',
              cursor: 'pointer'
            }"
          >
            <img :src="part.cover" class="image" />
            <div style="padding: 14px">
              <span>{{ part.description }}</span>
            </div>
            <div class="bottom">
              <time class="time">时长：{{ part.duration }}</time>
              <div class="btn-group">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="editPart(part)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  plain
                  size="small"
                  @click="deletePart(part)"
                  >删除</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :before-close="dialogCloseHandle"
      v-model="dialog.visible"
      :append-to-body="true"
      width="30%"
      :title="dialog.title"
    >
      <el-form>
        <el-form-item label="集数介绍">
          <el-input v-model="partForm.description"></el-input>
        </el-form-item>
        <el-form-item label="视频上传">
          <!-- action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" -->

          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="fileChange"
            ref="uploadRef"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              把视频拖到这里或者<em>点击这里</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">只能上传视频</div>
            </template>
            <template #file> </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getPartInfoApi, addPartInfoApi, deletePartApi } from '@/api/video';
import { IVideoDetail, IPartInfo } from '@/api/video/types';
import { reactive, toRefs, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UploadFilled } from '@element-plus/icons-vue';
import type { UploadFile, UploadFiles } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';

const url =
  'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/91047440243791579860932097/coverBySnapshot/coverBySnapshot_10_0.jpg';

type STATE = {
  video: IVideoDetail;
  dialog: {
    visible: boolean;
    title: '新增' | '编辑';
  };
  partForm: IPartInfo;
  videoUrl: string;
  uploadFileInfo: UploadFile;
};

const state = reactive<STATE>({
  video: {} as IVideoDetail,
  dialog: {
    title: '新增',
    visible: false
  },
  partForm: {} as IPartInfo,
  videoUrl: '',
  uploadFileInfo: {} as UploadFile
});

const { video, dialog, partForm, videoUrl, uploadFileInfo } = toRefs(state);

const route = useRoute();
const router = useRouter();

async function initData() {
  const video_id = Number(route.params?.video_id);
  const result = await getPartInfoApi(video_id);
  video.value = result.data;
  console.log('result', result);
}
initData();

// 添加集数
function addPart() {
  dialog.value.visible = true;
}

// 编辑集数
function editPart(part: IPartInfo) {
  dialog.value.visible = true;
  // router.push({ name: 'editPart', params: { part_id: part.part_id } });
}

// 对话框关闭
function dialogCloseHandle() {
  dialog.value.visible = false;
}

// 文件状态发生改变
function fileChange(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  uploadFileInfo.value = uploadFile;
  console.log('uploadFile', uploadFile);
  console.log('UploadFiles', uploadFiles);
  // videoUrl.value = URL.createObjectURL(uploadFile.raw!);
}

// 保存/发送数据到后端
async function save() {
  const formData = new FormData();
  formData.append('description', partForm.value.description);
  formData.append('video_id', video.value.video_id + '');
  formData.append('file', uploadFileInfo.value.raw!);

  const result = await addPartInfoApi(formData);
  dialog.value.visible = false;
  initData();
}

// 删除视频
async function deletePart(part: IPartInfo) {
  ElMessageBox.confirm('确定要删除这集吗', '提示')
    .then(async () => {
      await deletePartApi(part.part_id);
      ElMessage.success('成功');
      initData();
    })
    .catch(() => {});
}
</script>

<style scoped lang="scss">
.app-container {
  background-color: #fff;
  height: 100%;

  .center {
    padding-left: 10px;
  }
  .part-list {
    margin-top: 20px;
  }
  .bottom {
    padding: 0 10px 10px;
    display: flex;
    justify-content: space-between;
    .time {
      color: #999 !important;
    }
  }
}
</style>

<style>
.app-main {
  background-color: #fff !important;
}
</style>
