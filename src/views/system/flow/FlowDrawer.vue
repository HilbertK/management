<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" :width="adaptiveWidth" @ok="handleSubmit" :showFooter="showFooter" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, evaluateFormSchema } from './flow.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useUserStore } from '/@/store/modules/user';
  import { updateFlow, saveFlow, reassignFlow } from './flow.api';
  import { FlowOpMode } from './constants';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import moment from 'moment';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const mode = ref(null);
  const workOrderId = ref('');
  const userStore = useUserStore();
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: [...formSchema, ...evaluateFormSchema.map((item) => ({ ...item, ifShow: false }))],
    showActionButtonGroup: false,
  });
  const showFooter = ref(true);
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showFooter: showFooter.value });
    mode.value = data.mode ?? FlowOpMode.NoPermission;
    const newSchema = [
      {
        field: 'title',
        dynamicDisabled: mode.value !== FlowOpMode.Add,
      },
      {
        field: 'problemType',
        dynamicDisabled: mode.value !== FlowOpMode.Reassign,
      },
      {
        field: 'description',
        componentProps: {
          defaultLabel: userStore.userInfo?.realname,
        },
      },
      {
        field: 'handleBy',
        ifShow: mode.value !== FlowOpMode.Add,
        dynamicDisabled: mode.value !== FlowOpMode.Reassign,
      },
      {
        field: 'expectHandleTime',
        dynamicDisabled: mode.value !== FlowOpMode.Edit,
      },
    ];
    updateSchema([...newSchema, ...(mode.value === FlowOpMode.NoPermission && data.record.evaluateTime ? evaluateFormSchema.map((item) => ({ field: item.field, ifShow: true })) : [])]);
    // 无论新增还是编辑，都可以设置表单值
    if (typeof data.record === 'object') {
      workOrderId.value = data.record.id;
      data.record.expectHandleTime = moment(data.record.expectHandleTime);
      setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !showFooter.value });
  });
  //获取标题
  const getTitle = computed(() => {
    if (!mode.value) return '';
    return {
      [FlowOpMode.Add]: '新增工单',
      [FlowOpMode.Edit]: '编辑工单',
      [FlowOpMode.Reassign]: '转交工单',
      [FlowOpMode.NoPermission]: '查看工单',
    }[mode.value];
  });
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      values.description = JSON.stringify(
        JSON.parse(values.description ?? '[]')
          .filter((item) => item.value)
          .map(({ label, value }) => ({ label, value }))
      );
      delete values.id;
      delete values.title;
      setDrawerProps({ confirmLoading: true });
      const flowMode = unref(mode);
      if (flowMode === FlowOpMode.Edit) {
        await updateFlow(values, unref(workOrderId));
      } else if (flowMode === FlowOpMode.Reassign) {
        await reassignFlow(values, unref(workOrderId));
      } else {
        await saveFlow(values);
      }
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
