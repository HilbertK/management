<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="举报" :width="adaptiveWidth" @ok="handleSubmit" :showFooter="showFooter" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { tipOffFormSchema } from './flow.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { tipOffFlow } from './flow.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import { formatTipOffValue } from './utils';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const workOrderId = ref('');
  //表单配置
  const [registerForm, { setProps, resetFields, validate }] = useForm({
    labelWidth: 90,
    schemas: tipOffFormSchema,
    showActionButtonGroup: false,
  });
  const showFooter = ref(true);
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showFooter: showFooter.value });
    if (typeof data.record === 'object') {
      workOrderId.value = data.record.id;
    }
    // 隐藏底部时禁用整个表单
    if (!showFooter.value) {
      setProps({ disabled: true });
    }
  });
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  //提交事件
  async function handleSubmit() {
    try {
      const values = formatTipOffValue(await validate());
      setDrawerProps({ confirmLoading: true });
      await tipOffFlow(values, workOrderId.value);
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
