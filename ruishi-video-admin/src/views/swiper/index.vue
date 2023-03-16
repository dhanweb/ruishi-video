<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <el-button type="success" :icon="Plus" @click="handleAdd">
          添加</el-button
        >
      </template>
      <el-table :data="tableData">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="title" label="标题介绍"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.url" :alt="row.title" />
          </template>
        </el-table-column>
        <el-table-column label="点击跳转的视频">
          <template #default="{ row }">
            {{ row.video.title }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="editSwiper(row)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="deleteSwiper(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      append-to-body
      width="50%"
      @close="dialogClose"
    >
      <el-form :model="form">
        <el-form-item label="介绍">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="视频">
          <el-cascader
            v-model="form.video_id"
            :props="cascadeProps"
            :show-all-levels="false"
            :placeholder="cascaderValue.label"
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            :action="UploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getSwiperListApi,
  addSwiperApi,
  updateSwiperApi,
  deleteSwiperApi
} from '@/api/swiper';
import { getCateListApi, getVideoByCateApi } from '@/api/video';
import { ICateInfo, IVideoInfo } from '@/api/video/types';
import { ISwiper, ISwiperParam } from '@/api/swiper/types';
import { reactive, toRefs } from 'vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import type { UploadProps, CascaderProps, CascaderValue } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { UploadUrl } from '@/globalVar';

type CascaderType = {
  value: number;
  label: string;
  leaf?: boolean;
};

type STATE = {
  tableData: ISwiper[];
  dialog: { title: '添加' | '编辑'; visible: boolean };
  form: ISwiperParam;
  imgUrl: string;
  cascadeProps: CascaderProps;
  cascaderValue: CascaderType;
};

const state = reactive<STATE>({
  tableData: [],
  dialog: {
    title: '添加',
    visible: false
  },
  form: {} as ISwiperParam,
  imgUrl: '',
  cascadeProps: {} as CascaderProps,
  cascaderValue: {} as CascaderType
});

const { tableData, dialog, form, imgUrl, cascadeProps, cascaderValue } =
  toRefs(state);

async function initData() {
  const result = await getSwiperListApi();
  tableData.value = result.data;

  setCascaderProps();
}
initData();

async function getCateList() {
  const { data: catedata } = await getCateListApi();
  let newCate: CascaderType[] = [];
  catedata.forEach((item: ICateInfo) => {
    item.children?.forEach((child: ICateInfo) => {
      newCate.push({
        value: child.cate_id,
        label: child.cate_name,
        leaf: false
      });
    });
  });
  return newCate;
  // category.value = newCate;
}

function getVideo(cate_id: number) {
  return new Promise<CascaderType[]>((resolve, reject) => {
    getVideoByCateApi({
      category: [+cate_id]
    }).then((res: any) => {
      const { data: videoData } = res;
      let newVideo: CascaderType[] = [];
      videoData.forEach((item: IVideoInfo) => {
        const existVideo = tableData.value.find(
          (table: ISwiper) => table.video.video_id === item.video_id
        );
        // 被添加过的视频就不能继续添加轮播图了
        if (!existVideo) {
          newVideo.push({
            label: item.title,
            value: item.video_id,
            leaf: true
          });
        }
      });
      console.log('videoData', videoData);
      resolve(newVideo);
    });
  });
}

function setCascaderProps() {
  cascadeProps.value = {
    lazy: true,
    emitPath: false,
    async lazyLoad(node, resolve) {
      let nodes: CascaderType[] = [];
      const { level } = node;
      console.log('node.value', node.level);
      if (level === 0) {
        console.log('level2');
        nodes = await getCateList();
      } else {
        console.log('node.level2');
        nodes = await getVideo(+node.value);
      }
      resolve(nodes);
    }
  };
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log('uploadFile', uploadFile);
  console.log('response', response);
  form.value.url = response.data;
};

function editSwiper(row: ISwiper) {
  form.value = {
    ...row,
    video_id: row.video.video_id
  };
  cascaderValue.value = {
    label: row.video.title,
    value: row.video.video_id
  };
  imgUrl.value = row.url;
  dialog.value.visible = true;
}

function deleteSwiper(row: ISwiper) {
  ElMessageBox.confirm('确定删除吗', '提示').then(async () => {
    await deleteSwiperApi(row.id);
    ElMessage.success('删除成功');
    initData();
  });
}

async function handleAdd() {
  dialog.value.visible = true;
}

function dialogClose() {
  form.value = {} as ISwiperParam;
}

async function submit() {
  const formData = form.value;
  if (formData.id) {
    await updateSwiperApi(formData.id, formData);
  } else {
    await addSwiperApi(formData);
  }
  ElMessage.success(dialog.value.title + '成功');
  initData();
  dialog.value.visible = false;
}
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
