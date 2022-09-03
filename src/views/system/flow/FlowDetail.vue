<template>
  <div>
    <BasicForm @register="registerForm" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './flow.data';
  import { saveOrUpdateFlow } from './flow.api';
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
  //获取标题
  const getTitle = computed(() => (showFooter.value ? (!unref(isUpdate) ? '新增工单' : '编辑工单') : '查看工单'));
  onMounted(() => {
    // await resetFields();
    // 从链接中判断是新增、编辑、查看
    // const data = 
    // showFooter.value = data?.showFooter ?? true;
    // isUpdate.value = !!data?.isUpdate;
    // //编辑时隐藏密码/角色列表隐藏角色信息/我的部门时隐藏所属部门
    // // updateSchema([]);
    // // 无论新增还是编辑，都可以设置表单值
    // if (typeof data.record === 'object') {
    //   setFieldsValue({
    //     ...data.record,
    //   });
    // }
    // // 隐藏底部时禁用整个表单
    // setProps({ disabled: !showFooter.value });
  });
  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      values.userIdentity === 1 && (values.departIds = '');
      //提交表单
      await saveOrUpdateFlow(values, unref(isUpdate));
      //刷新列表
      emit('success');
    } finally {
    }
  }
</script>
