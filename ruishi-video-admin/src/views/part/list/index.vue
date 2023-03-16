<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5">
        <el-image :src="video.cover"></el-image>
      </el-col>
      <el-col :span="18" class="center">
        <el-descriptions title="视频信息" direction="vertical" :column="3" border>
          <el-descriptions-item label="视频名称"> {{ video.title }}</el-descriptions-item>

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
    <el-button type="success" class="mt-10" @click="addPart">添加集数</el-button>
    <div class="part-list">
      <el-row class="flex">
        <el-col
          v-for="part in video.parts"
          :key="part.part_id"
          :span="4"
          style="margin-right: 20px; margin-bottom: 20px"
        >
          <el-tooltip
            class="box-item"
            effect="dark"
            content="点击预览视频"
            placement="top"
          >
            <el-card
              shadow="hover"
              :body-style="{
                padding: 0,
                cursor: part.url2 ? 'pointer' : 'not-allowed',
              }"
              @click="previewVideo(part)"
            >
              <div class="img-box">
                <img :src="part.cover" class="image" v-if="part.url2 || part.cover" />

                <!-- 不在上传中，但是却没有封面 -->
                <div class="tips" v-if="!part.uploading && !part.url">封面还在截取中</div>
                <!-- progress存在并且不等于100的时候才显示 或者 -->
                <el-progress
                  type="dashboard"
                  :percentage="part.progress"
                  :color="colors"
                  v-if="part.uploading && part.progress !== 100"
                />

                <!-- <div class="process" v-loading="part.status" v-else></div> -->
              </div>
              <div class="intro">
                <span>{{ part.description }}</span>
              </div>
              <div class="bottom">
                <el-button
                  :loading="!part.url2"
                  type="primary"
                  :icon="Edit"
                  circle
                  @click.stop="editPart(part)"
                />

                <!-- <el-button type="" @click.stop="" size="small">编辑</el-button> -->
                <el-button
                  :loading="!part.url2"
                  type="danger"
                  :icon="Delete"
                  circle
                  @click.stop="deletePart(part)"
                />
              </div> </el-card
          ></el-tooltip>
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
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="fileChange"
            ref="uploadRef"
            v-model:file-list="fileList"
          >
            <img v-if="cover" :src="cover" class="avatar" />
            <template v-else>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">把视频拖到这里或者<em>点击这里</em></div>
            </template>
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
    <!-- 预览视频组件 -->
    <previewDialog
      @closed="previewVisbile = false"
      v-if="previewVisbile"
      :part="partInfo"
      :src="partInfo.url"
    >
    </previewDialog>
  </div>
</template>

