import moment from 'moment';
import { getAllDictList } from './flow.api';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { platform } from '/@/utils/platform';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

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
    customRender: ({ text }) => text?.realname ?? '',
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
    dataIndex: 'endTimeStr',
    width: 120,
    customRender: ({ record }) => moment(record.endTime).format(timeFormat),
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
    component: 'DatePicker',
    colProps: { span: 3, xl: { span: 5 } },
    componentProps: {
      showTime: false,
      placeholder: '请选择创建时间',
    },
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
    required: true,
    component: 'Input',
  },
  {
    label: '分类',
    field: 'selecteddict',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      api: getAllDictList,
      labelField: 'dictName',
      valueField: 'id',
    },
  },
  {
    label: '描述',
    field: 'descriptionList',
    component: 'JAddInput',
    componentProps: {
      value: '',
      min: 0,
    },
  },
  {
    label: '经办人',
    field: 'operatorId',
    required: true,
    component: 'JSelectUser',
    componentProps: {
      value: [],
      labelKey: 'realname',
      rowKey: 'id',
      maxSelectCount: 1,
    },
  },
  {
    label: '截止时间',
    field: 'endTimeStr',
    required: true,
    component: platform.isMobile() ? 'MDatePicker' : 'DatePicker',
    componentProps: !platform.isMobile() ? { showTime: true, valueFormat: 'YYYY-MM-DD HH:mm:ss', placeholder: '请选择截止时间' } : {},
  },
];

export const evaluateFormSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    dynamicDisabled: true,
    component: 'Input',
  },
  {
    label: '解决情况',
    field: 'resolved',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '已解决', value: '0' },
        { label: '未解决', value: '1' },
      ],
    },
  },
  {
    label: '评分',
    field: 'score',
    required: true,
    component: 'Rate',
    componentProps: {
      allowHalf: true,
    },
  },
  {
    label: '评价',
    field: 'content',
    required: true,
    component: 'JTextArea',
    componentProps: {},
  },
];
