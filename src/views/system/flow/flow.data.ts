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
    dataIndex: 'problemTypeLabel',
    width: 120,
  },
  {
    title: '经办人',
    dataIndex: 'takingByName',
    width: 120,
  },
  {
    title: '发起人',
    dataIndex: 'createByName',
    width: 120,
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: 120,
  },
  {
    title: '评价',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title: '截止时间',
    dataIndex: 'expectHandleTime',
    width: 120,
    customRender: ({ record }) => moment(record.expectHandleTime).format(timeFormat),
  },
  {
    title: '状态',
    dataIndex: 'statusLabel',
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
    field: 'problemType',
    required: true,
    component: 'ApiSelect',
    componentProps: ({ formActionType }) => {
      return {
        api: getAllDictList,
        labelField: 'itemText',
        valueField: 'itemValue',
        onChange: (value, option) => {
          const { updateSchema, setFieldsValue } = formActionType;
          updateSchema([
            {
              field: 'handleBy',
              componentProps: {
                params: {
                  dictItemId: option?.id ?? '',
                },
              },
            },
          ]);
          setFieldsValue({
            handleBy: '',
          });
        },
      };
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'JAddInput',
    componentProps: {
      value: '',
      min: 0,
    },
  },
  {
    label: '经办人',
    field: 'handleBy',
    required: true,
    component: 'JSelectUserByDictItem',
    componentProps: {
      value: [],
      labelKey: 'realname',
      rowKey: 'username',
      maxSelectCount: 1,
      params: {
        dictItemId: '',
      },
    },
  },
  {
    label: '截止时间',
    field: 'expectHandleTime',
    required: true,
    component: platform.isMobile() ? 'MDatePicker' : 'DatePicker',
    componentProps: !platform.isMobile() ? { showTime: true, valueFormat: 'YYYY-MM-DD HH:mm:ss', placeholder: '请选择截止时间' } : {},
  },
];

export const evaluateFormSchema: FormSchema[] = [
  {
    label: '解决情况',
    field: 'solved',
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
    field: 'remark',
    required: true,
    component: 'JTextArea',
    componentProps: {},
  },
];
