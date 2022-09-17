import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';
enum Api {
  list = '/jeecg-system/sys/dict/list',
  save = '/jeecg-system/sys/dict/add',
  edit = '/jeecg-system/sys/dict/edit',
  duplicateCheck = '/jeecg-system/sys/duplicate/check',
  deleteDict = '/jeecg-system/sys/dict/delete',
  deleteBatch = '/jeecg-system/sys/dict/deleteBatch',
  importExcel = '/jeecg-system/sys/dict/importExcel',
  exportXls = '/jeecg-system/sys/dict/exportXls',
  recycleBinList = '/jeecg-system/sys/dict/deleteList',
  putRecycleBin = '/jeecg-system/sys/dict/back',
  deleteRecycleBin = '/jeecg-system/sys/dict/deletePhysic',
  itemList = '/jeecg-system/sys/dictItem/list',
  deleteItem = '/jeecg-system/sys/dictItem/delete',
  itemSave = '/jeecg-system/sys/dictItem/add',
  itemEdit = '/jeecg-system/sys/dictItem/edit',
  dictItemCheck = '/jeecg-system/sys/dictItem/dictItemCheck',
  refreshCache = '/jeecg-system/sys/dict/refleshCache',
  queryAllDictItems = '● /jeecg-system/sys/dictItem/problemTypeList',
  dictItemUserList = '/jeecg-system/sys/user/dictItemUserList',
  deleteDictUser = '/jeecg-system/sys/user/deleteDictItemUser',
  batchDeleteDictUser = '/jeecg-system/sys/user/deleteDictItemUserBatch',
  addDictUser = '/jeecg-system/sys/user/addDictItemUser',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 * @param params
 */
export const getImportUrl = Api.importExcel;
/**
 * 字典列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 删除字典
 */
export const deleteDict = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteDict, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除字典
 * @param params
 */
export const batchDeleteDict = (params, handleSuccess) => {
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
 * 保存或者更新字典
 * @param params
 */
export const saveOrUpdateDict = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 唯一校验
 * @param params
 */
export const duplicateCheck = (params) => defHttp.get({ url: Api.duplicateCheck, params }, { isTransformResponse: false });
/**
 * 字典回收站列表
 * @param params
 */
export const getRecycleBinList = (params) => defHttp.get({ url: Api.recycleBinList, params });
/**
 * 回收站还原
 * @param params
 */
export const putRecycleBin = (id, handleSuccess) => {
  return defHttp.put({ url: Api.putRecycleBin + `/${id}` }).then(() => {
    handleSuccess();
  });
};
/**
 * 回收站删除
 * @param params
 */
export const deleteRecycleBin = (id, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteRecycleBin + `/${id}` }).then(() => {
    handleSuccess();
  });
};
/**
 * 字典配置列表
 * @param params
 */
export const itemList = (params) => defHttp.get({ url: Api.itemList, params });
/**
 * 字典配置删除
 * @param params
 */
export const deleteItem = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteItem, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 保存或者更新字典配置
 * @param params
 */
export const saveOrUpdateDictItem = (params, isUpdate) => {
  let url = isUpdate ? Api.itemEdit : Api.itemSave;
  return defHttp.post({ url: url, params });
};
/**
 * 校验字典数据值
 * @param params
 */
export const dictItemCheck = (params) => defHttp.get({ url: Api.dictItemCheck, params }, { isTransformResponse: false });
/**
 * 刷新字典
 * @param params
 */
export const refreshCache = () => defHttp.get({ url: Api.refreshCache }, { isTransformResponse: false });
/**
 * 获取所有字典项
 * @param params
 */
export const queryAllDictItems = () => defHttp.get({ url: Api.queryAllDictItems }, { isTransformResponse: false });

//TODO: 分类下的用户相关接口，需调整
/**
 * 角色列表接口
 * @param params
 */

export const userList = (params) => defHttp.get({ url: Api.dictItemUserList, params });
/**
 * 删除角色用户
 */
export const deleteUserRole = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteDictUser, params }, { joinParamsToUrl: true }).then(() => {
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
      return defHttp.delete({ url: Api.batchDeleteDictUser, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 添加已有用户
 */
export const addUserRole = (params, handleSuccess) => {
  return defHttp.post({ url: Api.addDictUser, params }).then(() => {
    handleSuccess();
  });
};
