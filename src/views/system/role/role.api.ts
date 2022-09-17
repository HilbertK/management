import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/jeecg-system/sys/role/list',
  save = '/jeecg-system/sys/role/add',
  edit = '/jeecg-system/sys/role/edit',
  deleteRole = '/jeecg-system/sys/role/delete',
  deleteBatch = '/jeecg-system/sys/role/deleteBatch',
  exportXls = '/jeecg-system/sys/role/exportXls',
  importExcel = '/jeecg-system/sys/role/importExcel',
  isRoleExist = '/jeecg-system/sys/role/checkRoleCode',
  queryTreeListForRole = '/jeecg-system/sys/role/queryTreeList',
  queryRolePermission = '/jeecg-system/sys/permission/queryRolePermission',
  saveRolePermission = '/jeecg-system/sys/permission/saveRolePermission',
  queryDataRule = '/jeecg-system/sys/role/datarule',
  getParentDesignList = '/act/process/extActDesignFlowData/getDesFormFlows',
  getRoleDegisnList = '/joa/designform/designFormCommuse/getRoleDegisnList',
  saveRoleDesign = '/joa/designform/designFormCommuse/sysRoleDesignAdd',
  userList = '/jeecg-system/sys/user/userRoleList',
  deleteUserRole = '/jeecg-system/sys/user/deleteUserRole',
  batchDeleteUserRole = '/jeecg-system/sys/user/deleteUserRoleBatch',
  addUserRole = '/jeecg-system/sys/user/addSysUserRole',
  saveRoleIndex = '/jeecg-system/sys/sysRoleIndex/add',
  editRoleIndex = '/jeecg-system/sys/sysRoleIndex/edit',
  queryIndexByCode = '/jeecg-system/sys/sysRoleIndex/queryByCode',
}
/**
 * 导出api
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除角色
 */
export const deleteRole = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteRole, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除角色
 * @param params
 */
export const batchDeleteRole = (params, handleSuccess) => {
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
 * 保存或者更新角色
 * @param params
 */
export const saveOrUpdateRole = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 编码校验
 * @param params
 */
export const isRoleExist = (params) => defHttp.get({ url: Api.isRoleExist, params }, { isTransformResponse: false });
/**
 * 根据角色查询树信息
 */
export const queryTreeListForRole = () => defHttp.get({ url: Api.queryTreeListForRole });
/**
 * 查询角色权限
 */
export const queryRolePermission = (params) => defHttp.get({ url: Api.queryRolePermission, params });
/**
 * 保存角色权限
 */
export const saveRolePermission = (params) => defHttp.post({ url: Api.saveRolePermission, params });
/**
 * 查询角色数据规则
 */
export const queryDataRule = (params) => defHttp.get({ url: `${Api.queryDataRule}/${params.functionId}/${params.roleId}` }, { isTransformResponse: false });
/**
 * 保存角色数据规则
 */
export const saveDataRule = (params) => defHttp.post({ url: Api.queryDataRule, params });
/**
 * 获取表单数据
 * @return List<Map>
 */
export const getParentDesignList = () => defHttp.get({ url: Api.getParentDesignList });
/**
 * 获取角色表单数据
 * @return List<Map>
 */
export const getRoleDegisnList = (params) => defHttp.get({ url: Api.getRoleDegisnList, params });
/**
 * 提交角色工单信息
 */
export const saveRoleDesign = (params) => defHttp.post({ url: Api.saveRoleDesign, params });
/**
 * 角色列表接口
 * @param params
 */
export const userList = (params) => defHttp.get({ url: Api.userList, params });
/**
 * 删除角色用户
 */
export const deleteUserRole = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteUserRole, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除角色用户
 * @param params
 */
export const batchDeleteUserRole = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.batchDeleteUserRole, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 添加已有用户
 */
export const addUserRole = (params, handleSuccess) => {
  return defHttp.post({ url: Api.addUserRole, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 保存或者更新
 * @param params
 * @param isUpdate 是否是更新数据
 */
export const saveOrUpdateRoleIndex = (params, isUpdate) => {
  let url = isUpdate ? Api.editRoleIndex : Api.saveRoleIndex;
  return defHttp.post({ url: url, params });
};
/**
 * 根据code查询首页配置
 * @param params
 */
export const queryIndexByCode = (params) => defHttp.get({ url: Api.queryIndexByCode, params }, { isTransformResponse: false });
