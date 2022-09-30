import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { dictItemCheck } from './dict.api';
import { rules } from '/@/utils/helper/validator';

const hasInvalidSymbol = (value: string) => new RegExp("[`~!@#$^&*()=|{}'.<>《》/?！￥（）—【】‘；：”“。，、？]").test(value);

export const columns: BasicColumn[] = [
  {
    title: '分类名称',
    dataIndex: 'dictName',
    width: 240,
  },
  {
    title: '分类编号',
    dataIndex: 'dictCode',
    width: 240,
  },
  {
    title: '描述',
    dataIndex: 'description',
    // width: 120
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '分类名称',
    field: 'dictName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '分类编码',
    field: 'dictCode',
    component: 'Input',
    colProps: { span: 6 },
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
    label: '分类名称',
    field: 'dictName',
    required: true,
    component: 'Input',
  },
  {
    label: '分类编码',
    field: 'dictCode',
    component: 'Input',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('sys_dict', 'dict_code', model, schema, true),
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
];

export const itemFormSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '分类名称',
    field: 'itemText',
    required: true,
    component: 'Input',
    dynamicRules: ({ values, model }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入分类名');
            }
            if (hasInvalidSymbol(value)) {
              return Promise.reject('分类名不能包含特殊字符！');
            }
            return new Promise<void>((resolve, reject) => {
              const params = {
                dictId: values.dictId,
                id: model.id,
                itemText: value,
              };
              dictItemCheck(params)
                .then((res) => {
                  res.success ? resolve() : reject(res.message || '校验失败');
                })
                .catch((err) => {
                  reject(err.message || '验证失败');
                });
            });
          },
        },
      ];
    },
  },
  {
    label: '分类编码',
    field: 'itemValue',
    component: 'Input',
    dynamicRules: ({ values, model }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入分类编码');
            }
            if (hasInvalidSymbol(value)) {
              return Promise.reject('分类编码不能包含特殊字符！');
            }
            return new Promise<void>((resolve, reject) => {
              const params = {
                dictId: values.dictId,
                id: model.id,
                itemValue: value,
              };
              dictItemCheck(params)
                .then((res) => {
                  res.success ? resolve() : reject(res.message || '校验失败');
                })
                .catch((err) => {
                  reject(err.message || '验证失败');
                });
            });
          },
        },
      ];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
];

export const dictItemColumns: BasicColumn[] = [
  {
    title: '分类名称',
    dataIndex: 'itemText',
    width: 80,
  },
  {
    title: '分类编码',
    dataIndex: 'itemValue',
    width: 80,
  },
];

export const dictItemSearchFormSchema: FormSchema[] = [
  {
    label: '分类名称',
    field: 'itemText',
    component: 'Input',
  },
];

/**
 * 角色用户Columns
 */
export const userColumns = [
  {
    title: '用户账号',
    dataIndex: 'username',
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
  },
  {
    title: '状态',
    dataIndex: 'status_dictText',
    width: 80,
  },
];
/**
 * 角色用户搜索form
 */
export const searchUserFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户账号',
    component: 'Input',
  },
];

export const currDictId = 'problemType';
