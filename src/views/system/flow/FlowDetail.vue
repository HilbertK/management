<template>
  <PageWrapper contentBackground contentClass="p-4">
    <Result status="success" title="提交成功" v-if="isFinished" />
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
  import { formSchema } from './flow.data';
  import { useUserStore } from '/@/store/modules/user';
  import moment from 'moment';
  // import { saveOrUpdateFlow, detail } from './flow.api';
  import { saveOrUpdateFlow, detail } from './mock.api';
  const { createMessage } = useMessage();
  const isFinished = ref(false);
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
    // 从链接中判断是新增、编辑、查看
    const isUpdate = !!query.id;
    if (!isUpdate) {
      updateSchema([
        {
          field: 'operatorId',
          ifShow: false,
        },
      ]);
      return;
    }
    const data: any = await detail(query.id as string);
    if (typeof data === 'object') {
      const userId = userStore.getUserInfo.id;
      const operatorId = data.operator?.id ?? '';
      const creatorId = data.creator?.id ?? '';
      updateSchema([
        {
          field: 'title',
          dynamicDisabled: true,
        },
        {
          field: 'operatorId',
          dynamicDisabled: userId !== operatorId,
        },
        {
          field: 'endTimeStr',
          dynamicDisabled: userId !== creatorId,
        },
      ]);
      data.operatorId = operatorId;
      data.descriptionList = JSON.stringify((data.description ?? []).map((item: any) => ({ label: item.creator.realname, value: item.content })));
      data.endTimeStr = moment(data.expectHandleTime);
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
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      //提交表单
      await saveOrUpdateFlow(values, !!query.id);
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
