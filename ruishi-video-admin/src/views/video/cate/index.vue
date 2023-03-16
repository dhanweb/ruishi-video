<template>
  <div class="app-container">
    <el-card shadow="never" class="mt-5">
      <template #header>
        <el-button type="success" :icon="Plus" @click="handleAdd">
          添加一级分类</el-button
        >
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row>
              <el-col :span="20" :offset="1">
                <el-tag
                  v-for="tag in row.children"
                  :key="tag"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                  @close="handleRemove(tag)"
                  @click="handleEditCate2(tag)"
                >
                  {{ tag.cate_name }}
                </el-tag>
                <el-input
                  v-if="inputVisible"
                  ref="InputRef"
                  v-model="cateForm.cate_name"
                  class="ml-1 w-20"
                  size="small"
                  style="width: 100px"
                  @blur="addCate2"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput(row)"
                >
                  + 新增二级分类
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"> </el-table-column>

        <el-table-column prop="cate_name" label="分类名称" width="180">
        </el-table-column>
        <!-- <el-table-column prop="pid" label="父级分类"> </el-table-column> -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最近更新时间"
          :formatter="formatter2"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="primary" link @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-button type="danger" link @click="handleRemove(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加/编辑用户 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="30%"
      append-to-body
      :before-close="cateFormCloseHandle"
    >
      <el-form :model="cateForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="cateForm.cate_name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/filter';
import {
  getCateListApi,
  editCateApi,
  delCateApi,
  addCate1Api,
  addCate2Api
} from '@/api/video';
import { ICateInfo } from '@/api/video/types';
import { IUserInfo } from '@/api/user/types';
import { Plus } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { ElMessageBox, ElMessage, ElInput } from 'element-plus';

interface STATE {
  tableData: ICateInfo[];
  dialog: {
    visible: boolean;
    title: '添加' | '编辑';
  };
  cateForm: ICateInfo;
  cateFormRef: FormInstance;
  presult: ICateInfo[];
  inputVisible: boolean;
}
const InputRef = ref<InstanceType<typeof ElInput>>();

const state = reactive<STATE>({
  tableData: [],
  dialog: {
    visible: false,
    title: '添加'
  },
  cateForm: {} as ICateInfo,
  cateFormRef: {} as FormInstance,
  presult: [],
  inputVisible: false
});
const { tableData, dialog, cateForm, inputVisible } = toRefs(state);

// 初始化数据
async function initData() {
  const result = await getCateListApi();
  if (result.code === 200) {
    const { data } = result;
    tableData.value = data;
  }
  console.log('result', result);
}
initData();

// 添加用户
function handleAdd() {
  cateForm.value.pid = 0;
  dialog.value = {
    title: '添加',
    visible: true
  };
}

// 格式化时间
function formatter(row: IUserInfo) {
  return formatDate(row.createTime);
}
// 格式化时间
function formatter2(row: IUserInfo) {
  return formatDate(row.updateTime);
}

/**
 * 编辑
 * @param row
 */
async function handleUpdate(row: ICateInfo) {
  cateForm.value = row;
  dialog.value = {
    title: '编辑',
    visible: true
  };
}

// 删除
function handleRemove(row: ICateInfo) {
  if (row.pid == 0 && row.children?.length != 0) {
    return ElMessage.warning('请先删除所有子分类');
  }
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
    confirmButtonText: '确定'
  }).then(async () => {
    await delCateApi(row.cate_id);
    ElMessage.success('成功');
    initData();
  });
}

// 添加/编辑分类
async function save() {
  const formData = cateForm.value;
  if (formData.pid === 0 && !formData.cate_id) {
    await addCate1Api(cateForm.value);
  } else if (formData.pid !== 0 && !formData.cate_id) {
    await addCate2Api(cateForm.value);
  } else {
    await editCateApi(formData.cate_id, cateForm.value);
  }
  ElMessage.success(dialog.value.title + '成功！');
  dialog.value.visible = false;
  initData();
}

/**
 *
 */
const showInput = (row: ICateInfo) => {
  inputVisible.value = true;
  cateForm.value.cate_name = '';
  cateForm.value.pid = row.cate_id;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
async function addCate2() {
  inputVisible.value = false;
  if (!cateForm.value.cate_name) {
    return;
  }
  await addCate2Api(cateForm.value);
  ElMessage.success('添加2成功！');
  cateForm.value = <ICateInfo>{};
  initData();
}

function handleEditCate2(row: ICateInfo) {
  cateForm.value = row;
  dialog.value = {
    title: '编辑',
    visible: true
  };
}

// 添加/编辑用户表单关闭事件
function cateFormCloseHandle() {
  dialog.value.visible = false;
  setTimeout(() => {
    cateForm.value = {} as ICateInfo;
  }, 300);
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
