export interface IFlowItem {
  id: string;
  title: string;
  description: string | null;
  handleBy: string | null;
  createBy: string | null;
  problemType: string;
  solved: boolean; // 经办人标记
  evaluation: string | null;
  createTime: string;
  expectHandleTime: string;
}
