export interface IFlowItem {
  id: string;
  title: string;
  description: string | null;
  handleDescription: string | null;
  handleBy: string | null;
  createBy: string | null;
  problemType: string;
  solved: boolean; // 处理人标记
  evaluation: string | null;
  createTime: string;
  expectHandleTime: string;
  exceedHandle: boolean;
}
