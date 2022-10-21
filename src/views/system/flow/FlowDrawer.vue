<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" :width="adaptiveWidth" @ok="handleSubmit" :showFooter="showFooter" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './flow.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { updateFlow, saveFlow, reassignFlow, detail } from './flow.api';
  import { FlowOpMode } from './constants';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import { formatFormFieldValue, formatValues } from './utils';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const mode = ref(null);
  const workOrderId = ref('');
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  const showFooter = ref(true);
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showFooter: showFooter.value });
    mode.value = data.mode ?? FlowOpMode.NoPermission;
    let detailData = data.record;
    if (typeof detailData === 'object') {
      workOrderId.value = detailData.id;
      try {
        const detailRes = await detail(workOrderId.value);
        detailData = {
          ...detailData,
          ...detailRes,
        };
      } catch (e) {
        console.error(e);
        createMessage.error('获取工单信息出错');
        setProps({ disabled: true });
        return;
      }
      updateSchema([
        {
          field: 'handleBy',
          componentProps: {
            params: {
              dictItemValue: detailData.problemType ?? '',
            },
          },
        },
      ]);
      setFieldsValue({
        ...formatFormFieldValue(detailData, mode.value),
      });
    }
    // 隐藏底部时禁用整个表单
    if (!showFooter.value) {
      setProps({ disabled: true });
    }
  });
  //获取标题
  const getTitle = computed(() => {
    if (!mode.value) return '';
    return (
      {
        [FlowOpMode.Add]: '新增工单',
        [FlowOpMode.Edit]: '编辑工单',
        [FlowOpMode.Reassign]: '转交工单',
        [FlowOpMode.NoPermission]: '查看工单',
      }[mode.value] ?? '查看工单'
    );
  });
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  //提交事件
  async function handleSubmit() {
    try {
      const flowMode = unref(mode);
      const values = formatValues(await validate(), flowMode);
      setDrawerProps({ confirmLoading: true });
      if (flowMode === FlowOpMode.Edit) {
        await updateFlow(values, unref(workOrderId));
      } else if (flowMode === FlowOpMode.Reassign) {
        await reassignFlow(values, unref(workOrderId));
      } else {
        await saveFlow(values);
      }
      createMessage.success('提交成功！');
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
