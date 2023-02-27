<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form :model="search" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="search.keyword"
            placeholder="用户名/邮箱"
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

      <el-table :data="tableData" style="width: 100%" @sort-change="sortChange">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column label="头像">
          <template v-slot="{ row }">
            <el-avatar :size="50" :src="row.avatar" />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="lastLoginTime" label="上次登录时间">
      </el-table-column> -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable="custom"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最近更新时间"
          sortable="custom"
          :formatter="formatter2"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="primary" link @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-button type="danger" link @click="resetPassword(row)"
              >重置密码</el-button
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
    <!-- 添加/编辑用户 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="30%"
      append-to-body
      :before-close="userFormCloseHandle"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="80px"
      >
        <el-form-item label="用户id" v-if="userForm.user_id">
          <el-input :readonly="!!userForm.user_id" v-model="userForm.user_id" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!userForm.user_id">
          <el-input
            type="password"
            v-model="userForm.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="UploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="save(userFormRef)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';
import { formatDate } from '@/utils/filter';
import {
  getUserListApi,
  getUserListOrderByTimeApi,
  getUserListOrderByUpTimeApi,
  resetPasswordApi,
  getUserInfoByIdApi,
  addUserApi,
  editUserApi
} from '@/api/user';
import { IUserInfo } from '@/api/user/types';
import { PagerParams } from '@/api/common.type';
import { Search, Plus, Refresh, Delete } from '@element-plus/icons-vue';
import type { FormInstance, FormRules, UploadProps } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { UploadUrl } from '@/globalVar';
var checkEmail = (rule: any, value: string, cb: any) => {
  //验证邮箱的正则表达式
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (regEmail.test(value)) {
    //合法的邮箱
    return cb();
  }
  cb(new Error('请输入合法的邮箱'));
};

let checkAvatar = (rule: any, value: string, cb: any) => {
  if (!userForm.value.avatar) {
    return cb(new Error('请先上传头像！'));
  } else {
    return cb();
  }
};

interface STATE {
  tableData: IUserInfo[];
  search: PagerParams;
  total: number;
  totalPage: number;
  dialog: {
    visible: boolean;
    title: '添加用户' | '编辑用户';
  };
  userForm: IUserInfo;
  userFormRules: FormRules;
  avatarUrl: string;
  userFormRef: FormInstance;
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
  totalPage: 0,
  dialog: {
    visible: false,
    title: '添加用户'
  },
  userForm: {} as IUserInfo,
  userFormRules: {
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    avatar: [
      {
        required: true,
        trigger: 'change',
        validator: checkAvatar
      }
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      {
        validator: checkEmail,
        trigger: 'blur',
        message: '请输入合法的邮箱'
      }
    ]
  },
  avatarUrl: '',
  userFormRef: {} as FormInstance
});
const {
  avatarUrl,
  tableData,
  search,
  total,
  totalPage,
  dialog,
  userForm,
  userFormRules,
  userFormRef
} = toRefs(state);

// 初始化数据
async function initData() {
  const result = await getUserListApi(search.value);
  if (result.code === 200) {
    const { data } = result;
    tableData.value = data.data;
    total.value = data.total;
    totalPage.value = data.totalPage;
  }
  console.log('result', result);
}
initData();

// 添加用户
function handleAdd() {
  dialog.value = {
    title: '添加用户',
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

//编辑用户
async function handleUpdate(row: IUserInfo) {
  const result = await getUserInfoByIdApi(row.user_id);
  userForm.value = result.data;
  dialog.value = {
    title: '编辑用户',
    visible: true
  };
  avatarUrl.value = userForm.value.avatar;
}

// 重置密码
async function resetPassword(row: IUserInfo) {
  ElMessageBox.confirm('确定将密码重置为123456吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    await resetPasswordApi(row.user_id);
    ElMessage.success('重置成功');
  });
}

// 重置搜索
function resetQuery() {
  search.value.keyword = '';
  initData();
}
// 排序
async function sortChange(column: {
  order: 'descending' | 'ascending';
  prop: string;
}) {
  const order = column.order === 'descending' ? 'DESC' : 'ASC';
  search.value.order = order;
  if (column.prop === 'createTime') {
    const result = await getUserListOrderByTimeApi(search.value);
    if (result.code === 200) {
      tableData.value = result.data.data;
    }
  } else {
    const result = await getUserListOrderByUpTimeApi(search.value);
    if (result.code === 200) {
      tableData.value = result.data.data;
    }
  }
}

// 上传头像
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  avatarUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log('uploadFile', uploadFile);
  console.log('response', response);
  userForm.value.avatar = response.data;
};
// 保存按钮
async function save(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!');

      const { user_id } = userForm.value;
      if (user_id) {
        await editUserApi(userForm.value);
      } else {
        await addUserApi(userForm.value);
      }
      ElMessage.success(dialog.value.title + '成功');
      dialog.value.visible = false;
      initData();
    } else {
      console.log('error submit!', fields);
    }
  });
}

// 添加/编辑用户表单关闭事件
function userFormCloseHandle() {
  dialog.value.visible = false;
  setTimeout(() => {
    userForm.value = {} as IUserInfo;
    avatarUrl.value = '';
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
