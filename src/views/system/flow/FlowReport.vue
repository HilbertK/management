<template>
  <PageWrapper contentBackground contentClass="p-4">
    <a-result :status="flowError ? 'error' : 'success'" :title="flowError || '提交成功'" v-if="isFinished" />
    <BasicForm @register="registerForm" v-else />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { reportFormSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import { reportFlow, detail } from './flow.api';
  import { FlowStatus } from './constants';
  const isFinished = ref(false);
  const flowError = ref('');
  //表单配置
  const [registerForm, { setProps, resetFields, validate }] = useForm({
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
    schemas: reportFormSchema,
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
      flowError.value = '工单不存在';
      isFinished.value = true;
      return;
    }
    const data: any = await detail(query.id as string);
    if (data != null && typeof data === 'object') {
      const userId = userStore.getUserInfo.username;
      const creatorId = data.createBy ?? '';
      if (creatorId !== userId || data.status !== FlowStatus.End) {
        flowError.value = '无法举报';
        isFinished.value = true;
      }
    } else {
      flowError.value = '工单不存在';
      isFinished.value = true;
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
      await reportFlow(values, workNoId);
      isFinished.value = true;
    } finally {
      setProps({
        submitButtonOptions: {
          loading: false,
        },
      });
    }
  }
</script>
