import moment, { Moment } from 'moment';
import { flowStatusDict } from './constants';
import { getAllDictList } from './flow.api';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useUserStore } from '/@/store/modules/user';
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
    dataIndex: 'handleByName',
    width: 120,
  },
  {
    title: '发起人',
    dataIndex: 'createByName',
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
    label: '状态',
    field: 'status',
    component: 'Select',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: Object.entries(flowStatusDict).map(([key, value]) => ({
        label: value,
        value: key,
        key,
      })),
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
    label: '',
    field: 'createBy',
    component: 'Input',
    show: false,
  },
  {
    label: '标题',
    field: 'title',
    required: true,
    component: 'Input',
    dynamicDisabled: ({ values }) => !!values.id,
  },
  {
    label: '分类',
    field: 'problemType',
    required: true,
    component: 'ApiSelect',
    dynamicDisabled: ({ values }) => {
      if (!values.id) return false;
      const userStore = useUserStore();
      return values.handleBy !== userStore.userInfo?.username;
    },
    componentProps: ({ formActionType }) => {
      return {
        api: getAllDictList,
        labelField: 'itemText',
        valueField: 'itemValue',
        onChange: (value, options) => {
          console.log(options);
          const { updateSchema, setFieldsValue } = formActionType;
          updateSchema([
            {
              field: 'handleBy',
              componentProps: {
                params: {
                  dictItemValue: value ?? '',
                },
              },
            },
          ]);
          setFieldsValue({
            handleBy: '',
            problemTypeLabel: options.label,
          });
        },
      };
    },
  },
  {
    label: '',
    field: 'problemTypeLabel',
    component: 'Input',
    show: false,
  },
  {
    label: '描述',
    field: 'description',
    component: 'JAddInput',
    dynamicDisabled: ({ values }) => {
      if (!values.id) return false;
      const userStore = useUserStore();
      const userName = userStore.userInfo?.username;
      return values.createBy !== userName && values.handleBy !== userName;
    },
    componentProps: () => {
      const userStore = useUserStore();
      return {
        value: '',
        min: 0,
        defaultLabel: userStore.userInfo?.realname,
      };
    },
  },
  {
    label: '经办人',
    field: 'handleBy',
    ifShow: ({ values }) => !!values.id,
    required: ({ values }) => {
      const userStore = useUserStore();
      return values.handleBy === userStore.userInfo?.username;
    },
    component: 'JSelectUserByDictItem',
    dynamicDisabled: ({ values }) => {
      const userStore = useUserStore();
      return values.handleBy !== userStore.userInfo?.username;
    },
    componentProps: ({ formModel }) => ({
      value: [],
      labelKey: 'realname',
      rowKey: 'username',
      maxSelectCount: 1,
      params: {
        dictItemValue: formModel.problemType ?? '',
      },
    }),
  },
  {
    label: '截止时间',
    field: 'expectHandleTime',
    required: true,
    dynamicDisabled: ({ values }) => {
      if (!values.id) return false;
      const userStore = useUserStore();
      return values.createBy !== userStore.userInfo?.username;
    },
    component: platform.isMobile() ? 'MDatePicker' : 'DatePicker',
    componentProps: !platform.isMobile()
      ? {
          showTime: true,
          valueFormat: timeFormat,
          placeholder: '请选择截止时间',
          disabledDate: (current: Moment) => current && current < moment().startOf('day'),
        }
      : {},
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
