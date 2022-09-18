import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/bpm/work/order/pageAll',
  detail = '/bpm/sys/flow/detail',
  save = '/bpm/work/order/create',
  edit = '/bpm/work/order/edit',
  reassign = '/bpm/work/order/reassign',
  evaluate = '/bpm/work/order/evaluate',
  deleteFlow = '/bpm/sys/flow/delete',
  deleteBatch = '/bpm/sys/flow/deleteBatch',
  importExcel = '/bpm/sys/flow/importExcel',
  exportXls = '/bpm/sys/flow/exportXls',
  allDictList = '/jeecg-system/sys/dictItem/problemTypeList',
}
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
 * 详情接口
 * @param params
 */
export const detail = (params) => defHttp.get({ url: Api.detail, params });

/**
 * 删除
 */
export const deleteFlow = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteFlow, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const batchDeleteFlow = (params, handleSuccess) => {
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
 * 保存
 * @param params
 */
export const saveFlow = (params) => defHttp.post({ url: Api.save, params });

/**
 * 更新
 * @param params
 */
export const updateFlow = (params: any, workOrderId: string) => defHttp.post({ url: `${Api.edit}/${workOrderId}`, params });

/**
 * 转交
 * @param params
 */
export const reassignFlow = (params: any, workOrderId: string) => defHttp.post({ url: `${Api.reassign}/${workOrderId}`, params });
/**
 * 提交评价
 * @param params
 */
export const evaluateFlow = (params) => defHttp.post({ url: Api.evaluate, params });

/**
 * 获取全部分类
 * @param params
 */
export const getAllDictList = (params) => defHttp.get({ url: Api.allDictList, params });
