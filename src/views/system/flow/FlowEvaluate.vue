<template>
  <PageWrapper contentBackground contentClass="p-4">
    <a-result :status="flowError ? 'error' : 'success'" :title="flowError || '提交成功'" v-if="isFinished">
      <template #extra v-if="!isSolved">
        <a-button key="recreate" type="primary" @click="handleCreateFlow">重新发起工单</a-button>
        <a-button key="report" @click="handleReport">举报</a-button>
      </template>
    </a-result>
    <BasicForm @register="registerForm" v-else />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { router } from '/@/router';
  import { evaluateFormSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import { evaluateFlow, detail } from './flow.api';
  import { FlowStatus } from './constants';
  import { formatFormFieldValue, getCreateFlowRouteByPrev } from './utils';
  const isFinished = ref(false);
  const flowError = ref('');
  const isSolved = ref(true);
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
      flowError.value = '工单不存在';
      isFinished.value = true;
      return;
    }
    const data: any = await detail(query.id as string);
    if (data != null && typeof data === 'object') {
      const userId = userStore.getUserInfo.username;
      const creatorId = data.createBy ?? '';
      if (creatorId !== userId) {
        flowError.value = '无法评价';
        isFinished.value = true;
        return;
      }
      setFieldsValue({
        ...formatFormFieldValue(data),
      });
      if (data.status !== FlowStatus.Evaluate) {
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
      const values = await validate();
      isSolved.value = values.solved;
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      //提交表单
      await evaluateFlow(values, workNoId);
      setProps({
        submitButtonOptions: {
          loading: false,
        },
      });
      isFinished.value = true;
    } finally {
    }
  }

  function handleCreateFlow() {
    const workNoId = (query.id ?? '') as string;
    router.push(getCreateFlowRouteByPrev(workNoId));
  }

  function handleReport() {
    // TODO:跳转举报页面
  }
</script>
