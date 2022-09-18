<template>
  <PageWrapper contentBackground contentClass="p-4">
    <Result :status="noFlow ? 'error' : 'success'" :title="noFlow ? '工单有误' : '提交成功'" v-if="isFinished" />
    <BasicForm @register="registerForm" v-else />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useRouter } from 'vue-router';
  import { Result } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { evaluateFormSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import { updateFlow, detail } from './flow.api';
  const { createMessage } = useMessage();
  const isFinished = ref(false);
  const noFlow = ref(false);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
    actionColOptions: {
      style: {
        margin: '0 auto',
        maxWidth: 'fit-content',
      },
    },
    schemas: [
      {
        label: '标题',
        field: 'title',
        dynamicDisabled: true,
        component: 'Input',
      },
      ...evaluateFormSchema,
    ],
    showResetButton: false,
    submitButtonOptions: {
      text: '提交',
      preIcon: '',
    },
    submitFunc: handleSubmit,
  });
  const { currentRoute } = useRouter();
  const { query } = unref(currentRoute);
  const userStore = useUserStore();
  const fetch = async () => {
    await resetFields();
    const hasFlow = !!query.id;
    if (!hasFlow) {
      noFlow.value = true;
      isFinished.value = true;
      createMessage.error('工单不存在！');
      return;
    }
    const data: any = await detail(query.id as string);
    if (typeof data === 'object') {
      setFieldsValue({
        title: data.title,
      });
      const userId = userStore.getUserInfo.id;
      const creatorId = data.createBy ?? '';
      if (creatorId !== userId) {
        createMessage.error('没有评价权限！');
        setProps({ disabled: true, showSubmitButton: false });
      } else if (data.evaluateTime) {
        setProps({ disabled: true });
      }
    }
  };
  onMounted(async () => {
    await fetch();
  });
  //提交事件
  async function handleSubmit() {
    const workNoId = (query.id ?? '') as string;
    if (!workNoId) return;
    try {
      const values = await validate();
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      //提交表单
      await updateFlow(values, workNoId);
      setProps({
        submitButtonOptions: {
          loading: false,
        },
      });
      createMessage.success('提交成功！');
      isFinished.value = true;
    } finally {
    }
  }
</script>
