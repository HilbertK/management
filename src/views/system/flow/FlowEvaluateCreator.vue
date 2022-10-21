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
  import { evaluateCreatorFormSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import { evaluateCreator, detail } from './flow.api';
  import { formatEvaluateValues, formatEvaluateFormFieldValue } from './utils';
  const isFinished = ref(false);
  const flowError = ref('');
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
    schemas: evaluateCreatorFormSchema,
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
    let data: any;
    try {
      data = await detail(query.id as string);
    } catch (e) {
      console.error(e);
      flowError.value = '获取工单信息出错';
      isFinished.value = true;
      return;
    }
    if (data != null && typeof data === 'object') {
      const userId = userStore.getUserInfo.username;
      const handlerId = data.handleBy ?? '';
      if (handlerId !== userId) {
        flowError.value = '无法评价';
        isFinished.value = true;
        return;
      }
      setFieldsValue({
        ...formatEvaluateFormFieldValue(data),
      });
      if (data.scoreForCreator) {
        setProps({ disabled: true, showSubmitButton: false });
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
      const values = formatEvaluateValues(await validate());
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      //提交表单
      await evaluateCreator(values, workNoId);
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
