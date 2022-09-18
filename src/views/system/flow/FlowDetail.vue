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
  import { evaluateFormSchema, formSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import moment from 'moment';
  import { updateFlow, reassignFlow, saveFlow, detail } from './flow.api';
  import { FlowOpMode } from './constants';
  const { createMessage } = useMessage();
  const isFinished = ref(false);
  const noFlow = ref(false);
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
    schemas: [...formSchema, ...evaluateFormSchema.map((item) => ({ ...item, ifShow: false }))],
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
      updateSchema([
        {
          field: 'handleBy',
          ifShow: false,
        },
      ]);
      return;
    }
    let data: any;
    try {
      data = await detail(query.id as string);
    } catch (e) {
      console.error(e);
      noFlow.value = true;
      isFinished.value = true;
      createMessage.error('获取工单信息出错！');
      return;
    }
    if (typeof data === 'object') {
      const userId = userStore.getUserInfo.username;
      const operatorId = data.handleBy ?? '';
      const creatorId = data.createBy ?? '';
      if (operatorId === userId) {
        mode.value = FlowOpMode.Reassign;
      } else if (creatorId === userId) {
        mode.value = FlowOpMode.Edit;
      } else {
        mode.value = FlowOpMode.NoPermission;
        setProps({ showSubmitButton: false, disabled: true });
      }
      const newSchema = [
        {
          field: 'title',
          dynamicDisabled: true,
        },
        {
          field: 'problemType',
          dynamicDisabled: mode.value !== FlowOpMode.Reassign,
        },
        {
          field: 'description',
          componentProps: {
            defaultLabel: userStore.userInfo?.realname,
          },
        },
        {
          field: 'handleBy',
          dynamicDisabled: mode.value !== FlowOpMode.Reassign,
        },
        {
          field: 'expectHandleTime',
          dynamicDisabled: mode.value !== FlowOpMode.Edit,
        },
      ];
      updateSchema([...newSchema, ...(mode.value === FlowOpMode.NoPermission && data.evaluateTime ? evaluateFormSchema.map((item) => ({ field: item.field, ifShow: true })) : [])]);
      data.expectHandleTime = moment(data.expectHandleTime);
      setFieldsValue({
        ...data,
      });
    }
  };
  onMounted(async () => {
    await fetch();
  });
  //提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      delete values.id;
      delete values.title;
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      values.description = JSON.stringify(
        JSON.parse(values.description ?? '[]')
          .filter((item) => item.value)
          .map(({ label, value }) => ({ label, value }))
      );
      const flowMode = unref(mode);
      const workNoId = (query.id ?? '') as string;
      if (flowMode === FlowOpMode.Edit && workNoId) {
        await updateFlow(values, workNoId);
      } else if (flowMode === FlowOpMode.Reassign && workNoId) {
        await reassignFlow(values, workNoId);
      } else if (flowMode === FlowOpMode.Add && !workNoId) {
        await saveFlow(values);
      }
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
