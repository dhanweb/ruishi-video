<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form :model="search" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="search.keyword"
            placeholder="视频名称"
            clearable
            style="width: 200px"
            @keyup.enter="initData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="initData"
            >搜索</el-button
          >
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt-5">
      <template #header>
        <el-button type="success" :icon="Plus" @click="handleAdd">
          添加</el-button
        >
        <el-button type="danger" :icon="Delete" :disabled="true">
          删除
        </el-button>
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column type="index" label="序号">
          <template #default="{ $index }">
            {{ $index + 1 + (search.pageNum - 1) * search.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="视频标题" width="180">
        </el-table-column>
        <el-table-column prop="introduction" label="视频介绍">
        </el-table-column>
        <el-table-column prop="other" label="其他介绍"> </el-table-column>
        <el-table-column label="封面">
          <template v-slot="{ row }">
            <el-image style="width: 100px; height: 100px" :src="row.cover" />
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="收藏数" width="80">
        </el-table-column>
        <el-table-column prop="views" label="播放量" width="80">
        </el-table-column>
        <el-table-column prop="comments" label="评论数" width="80">
        </el-table-column>
        <el-table-column prop="score" label="评分" width="80">
        </el-table-column>
        <el-table-column prop="release" label="上映年份" width="80">
        </el-table-column>
        <el-table-column label="发布时间">
          <template v-slot="{ row }">
            {{ formatter(row.published_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="is_deleted" label="是否下架">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.is_deleted"
              :active-value="true"
              :inactive-value="false"
              @change="switchChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="primary" link @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-button type="success" link @click="handlePart(row)"
              >添加集数</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="search.pageNum"
        v-model:limit="search.pageSize"
        @pagination="initData"
        :page-sizes="[5, 10, 15]"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';

import { getVideoList, tollgeVideoApi } from '@/api/video';
import { IVideoInfo } from '@/api/video/types';
import { PagerParams } from '@/api/common.type';
import { Search, Plus, Refresh, Delete } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/filter';
import { useRouter } from 'vue-router';
interface STATE {
  tableData: IVideoInfo[];
  search: PagerParams;
  total: number;
  totalPage: number;
}

const state = reactive<STATE>({
  tableData: [],
  search: {
    keyword: '',
    pageNum: 1,
    pageSize: 5,
    order: 'ASC'
  },
  total: 0,
  totalPage: 0
});
const { tableData, search, total, totalPage } = toRefs(state);

const router = useRouter();

// 初始化数据
async function initData() {
  const result = await getVideoList(search.value);
  if (result.code === 200) {
    const { data } = result;
    tableData.value = data.data;
    total.value = data.total;
    totalPage.value = data.totalPage;
  }
  console.log('result', result);
}
initData();

// 格式化时间
function formatter(date: Date) {
  return formatDate(date);
}

// 添加用户
function handleAdd() {
  router.push({ name: 'addVideo' });
}

// 编辑视频
function handleUpdate(row: IVideoInfo) {
  router.push({ name: 'editVideo', params: { video_id: row.video_id } });
}

// 上下架
async function switchChange(row: IVideoInfo) {
  await tollgeVideoApi(row.video_id);
}
// 重置搜索
function resetQuery() {
  search.value.keyword = '';
  initData();
}

function handlePart(row: IVideoInfo) {
  router.push({ name: 'partList', params: { video_id: row.video_id } });
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
