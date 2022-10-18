import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/jeecg-system/sys/user/list',
  save = '/jeecg-system/sys/user/add',
  edit = '/jeecg-system/sys/user/edit',
  agentSave = '/jeecg-system/sys/sysUserAgent/add',
  agentEdit = '/jeecg-system/sys/sysUserAgent/edit',
  getUserRole = '/jeecg-system/sys/user/queryUserRole',
  duplicateCheck = '/jeecg-system/sys/duplicate/check',
  deleteUser = '/jeecg-system/sys/user/delete',
  deleteBatch = '/jeecg-system/sys/user/deleteBatch',
  importExcel = '/jeecg-system/sys/user/importExcel',
  exportXls = '/jeecg-system/sys/user/exportXls',
  recycleBinList = '/jeecg-system/sys/user/recycleBin',
  putRecycleBin = '/jeecg-system/sys/user/putRecycleBin',
  deleteRecycleBin = '/jeecg-system/sys/user/deleteRecycleBin',
  allRolesList = '/jeecg-system/sys/role/queryall',
  allTenantList = '/jeecg-system/sys/tenant/queryList',
  allPostList = '/jeecg-system/sys/position/list',
  userDepartList = '/jeecg-system/sys/user/userDepartList',
  changePassword = '/jeecg-system/sys/user/changePassword',
  frozenBatch = '/jeecg-system/sys/user/frozenBatch',
  getUserAgent = '/jeecg-system/sys/sysUserAgent/queryByUserName',
  syncUser = '/jeecg-system/sync/userAndDept',
  officeList = '/jeecg-system/sys/dictItem/officeList',
}

export enum SexEnum {
  male = 1,
  female = 2,
}

export const SexDict = {
  [SexEnum.male]: '男',
  [SexEnum.female]: '女',
};
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 用户角色接口
 * @param params
 */
export const getUserRoles = (params) => defHttp.get({ url: Api.getUserRole, params }, { errorMessageMode: 'none' });

/**
 * 删除用户
 */
export const deleteUser = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteUser, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除用户
 * @param params
 */
export const batchDeleteUser = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新用户
 * @param params
 */
export const saveOrUpdateUser = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 唯一校验
 * @param params
 */
export const duplicateCheck = (params) => defHttp.get({ url: Api.duplicateCheck, params }, { isTransformResponse: false });
/**
 * 获取全部角色
 * @param params
 */
export const getAllRolesList = (params) => defHttp.get({ url: Api.allRolesList, params });

export const getOfficeList = (params) => defHttp.get({ url: Api.officeList, params });
/**
 * 获取全部租户
 */
export const getAllTenantList = (params) => defHttp.get({ url: Api.allTenantList, params });
/**
 * 获取指定用户负责部门
 */
export const getUserDepartList = (params) => defHttp.get({ url: Api.userDepartList, params }, { successMessageMode: 'none' });
/**
 * 获取全部职务
 */
export const getAllPostList = (params) => {
  return new Promise((resolve) => {
    defHttp.get({ url: Api.allPostList, params }).then((res) => {
      resolve(res.records);
    });
  });
};
/**
 * 回收站列表
 * @param params
 */
export const getRecycleBinList = (params) => defHttp.get({ url: Api.recycleBinList, params });
/**
 * 回收站还原
 * @param params
 */
export const putRecycleBin = (params, handleSuccess) => {
  return defHttp.put({ url: Api.putRecycleBin, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 回收站删除
 * @param params
 */
export const deleteRecycleBin = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteRecycleBin, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 修改密码
 * @param params
 */
export const changePassword = (params) => {
  return defHttp.put({ url: Api.changePassword, params });
};
/**
 * 冻结解冻
 * @param params
 */
export const frozenBatch = (params, handleSuccess) => {
  return defHttp.put({ url: Api.frozenBatch, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 获取用户代理
 * @param params
 */
export const getUserAgent = (params) => defHttp.get({ url: Api.getUserAgent, params }, { isTransformResponse: false });
/**
 * 保存或者更新用户代理
 * @param params
 */
export const saveOrUpdateAgent = (params) => {
  let url = params.id ? Api.agentEdit : Api.agentSave;
  return defHttp.post({ url: url, params });
};

/**
 * 用户同步流程
 * @param params
 */
export const syncUser = () => defHttp.get({ url: Api.syncUser });
