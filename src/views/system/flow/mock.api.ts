import { Modal } from 'ant-design-vue';
import { v4 as uuid } from 'uuid';
import { IFlowItem } from './interface';

const mockFlowList: Array<IFlowItem> = [
  {
    id: '1',
    title: '测试',
    description: [
      {
        content: '测试描述描述',
        creator: {
          id: 'f0019fdebedb443c98dcb17d88222c38',
          realname: '张小红',
        },
      },
      {
        content: '测试描述描述2',
        creator: {
          id: '3d464b4ea0d2491aab8a7bde74c57e95',
          realname: '张三',
        },
      },
    ],
    creator: {
      id: '1563438670858362882',
      realname: '李博文',
    },
    operator: {
      id: 'f0019fdebedb443c98dcb17d88222c38',
      realname: '张小红',
    },
    createTime: 1662181264984,
    endTime: 1662181264984,
    resolved: false,
    evaluation: null,
    orgCode: '',
    orgTxt: '',
  },
];

/**
 * 列表接口
 * @param params
 */
export const list = (params: any) =>
  new Promise<IFlowItem[]>((resolve) => {
    resolve(mockFlowList);
  });
/**
 * 详情接口
 * @param params
 */
export const detail = (id: string) =>
  new Promise<IFlowItem>((resolve) => {
    const detailItem = mockFlowList.find((item) => item.id === id);
    if (!detailItem) return null;
    resolve(detailItem);
  });

/**
 * 删除
 */
export const deleteFlow = (id: string, handleSuccess) =>
  new Promise<void>((resolve) => {
    const index = mockFlowList.findIndex((item) => item.id === id);
    mockFlowList.splice(index, 1);
    handleSuccess();
    resolve();
  });
/**
 * 批量删除
 * @param params
 */
export const batchDeleteFlow = (ids: string[], handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () =>
      new Promise<void>((resolve) => {
        ids.forEach((id) => {
          const index = mockFlowList.findIndex((item) => item.id === id);
          mockFlowList.splice(index, 1);
        });
        handleSuccess();
        resolve();
      }),
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdateFlow = (params: Partial<IFlowItem>, isUpdate) => {
  if (isUpdate) {
    return new Promise<void>((resolve) => {
      const detailIndex = mockFlowList.findIndex((item) => item.id === params.id);
      if (detailIndex < 0) return null;
      mockFlowList[detailIndex] = {
        ...mockFlowList[detailIndex],
        ...params,
      } as IFlowItem;
      resolve();
    });
  }
  return new Promise<void>((resolve) => {
    const newId = uuid();
    mockFlowList.push({
      id: newId,
      ...params,
    } as IFlowItem);
    resolve(newId);
  });
};
