<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" :width="adaptiveWidth" @ok="handleSubmit" :showFooter="showFooter" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './flow.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { saveOrUpdateFlow } from './flow.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import moment from 'moment';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  // TODO [VUEN-527] https://www.teambition.com/task/6239beb894b358003fe93626
  const showFooter = ref(true);
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showFooter: showFooter.value });
    isUpdate.value = !!data?.isUpdate;
    updateSchema([
      {
        field: 'title',
        dynamicDisabled: isUpdate.value,
      },
      {
        field: 'endTimeStr',
        dynamicDisabled: isUpdate.value,
      },
    ]);
    // 无论新增还是编辑，都可以设置表单值
    if (typeof data.record === 'object') {
      data.record.operatorId = data.record.operator?.id ?? '';
      data.record.descriptionList = JSON.stringify((data.record.description ?? []).map((item: any) => ({ label: item.creator.realname, value: item.content })));
      data.record.endTimeStr = moment(parseInt(data.record.endTime, 10));
      setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !showFooter.value });
  });
  //获取标题
  const getTitle = computed(() => (showFooter.value ? (!unref(isUpdate) ? '新增工单' : '编辑工单') : '查看工单'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setDrawerProps({ confirmLoading: true });
      values.userIdentity === 1 && (values.departIds = '');
      //提交表单
      await saveOrUpdateFlow(values, unref(isUpdate));
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
