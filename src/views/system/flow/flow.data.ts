import moment, { Moment } from 'moment';
import { useRouter } from 'vue-router';
import { FlowOpMode, flowStatusDict } from './constants';
import { getAllDictList } from './flow.api';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useUserStore } from '/@/store/modules/user';
import { platform } from '/@/utils/platform';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const isNotReassign = (values: any) => {
  if (!values.id) return false;
  return values.flowOpMode !== FlowOpMode.Reassign;
};

const isNotEdit = (values: any) => {
  if (!values.id) return false;
  return values.flowOpMode !== FlowOpMode.Edit;
};

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
    title: '处理人',
    dataIndex: 'handleByName',
    width: 120,
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    width: 120,
  },
  {
    title: '截止时间',
    dataIndex: 'expectHandleTime',
    width: 120,
    customRender: ({ text }) => moment(text).format(timeFormat),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ text }) => flowStatusDict[text] ?? '未知',
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
    ifShow: () => {
      const { currentRoute } = useRouter();
      return !currentRoute.value.query.take;
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
    label: '',
    field: 'flowOpMode',
    component: 'Input',
    show: false,
  },
  {
    label: '标题',
    field: 'title',
    required: ({ values }) => !values.id,
    component: 'Input',
    dynamicDisabled: ({ values }) => !!values.id,
  },
  {
    label: '描述',
    field: 'description',
    component: 'JTextArea',
    dynamicDisabled: ({ values }) => isNotEdit(values),
    componentProps: {},
  },
  {
    label: '分类',
    field: 'problemType',
    required: ({ values }) => !isNotReassign(values),
    component: 'ApiSelect',
    dynamicDisabled: ({ values }) => isNotReassign(values),
    componentProps: ({ formActionType }) => {
      return {
        api: getAllDictList,
        labelField: 'itemText',
        valueField: 'itemValue',
        onChange: (value, options) => {
          const { updateSchema, setFieldsValue } = formActionType;
          updateSchema([
            {
              field: 'handleBy',
              componentProps: {
                params: {
                  dictId: 'problemType',
                  dictItemValue: value ?? '',
                },
              },
            },
          ]);
          setFieldsValue({
            handleBy: null,
            problemTypeLabel: options?.label ?? '',
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
    label: '处理备注',
    field: 'handleDescription',
    component: 'JAddInput',
    ifShow: ({ values }) => !!values.id && values.flowOpMode === FlowOpMode.Reassign,
    dynamicDisabled: ({ values }) => isNotReassign(values),
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
    label: '处理人',
    field: 'handleBy',
    ifShow: ({ values }) => !!values.id,
    required: ({ values }) => !isNotReassign(values),
    component: 'JSelectUserByDictItem',
    dynamicDisabled: ({ values }) => isNotReassign(values),
    componentProps: {
      value: [],
      labelKey: 'realname',
      rowKey: 'username',
      maxSelectCount: 1,
      params: {
        dictId: 'problemType',
        dictItemValue: '',
      },
    },
  },
  {
    label: '截止时间',
    field: 'expectHandleTime',
    required: ({ values }) => !isNotEdit(values),
    dynamicDisabled: ({ values }) => isNotEdit(values),
    component: platform.isMobile() ? 'MDatePicker' : 'DatePicker',
    componentProps: !platform.isMobile()
      ? {
          showTime: true,
          valueFormat: timeFormat,
          placeholder: '请选择截止时间',
          disabledDate: (current: Moment) => current && current < moment().startOf('day'),
        }
      : {
          minDate: new Date(),
          maxDate: new Date(new Date().getFullYear() + 2, 0, 0),
        },
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
    field: 'solved',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '已解决', value: true },
        { label: '未解决', value: false },
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
    required: false,
    component: 'JTextArea',
  },
];

export const reportFormSchema: FormSchema[] = [
  {
    label: '举报理由',
    field: 'reportDescription',
    required: true,
    component: 'JTextArea',
  },
  {
    label: '附件',
    field: 'reportAttachments',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 9,
    },
  },
];
