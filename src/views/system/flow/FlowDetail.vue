<template>
  <PageWrapper contentBackground contentClass="p-4">
    <Result :status="flowError ? 'error' : 'success'" :title="flowError || '提交成功'" v-if="isFinished" />
    <BasicForm @register="registerForm" v-else />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useRouter } from 'vue-router';
  import { Result } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { formSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import { updateFlow, reassignFlow, saveFlow, detail } from './flow.api';
  import { FlowOpMode } from './constants';
  import { formatFormFieldValue, formatValues } from './utils';
  const isFinished = ref(false);
  const flowError = ref('');
  const mode = ref(FlowOpMode.Add);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
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
    schemas: formSchema,
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
    if (!query.id) {
      mode.value = FlowOpMode.Add;
      if (query.prev) {
        try {
          const prevData = formatFormFieldValue(await detail(query.prev as string)) as any;
          setFieldsValue({
            title: prevData.title,
            problemType: prevData.problemType,
            problemTypeLabel: prevData.problemTypeLabel,
          });
        } catch (e) {
          console.error(e);
        }
      }
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
      const operatorId = data.handleBy ?? '';
      const creatorId = data.createBy ?? '';
      updateSchema([
        {
          field: 'handleBy',
          componentProps: {
            params: {
              dictItemValue: data.problemType ?? '',
            },
          },
        },
      ]);
      if (operatorId === userId) {
        mode.value = FlowOpMode.Reassign;
      } else if (creatorId === userId) {
        mode.value = FlowOpMode.Edit;
      } else {
        mode.value = FlowOpMode.NoPermission;
        setProps({ showSubmitButton: false, disabled: true });
      }
      setFieldsValue({
        ...formatFormFieldValue(data),
      });
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
    try {
      const values = formatValues(await validate());
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      const flowMode = unref(mode);
      const workNoId = (query.id ?? '') as string;
      if (flowMode === FlowOpMode.Edit && workNoId) {
        await updateFlow(values, workNoId);
      } else if (flowMode === FlowOpMode.Reassign && workNoId) {
        await reassignFlow(values, workNoId);
      } else if (flowMode === FlowOpMode.Add && !workNoId) {
        await saveFlow(values);
      } else {
        flowError.value = '提交失败';
      }
      setProps({
        submitButtonOptions: {
          loading: false,
        },
      });
      isFinished.value = true;
    } catch (e) {
      setProps({
        submitButtonOptions: {
          loading: false,
        },
      });
    }
  }
</script>
