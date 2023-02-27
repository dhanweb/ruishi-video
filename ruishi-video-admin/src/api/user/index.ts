import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  UserForm,
  UserInfo,
  UserPageResult,
  UserQuery,
  UserListType,
  IUserInfo
} from './types';

/**
 *  关键词和分页查找用户
 */
export function getUserListApi(data: PagerParams): ResultType<UserListType> {
  return request({
    url: '/user/find',
    method: 'get',
    params: data
  });
}

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfo(): AxiosPromise<UserInfo> {
  return request({
    url: '/admin/info',
    method: 'get'
  });
}

/**
 * (创建时间排序)关键词和分页查找用户
 */
export function getUserListOrderByTimeApi(
  data: PagerParams
): ResultType<UserListType> {
  return request({
    url: '/user/find/orderByTime',
    method: 'get',
    params: data
  });
}

/**
 * (更新时间排序)关键词和分页查找用户
 */
export function getUserListOrderByUpTimeApi(
  data: PagerParams
): ResultType<UserListType> {
  return request({
    url: '/user/find/orderByUpTime',
    method: 'get',
    params: data
  });
}

/**
 * 重置密码
 */
export function resetPasswordApi(user_id: number) {
  return request({
    url: `/user/reset/${user_id}`,
    method: 'post'
  });
}

/**
 * 获取用户信息
 */
export function getUserInfoByIdApi(user_id: number): ResultType<IUserInfo> {
  return request({
    url: `/user/userInfo/${user_id}`
  });
}

/**
 *  添加用户
 */
export function addUserApi(data: IUserInfo) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  });
}

/**
 *  编辑用户
 */
export function editUserApi(data: IUserInfo) {
  return request({
    url: `/user/update/${data.user_id}`,
    method: 'post',
    data
  });
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function listUserPages(
  queryParams: UserQuery
): AxiosPromise<UserPageResult> {
  return request({
    url: '/api/v1/users/pages',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取用户表单详情
 *
 * @param userId
 */
export function getUserForm(userId: number): AxiosPromise<UserForm> {
  return request({
    url: '/api/v1/users/' + userId + '/form',
    method: 'get'
  });
}

/**
 * 添加用户
 *
 * @param data
 */
export function addUser(data: any) {
  return request({
    url: '/api/v1/users',
    method: 'post',
    data: data
  });
}

/**
 * 修改用户
 *
 * @param id
 * @param data
 */
export function updateUser(id: number, data: UserForm) {
  return request({
    url: '/api/v1/users/' + id,
    method: 'put',
    data: data
  });
}

/**
 * 修改用户状态
 *
 * @param id
 * @param status
 */
export function updateUserStatus(id: number, status: number) {
  return request({
    url: '/api/v1/users/' + id + '/status',
    method: 'patch',
    params: { status: status }
  });
}

/**
 * 修改用户密码
 *
 * @param id
 * @param password
 */
export function updateUserPassword(id: number, password: string) {
  return request({
    url: '/api/v1/users/' + id + '/password',
    method: 'patch',
    params: { password: password }
  });
}

/**
 * 删除用户
 *
 * @param ids
 */
export function deleteUsers(ids: string) {
  return request({
    url: '/api/v1/users/' + ids,
    method: 'delete'
  });
}

/**
 * 下载用户导入模板
 *
 * @returns
 */
export function downloadTemplate() {
  return request({
    url: '/api/v1/users/template',
    method: 'get',
    responseType: 'arraybuffer'
  });
}

/**
 * 导出用户
 *
 * @param queryParams
 * @returns
 */
export function exportUser(queryParams: UserQuery) {
  return request({
    url: '/api/v1/users/_export',
    method: 'get',
    params: queryParams,
    responseType: 'arraybuffer'
  });
}

/**
 * 导入用户
 *
 * @param file
 */
export function importUser(deptId: number, roleIds: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('deptId', deptId.toString());
  formData.append('roleIds', roleIds);
  return request({
    url: '/api/v1/users/_import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
