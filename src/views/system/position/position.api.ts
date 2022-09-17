import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/jeecg-system/sys/position/list',
  save = '/jeecg-system/sys/position/add',
  edit = '/jeecg-system/sys/position/edit',
  get = '/jeecg-system/sys/position/queryById',
  delete = '/jeecg-system/sys/position/delete',
  importExcel = '/jeecg-system/sys/position/importExcel',
  exportXls = '/jeecg-system/sys/position/exportXls',
  deleteBatch = '/jeecg-system/sys/position/deleteBatch',
}
/**
 * 导出api
 */
export const getExportUrl = Api.exportXls;

export const getImportUrl = Api.importExcel;
/**
 * 查询列表
 * @param params
 */
export const getPositionList = (params) => {
  return defHttp.get({ url: Api.list, params });
};

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdatePosition = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

/**
 * 查询详情
 * @param params
 */
export const getPositionById = (params) => {
  return defHttp.get({ url: Api.get, params });
};

/**
 * 单条删除
 * @param params
 */
export const deletePosition = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.delete, data: params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 批量删除
 * @param params
 */
export const batchDeletePosition = (params, handleSuccess) => {
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
 * 自定义上传
 * @param customUpload
 */
export const customUpload = (params) => {
  defHttp.uploadFile({ url: Api.importExcel }, params);
};
