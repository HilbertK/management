// /**
//  * 用户类型：律师（lawyer）
//  */
//  public static final String TYPE_LAWYER = "LAW";
//  /**
//   * 行政（administrator）
//   */
//  public static final String TYPE_ADMINISTRATIVE = "ADM";
//  /**
//   * 访客（visitor）
//   */
//  public static final String TYPE_TOURIST = "VIS";
//  /**
//   * 客户（client）
//   */
//  public static final String TYPE_CUSTOM = "CLI";
//  /**
//   * VIP客户（vip）
//   */
//  public static final String TYPE_VIP_CUSTOM = "VIP";
//  /**
//   * 部门（department）
//   */
//  public static final String TYPE_DEPT = "DEP";

export enum UserType {
  lawyer = 'LAW',
  administrator = 'ADM',
  visitor = 'VIS',
  client = 'CLI',
  vip = 'VIP',
  department = 'DEP',
}

export const userTypeDict = {
  [UserType.lawyer]: '律师',
  [UserType.administrator]: '行政',
  [UserType.visitor]: '访客',
  [UserType.client]: '客户',
  [UserType.vip]: 'VIP',
  [UserType.department]: '部门',
};
