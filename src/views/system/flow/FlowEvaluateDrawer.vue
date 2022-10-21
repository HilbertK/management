<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" :width="adaptiveWidth" @ok="handleSubmit" :showFooter="showFooter" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { evaluateFormSchema } from './flow.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { detail, evaluateFlow } from './flow.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import { formatEvaluateValues, formatEvaluateFormFieldValue } from './utils';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const workOrderId = ref('');
  const workOrderTitle = ref('');
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    schemas: evaluateFormSchema,
    showActionButtonGroup: false,
  });
  const showFooter = ref(true);
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showFooter: showFooter.value });
    let detailData = data.record;
    if (typeof detailData === 'object') {
      workOrderId.value = detailData.id;
      workOrderTitle.value = detailData.title;
      try {
        detailData = await detail(workOrderId.value);
      } catch (e) {
        console.error(e);
        createMessage.error('获取工单信息出错');
        setProps({ disabled: true });
        return;
      }
      setFieldsValue({
        ...formatEvaluateFormFieldValue(detailData),
      });
    }
    // 隐藏底部时禁用整个表单
    if (!showFooter.value) {
      setProps({ disabled: true });
    }
  });
  const { adaptiveWidth } = useDrawerAdaptiveWidth();
  const getTitle = computed(() => {
    if (!workOrderTitle.value) return '评价';
    return `评价（${workOrderTitle.value}）`;
  });

  //提交事件
  async function handleSubmit() {
    try {
      const values = formatEvaluateValues(await validate());
      setDrawerProps({ confirmLoading: true });
      await evaluateFlow(values, workOrderId.value);
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
