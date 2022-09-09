import moment from 'moment';
import { getAllDictList } from './flow.api';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

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
    customRender: ({ record }) => moment(parseInt(record.endTime, 10)).format(timeFormat),
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
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: timeFormat,
      placeholder: '请选择截止时间',
    },
  },
];
