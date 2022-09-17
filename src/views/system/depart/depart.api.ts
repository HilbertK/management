import { unref } from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

export enum Api {
  queryDepartTreeSync = '/jeecg-system/sys/sysDepart/queryDepartTreeSync',
  save = '/jeecg-system/sys/sysDepart/add',
  edit = '/jeecg-system/sys/sysDepart/edit',
  delete = '/jeecg-system/sys/sysDepart/delete',
  deleteBatch = '/jeecg-system/sys/sysDepart/deleteBatch',
  exportXlsUrl = '/jeecg-system/sys/sysDepart/exportXls',
  importExcelUrl = '/jeecg-system/sys/sysDepart/importExcel',

  roleQueryTreeList = '/jeecg-system/sys/role/queryTreeList',
  queryDepartPermission = '/jeecg-system/sys/permission/queryDepartPermission',
  saveDepartPermission = '/jeecg-system/sys/permission/saveDepartPermission',

  dataRule = '/jeecg-system/sys/sysDepartPermission/datarule',

  getCurrentUserDeparts = '/jeecg-system/sys/user/getCurrentUserDeparts',
  selectDepart = '/jeecg-system/sys/selectDepart',
}

/**
 * 获取部门树列表
 */
export const queryDepartTreeSync = (params?) => defHttp.get({ url: Api.queryDepartTreeSync, params });

/**
 * 保存或者更新部门角色
 */
export const saveOrUpdateDepart = (params, isUpdate) => {
  if (isUpdate) {
    return defHttp.put({ url: Api.edit, params });
  } else {
    return defHttp.post({ url: Api.save, params });
  }
};

/**
 * 批量删除部门角色
 */
export const deleteBatchDepart = (params, confirm = false) => {
  return new Promise((resolve, reject) => {
    const doDelete = () => {
      resolve(defHttp.delete({ url: Api.deleteBatch, params }, { joinParamsToUrl: true }));
    };
    if (confirm) {
      createConfirm({
        iconType: 'warning',
        title: '删除',
        content: '确定要删除吗？',
        onOk: () => doDelete(),
        onCancel: () => reject(),
      });
    } else {
      doDelete();
    }
  });
};

/**
 * 获取权限树列表
 */
export const queryRoleTreeList = (params?) => defHttp.get({ url: Api.roleQueryTreeList, params });
/**
 * 查询部门权限
 */
export const queryDepartPermission = (params?) => defHttp.get({ url: Api.queryDepartPermission, params });
/**
 * 保存部门权限
 */
export const saveDepartPermission = (params) => defHttp.post({ url: Api.saveDepartPermission, params });

/**
 *  查询部门数据权限列表
 */
export const queryDepartDataRule = (functionId, departId, params?) => {
  let url = `${Api.dataRule}/${unref(functionId)}/${unref(departId)}`;
  return defHttp.get({ url, params });
};
/**
 * 保存部门数据权限
 */
export const saveDepartDataRule = (params) => defHttp.post({ url: Api.dataRule, params });
/**
 * 获取登录用户部门信息
 */
export const getUserDeparts = (params?) => defHttp.get({ url: Api.getCurrentUserDeparts, params });
/**
 * 切换选择部门
 */
export const selectDepart = (params?) => defHttp.put({ url: Api.selectDepart, params });
