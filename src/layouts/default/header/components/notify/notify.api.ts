import { defHttp } from '/@/utils/http/axios';

enum Api {
  listCementByUser = '/jeecg-system/sys/annountCement/listByUser',
  editCementSend = '/jeecg-system/sys/sysAnnouncementSend/editByAnntIdAndUserId',
}

/**
 * 列表接口
 * @param params
 */
export const listCementByUser = (params?) => defHttp.get({ url: Api.listCementByUser, params });

export const editCementSend = (anntId, params?) => defHttp.put({ url: Api.editCementSend, params: { anntId, ...params } });
