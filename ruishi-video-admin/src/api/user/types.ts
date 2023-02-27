/**
 * 用户的信息
 */
export interface IUserInfo {
  user_id: number;
  username: string;
  password: string;
  email: string;
  avatar: string;
  valiteEmail: boolean;
  lastLoginTime?: any;
  createTime: Date;
  updateTime: Date;
}
/**
 * 返回的用户信息列表
 */
export type UserListType = PageListType<IUserInfo>;

/**
 * 登录用户信息
 */
export interface UserInfo {
  username: string;
  avatar: string;
  roles: string[];
  perms: string[];
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  keywords: string;
  status: number;
  deptId: number;
}

/**
 * 用户分页列表项声明
 */
export interface UserType {
  id: string;
  username: string;
  nickname: string;
  mobile: string;
  gender: number;
  avatar: string;
  email: string;
  status: number;
  deptName: string;
  roleNames: string;
  createTime: string;
}

/**
 * 用户分页项类型声明
 */
export type UserPageResult = PageResult<UserType[]>;

/**
 * 用户表单类型声明
 */
export interface UserForm {
  id: number | undefined;
  deptId: number;
  username: string;
  nickname: string;
  password: string;
  mobile: string;
  email: string;
  gender: number;
  status: number;
  remark: string;
  roleIds: number[];
}

/**
 * 用户导入表单类型声明
 */
export interface UserImportData {
  deptId: number;
  roleIds: number[];
}
