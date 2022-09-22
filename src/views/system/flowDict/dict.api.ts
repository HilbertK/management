import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';
import { currDictId } from './dict.data';
enum Api {
  list = '/jeecg-system/sys/dict/list',
  save = '/jeecg-system/sys/dict/add',
  edit = '/jeecg-system/sys/dict/edit',
  duplicateCheck = '/jeecg-system/sys/duplicate/check',
  deleteDict = '/jeecg-system/sys/dict/delete',
  deleteBatch = '/jeecg-system/sys/dict/deleteBatch',
  importExcel = '/jeecg-system/sys/dict/importExcel',
  exportXls = '/jeecg-system/sys/dict/exportXls',
  importDictItemExcel = '/jeecg-system/sys/dictItem/importExcel',
  exportDictItemXls = '/jeecg-system/sys/dictItem/exportXls',
  recycleBinList = '/jeecg-system/sys/dict/deleteList',
  putRecycleBin = '/jeecg-system/sys/dict/back',
  deleteRecycleBin = '/jeecg-system/sys/dict/deletePhysic',
  itemList = '/jeecg-system/sys/dictItem/list',
  itemAll = '/jeecg-system/sys/dictItem/all',
  deleteDictItem = '/jeecg-system/sys/dictItem/delete',
  deleteDictItemBatch = '/jeecg-system/sys/dictItem/deleteBatch',
  itemSave = '/jeecg-system/sys/dictItem/add',
  itemEdit = '/jeecg-system/sys/dictItem/edit',
  dictItemCheck = '/jeecg-system/sys/dictItem/dictItemCheck',
  refreshCache = '/jeecg-system/sys/dict/refleshCache',
  dictItemUserList = '/jeecg-system/sys/user/dictItemUserList',
  deleteDictItemUser = '/jeecg-system/sys/user/deleteDictItemUser',
  batchDeleteDictItemUser = '/jeecg-system/sys/user/deleteDictItemUserBatch',
  addDictItemUser = '/jeecg-system/sys/user/addDictItemUser',
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
 * 导出dict item api
 * @param params
 */
export const getDictItemExportUrl = Api.exportDictItemXls;
/**
 * 导入dict item api
 * @param params
 */
export const getDictItemImportUrl = Api.importDictItemExcel;
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
 * 批量删除字典子项
 * @param params
 */
export const batchDeleteDictItem = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteDictItemBatch, data: params }, { joinParamsToUrl: true }).then(() => {
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
  const url = isUpdate ? Api.edit : Api.save;
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
 * 字典子项列表
 * @param params
 */
export const problemDictItemList = (params) => defHttp.get({ url: `${Api.itemAll}/${currDictId}`, params: { ...params, dictId: currDictId } });
/**
 * 字典配置删除
 * @param params
 */
export const deleteDictItem = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteDictItem, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 保存或者更新字典配置
 * @param params
 */
export const saveOrUpdateDictItem = (params, isUpdate) => {
  const url = isUpdate ? Api.itemEdit : Api.itemSave;
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
 * 角色列表接口
 * @param params
 */

export const userList = (params) => defHttp.get({ url: Api.dictItemUserList, params });
/**
 * 删除角色用户
 */
export const deleteUserRole = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteDictItemUser, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除角色用户
 * @param params
 */
export const batchDeleteUserRole = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认取消关联',
    content: '是否取消关联选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.batchDeleteDictItemUser, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 添加已有用户
 */
export const addUserRole = (params, handleSuccess) => {
  return defHttp.post({ url: Api.addDictItemUser, params }).then(() => {
    handleSuccess();
  });
};
