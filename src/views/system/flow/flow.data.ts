import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '标题',
    dataIndex: 'title',
    width: 120,
  },
  {
    title: '分类',
    dataIndex: 'type',
    width: 120,
  },
  {
    title: '经办人',
    dataIndex: 'operator',
    width: 120,
  },
  {
    title: '发起人',
    dataIndex: 'creator',
    width: 120,
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: 120,
  },
  {
    title: '评价',
    dataIndex: 'evaluation',
    width: 120,
  },
  {
    title: '截止时间',
    dataIndex: 'endTime',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
    colProps: { span: 3, xl: { span: 5 } },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'Input',
    colProps: { span: 3, xl: { span: 5 } },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'status',
      placeholder: '请选择状态',
      stringToNumber: true,
    },
    colProps: { span: 3, xl: { span: 5 } },
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
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '经办人',
    field: 'operator',
    required: true,
    component: 'Input',
  },
  {
    label: '截止时间',
    field: 'endTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择截止时间',
    },
  },
];