<script setup lang="ts">
import {
  getPartInfoApi,
  addPartInfoApi,
  deletePartApi,
  editPartApi,
  getPartDetailApi,
  createPartApi,
} from "@/api/video";
import { IPartInfo, IVideoInfo } from "@/api/video/types";
import { reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { UploadFilled, Edit, Delete } from "@element-plus/icons-vue";
import type { UploadFile, UploadFiles, UploadUserFile } from "element-plus";
import { ElMessageBox, ElMessage } from "element-plus";
import { useVodStore } from "@/store/modules/video";
import previewDialog from "./components/previewDialog.vue";

type STATE = {
  video: IVideoInfo;
  dialog: {
    visible: boolean;
    title: "新增" | "编辑";
  };
  partForm: IPartInfo;
  videoUrl: string;
  uploadFileInfo: UploadFile;
  showLoading: boolean;
  timer: number;
  fileList: UploadUserFile[];
  cover: string;
  previewVisbile: boolean;
  partInfo: IPartInfo;
};

const state = reactive<STATE>({
  video: {} as IVideoInfo,
  dialog: {
    title: "新增",
    visible: false,
  },
  partForm: {} as IPartInfo,
  videoUrl: "",
  uploadFileInfo: {} as UploadFile,
  showLoading: false,
  timer: 0,
  fileList: [],
  cover: "",
  previewVisbile: false,
  partInfo: {} as IPartInfo,
});

const {
  video,
  dialog,
  partForm,
  uploadFileInfo,
  showLoading,
  timer,
  fileList,
  cover,
  previewVisbile,
  partInfo,
} = toRefs(state);

const vodStore = useVodStore();

const { colors } = toRefs(vodStore);

const route = useRoute();

// 初始化数据
async function initData() {
  const video_id = Number(route.params?.video_id);
  partForm.value.video_id = video_id;
  console.log("route", route);
  const { data } = await getPartInfoApi(video_id);
  showLoading.value = false;
  data.parts?.forEach((item: IPartInfo) => {
    // 如果url为空，表示在转码中
    if (!item.url || item.url.trim() === "") {
      item.status = true;
      // 为true表示要轮询，false将会取消轮询
      showLoading.value = true;
    } else {
      item.status = false;
    }
  });
  video.value = data;
  polling();
}
initData();

// 轮询转码状态
function polling() {
  clearInterval(timer.value);
  timer.value = 0;
  timer.value = setInterval(() => {
    if (!showLoading.value) {
      clearInterval(timer.value);
      timer.value = 0;
    } else {
      console.log("轮询");
      initData();
    }
  }, 5000);
  // timer.value = s
}

// 添加集数
function addPart() {
  dialog.value.visible = true;
}

// 编辑集数
async function editPart(part: IPartInfo) {
  const { data } = await getPartDetailApi(part.part_id);
  dialog.value.visible = true;
  dialog.value.title = "编辑";
  partForm.value = data;
  cover.value = partForm.value.cover;
}

// 对话框关闭
function dialogCloseHandle() {
  dialog.value.visible = false;
  partForm.value = {} as IPartInfo;
  fileList.value = [];
  cover.value = "";
  uploadFileInfo.value = {} as UploadFile;
}

// 上传之前

// 文件状态发生改变
function fileChange(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  uploadFileInfo.value = uploadFile;
  fileList.value = [];
  cover.value = "";
  fileList.value.push(uploadFile);
  console.log("uploadFile", uploadFile);
  console.log("UploadFiles", uploadFiles);
}

// 保存/发送数据到后端
async function save() {
  let part = {} as IPartInfo;
  // part_id存在表示编辑
  if (partForm.value.part_id) {
    partForm.value.video_id = Number(route.params?.video_id);
    const { data } = await editPartApi(partForm.value.part_id, partForm.value);
    part = data;
  } else {
    const { data } = await createPartApi(partForm.value);
    part = data;
    console.log("data", data);
  }
  // 先同步执行获取数据的方法，保证为最新的数据
  await initData();
  // 如果uploadFileInfo不为空，表示要进行上传
  if (Object.values(uploadFileInfo.value).length !== 0) {
    console.log("obj", part);
    console.log("uploadFileInfo.value", uploadFileInfo.value);
    uploadVod(part);
  }
  // 手动执行对话框关闭事件
  dialogCloseHandle();
}

// 删除视频
async function deletePart(part: IPartInfo) {
  ElMessageBox.confirm("确定要删除这集吗", "提示")
    .then(async () => {
      await deletePartApi(part.part_id);
      ElMessage.success("成功");
      initData();
    })
    .catch(() => {});
}

async function uploadVod(data: IPartInfo) {
  console.log("video.value", video.value);
  // 查找最新的video的parts
  const obj = video.value.parts?.find((item) => {
    // 查找最新数据的id === 传入的id
    if (item.part_id === data.part_id) {
      // 给这个对象加上 以下属性
      item.progress = 0;
      // 表示上传中
      item.uploading = true;
      return item;
    }
  });
  const file = new File([uploadFileInfo.value.raw!], `${data.part_id}.mp4`);
  // 利用浅拷贝的特点，将上传中的part传到上传方法
  // useUploadToVod在更新上传进度的时候 页面的对象也可以跟着变化
  vodStore.useUploadToVod(file, obj as IPartInfo, () => {
    initData();
  });
}

// 视频预览
async function previewVideo(part: IPartInfo) {
  const { data } = await getPartDetailApi(part.part_id);
  // 如果视频没上传完成，则不能进行点击
  if (part.url2.trim() === "") {
    return;
  }
  previewVisbile.value = true;
  partInfo.value = data;
  console.log("partInfo.value", partInfo.value);
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
  .intro {
    margin-top: 10px;
    text-align: center;
  }
  .bottom {
    text-align: center;
    padding: 0 20px 10px;
    display: flex;
    justify-content: space-between;
  }

  .img-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    max-height: 140px;
    min-height: 100px;
    .process {
      max-height: 140px;
      min-height: 100px;
    }
  }
}

::deep(.el-upload-list__item-file-name) {
  overflow: hidden;
  max-width: 300px;
  display: block;
}
</style>

<style>
.app-main {
  background-color: #fff !important;
}
</style>
