export interface IFlowUser {
  realname: string;
  id: string;
}

interface IFlowDescription {
  creator: IFlowUser;
  content: string;
}

interface IFlowEvaluation {
  content: string;
  score: number;
  resolved: boolean; // 创建人评价
}

export enum FlowStatus {
  Todo = 1,
  Processing = 2,
  Done = 3,
  Evaluated = 4,
  Unknown = 0,
}

export interface IFlowItem {
  id: string;
  title: string;
  description: Array<IFlowDescription>;
  operator: IFlowUser | null;
  creator: IFlowUser;
  orgCode: string;
  orgTxt: string;
  resolved: boolean; // 经办人标记
  evaluation: IFlowEvaluation | null;
  createTime: string; // 时间戳
  endTime: string;
}
