import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getAllRolesList, getOfficeList, SexDict } from './user.api';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { userTypeDict } from './constants';
export const columns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 100,
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: 100,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 100,
  },
  {
    title: '部门/团队',
    width: 100,
    dataIndex: 'teamName',
  },
  {
    title: '办公室',
    width: 100,
    dataIndex: 'office',
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'userType',
    customRender: ({ text }) => `${userTypeDict[text] ?? ''}`,
  },
  {
    title: '状态',
    dataIndex: 'status_dictText',
    width: 80,
  },
];

export const recycleColumns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 100,
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 100,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 80,
    customRender: render.renderAvatar,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    sorter: true,
    customRender: ({ text }) => SexDict[text],
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '姓名',
    field: 'realname',
    component: 'Input',
    colProps: { span: 4, xl: { span: 5 } },
  },
  {
    label: '部门/团队',
    field: 'teamName',
    component: 'Input',
    colProps: { span: 5, xl: { span: 6 } },
  },
  {
    label: '办公室',
    field: 'office',
    component: 'ApiSelect',
    componentProps: {
      api: getOfficeList,
      labelField: 'itemText',
      valueField: 'itemValue',
    },
    colProps: { span: 4, xl: { span: 5 } },
  },
  {
    label: '类型',
    field: 'userType',
    component: 'Select',
    componentProps: {
      options: Object.entries(userTypeDict).map(([key, value]) => ({ value: key, label: value })),
    },
    colProps: { span: 4, xl: { span: 5 } },
  },
  {
    label: '手机号',
    field: 'phone',
    component: 'Input',
    colProps: { span: 4, xl: { span: 5 } },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'user_status',
      placeholder: '请选择状态',
      stringToNumber: true,
    },
    colProps: { span: 5, xl: { span: 6 } },
  },
];

export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '用户账号',
    field: 'username',
    component: 'Input',
    required: true,
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('sys_user', 'username', model, schema, true),
  },
  {
    label: '登录密码',
    field: 'password',
    component: 'StrengthMeter',
    rules: [
      {
        required: true,
        message: '请输入登录密码',
      },
    ],
  },
  {
    label: '确认密码',
    field: 'confirmPassword',
    component: 'InputPassword',
    dynamicRules: ({ values }) => rules.confirmPassword(values, true),
  },
  {
    label: '用户姓名',
    field: 'realname',
    required: true,
    component: 'Input',
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    rules: rules.rule('email', false),
  },
  {
    label: '手机号码',
    field: 'phone',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ ...rules.duplicateCheckRule('sys_user', 'phone', model, schema, false)[0] }, { pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '手机号码格式有误' }];
    },
  },
  {
    label: '工号',
    field: 'workNo',
    required: false,
    component: 'Input',
    dynamicDisabled: true,
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('sys_user', 'work_no', model, schema, false),
  },
  // {
  //   label: '职务',
  //   field: 'post',
  //   required: false,
  //   dynamicDisabled: true,
  //   component: 'JSelectPosition',
  //   componentProps: {
  //     rowKey: 'code',
  //     labelKey: 'name',
  //   },
  // },
  {
    label: '角色',
    field: 'selectedroles',
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      api: getAllRolesList,
      labelField: 'roleName',
      valueField: 'id',
    },
  },
  {
    label: '部门/团队',
    field: 'teamName',
    required: false,
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '办公室',
    field: 'office',
    component: 'ApiSelect',
    componentProps: {
      api: getOfficeList,
      labelField: 'itemText',
      valueField: 'itemValue',
    },
    dynamicDisabled: true,
  },
  {
    label: '类型',
    field: 'userType',
    component: 'Select',
    componentProps: {
      options: Object.entries(userTypeDict).map(([key, value]) => ({ value: key, label: value })),
    },
    dynamicDisabled: true,
  },
  {
    label: '头像',
    field: 'avatar',
    component: 'JImageCropUpload',
    componentProps: {
      bizPath: 'avatar',
      width: '100px',
      height: '100px',
    },
  },
  {
    label: '形象照',
    field: 'appearance',
    component: 'JImageCropUpload',
    componentProps: {
      bizPath: 'appearance',
      width: '200px',
      height: '300px',
      fileSize: 5,
    },
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
  },
  {
    label: '性别',
    field: 'sex',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'sex',
      placeholder: '请选择性别',
      stringToNumber: true,
    },
  },
];

export const formPasswordSchema: FormSchema[] = [
  {
    label: '用户账号',
    field: 'username',
    component: 'Input',
    componentProps: { readOnly: true, disabled: true },
  },
  {
    label: '登录密码',
    field: 'password',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '请输入登录密码',
    },
    rules: [
      {
        required: true,
        message: '请输入登录密码',
      },
    ],
  },
  {
    label: '确认密码',
    field: 'confirmPassword',
    component: 'InputPassword',
    dynamicRules: ({ values }) => rules.confirmPassword(values, true),
  },
];

export const formAgentSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    componentProps: {
      readOnly: true,
      allowClear: false,
    },
  },
  {
    field: 'agentUserName',
    label: '代理人用户名',
    required: true,
    component: 'JSelectUser',
    componentProps: {
      rowKey: 'username',
      labelKey: 'realname',
      maxSelectCount: 10,
    },
  },
  {
    field: 'startTime',
    label: '代理开始时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择代理开始时间',
    },
  },
  {
    field: 'endTime',
    label: '代理结束时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择代理结束时间',
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'JDictSelectTag',
    defaultValue: '1',
    componentProps: {
      dictCode: 'valid_status',
      type: 'radioButton',
    },
  },
];
