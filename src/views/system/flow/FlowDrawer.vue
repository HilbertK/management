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
    mode.value = data.mode;
    if (mode.value === FlowOpMode.Add) {
      updateSchema([
        {
          field: 'handleBy',
          ifShow: false,
        },
      ]);
      return;
    }
    // 无论新增还是编辑，都可以设置表单值
    if (typeof data.record === 'object') {
      workOrderId.value = data.record.id;
      updateSchema([
        {
          field: 'title',
          dynamicDisabled: true,
        },
        {
          field: 'handleBy',
          dynamicDisabled: mode.value !== FlowOpMode.Reassign,
        },
        {
          field: 'expectHandleTime',
          dynamicDisabled: mode.value === FlowOpMode.Edit,
        },
      ]);
      data.record.descriptionList = JSON.stringify((data.record.description ?? []).map((item: any) => ({ label: item.creator.realname, value: item.content })));
      data.record.expectHandleTime = moment(data.record.expectHandleTime);
      setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !showFooter.value });
  });
  //获取标题
  const getTitle = computed(() => (showFooter.value ? (unref(mode) === FlowOpMode.Add ? '新增工单' : '编辑工单') : '查看工单'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
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
