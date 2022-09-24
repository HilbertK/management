export enum FlowOpMode {
  Add = '1',
  Reassign = '2',
  Edit = '3',
  NoPermission = '4',
}

export enum FlowStatus {
  Draft = 'draft',
  Taking = 'taking',
  Receiving = 'receiving',
  Handle = 'handle',
  Evaluate = 'evaluate',
  End = 'end',
  Invalid = 'invalid',
}

// 已经结单、无法操作的工单
export const flowFinishedStatusList = [FlowStatus.Evaluate, FlowStatus.End, FlowStatus.Invalid];

export const flowStatusDict = {
  [FlowStatus.Draft]: '未开始',
  [FlowStatus.Taking]: '待接单',
  [FlowStatus.Receiving]: '客服接待',
  [FlowStatus.Handle]: '处理中',
  [FlowStatus.Evaluate]: '待评价',
  [FlowStatus.End]: '已完成',
  [FlowStatus.Invalid]: '已作废',
};
