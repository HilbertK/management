<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" :width="adaptiveWidth" @ok="handleSubmit" :showFooter="showFooter" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './user.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { saveOrUpdateUser, getUserRoles } from './user.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const rowId = ref('');
  // const departOptions = ref([]);
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
    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      try {
        const userRoles = await getUserRoles({ userid: data.record.id });
        if (userRoles && userRoles.length > 0) {
          data.record.selectedroles = userRoles;
        }
      } catch (error) {}
    }
    //处理角色用户列表情况(和角色列表有关系)
    data.selectedroles && (await setFieldsValue({ selectedroles: data.selectedroles }));
    //编辑时隐藏密码/角色列表隐藏角色信息/我的部门时隐藏所属部门
    updateSchema([
      {
        field: 'username',
        show: true,
      },
      {
        field: 'password',
        show: !unref(isUpdate),
      },
      {
        field: 'confirmPassword',
        ifShow: !unref(isUpdate),
      },
      {
        field: 'workNo',
        ifShow: unref(isUpdate),
      },
      {
        field: 'selectedroles',
        show: !data.isRole,
      },
      {
        field: 'teamName',
        ifShow: unref(isUpdate),
      },
    ]);
    // 无论新增还是编辑，都可以设置表单值
    if (typeof data.record === 'object') {
      setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !showFooter.value });
  });
  //获取标题
  const getTitle = computed(() => (showFooter.value ? (!unref(isUpdate) ? '新增用户' : '编辑用户') : '查看用户'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setDrawerProps({ confirmLoading: true });
      values.userIdentity === 1 && (values.departIds = '');
      //提交表单
      await saveOrUpdateUser(values, unref(isUpdate));
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
