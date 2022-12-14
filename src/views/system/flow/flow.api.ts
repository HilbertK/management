import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/bpm/work/order/pageAll',
  tipOffList = '/bpm/tipOff/workOrder/pageAll',
  createTipOffList = '/bpm/tipOff/workOrder/myCreate',
  createList = '/bpm/work/order/myCreate',
  handlingList = '/bpm/work/order/myHandling',
  takeList = '/bpm/work/order/waitingTaking',
  detail = '/bpm/work/order/detail',
  tipOffDetail = '/bpm/tipOff/get',
  save = '/bpm/work/order/create',
  edit = '/bpm/work/order/edit',
  handle = '/bpm/work/order/handle',
  reassign = '/bpm/work/order/reassign',
  evaluate = '/bpm/work/order/evaluate',
  evaluateCreator = '/bpm/work/order/evaluateCreator',
  tipOff = '/bpm/work/order/tipOff',
  take = '/bpm/work/order/take',
  invalidate = '/bpm/work/order/invalidate',
  invalidateBatch = '/bpm/work/order/invalidateBatch',
  importExcel = '/bpm/sys/flow/importExcel',
  exportXls = '/bpm/work/order/exportXls',
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
 * 发单列表接口
 * @param params
 */
export const createlist = (params) => defHttp.get({ url: Api.createList, params });
/**
 * 接单列表接口
 * @param params
 */
export const handlingList = (params) => defHttp.get({ url: Api.handlingList, params });
/**
 * 待接单列表接口
 * @param params
 */
export const takeList = (params: any) => defHttp.get({ url: Api.takeList, params });
/**
 * 详情接口
 * @param params
 */
export const detail = (workOrderId: string) => defHttp.get({ url: `${Api.detail}/${workOrderId}` });
/**
 * 解决接口
 * @param params
 */
export const solveFlow = (workOrderId: string, handleSuccess) => {
  return defHttp.post({ url: `${Api.handle}/${workOrderId}` }).then(() => {
    handleSuccess();
  });
};
/**
 * 接单接口
 * @param params
 */
export const takeFlow = (workOrderId: string, handleSuccess) => {
  return defHttp.post({ url: `${Api.take}/${workOrderId}` }).then(() => {
    handleSuccess();
  });
};
/**
 * 撤销接口
 * @param params
 */
export const invalidateFlow = (workOrderId: string, handleSuccess) => {
  return defHttp.post({ url: `${Api.invalidate}/${workOrderId}` }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量撤销
 * @param params
 */
export const batchInvalidateFlow = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认撤销',
    content: '是否撤销选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.invalidateBatch, params }).then(() => {
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
export const evaluateFlow = (params: any, workOrderId: string) => defHttp.post({ url: `${Api.evaluate}/${workOrderId}`, params });
/**
 * 对发起人评价
 * @param params
 */
export const evaluateCreator = (params: any, workOrderId: string) => defHttp.post({ url: `${Api.evaluateCreator}/${workOrderId}`, params });

/**
 * 提交举报
 * @param params
 */
export const tipOffFlow = (params: any, workOrderId: string) => defHttp.post({ url: `${Api.tipOff}/${workOrderId}`, params });

/**
 * 获取举报详情
 */
export const tipOffDetail = (workOrderId: string) => defHttp.get({ url: `${Api.tipOffDetail}/${workOrderId}` });

/**
 * 举报列表接口
 * @param params
 */
export const tipOfflist = (params) => defHttp.get({ url: Api.tipOffList, params });

/**
 * 我的举报列表接口
 * @param params
 */
export const createTipOfflist = (params) => defHttp.get({ url: Api.tipOffList, params });

/**
 * 获取全部分类
 * @param params
 */
export const getAllDictList = (params) => defHttp.get({ url: Api.allDictList, params });
