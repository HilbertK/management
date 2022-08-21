<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input class="fix-auto-fill" size="large" v-model:value="formData.account" :placeholder="t('sys.login.userName')" />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter size="large" v-model:value="formData.password" :placeholder="t('sys.login.password')" />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword size="large" visibilityToggle v-model:value="formData.confirmPassword" :placeholder="t('sys.login.confirmPassword')" />
      </FormItem>
      <FormItem name="realname" class="enter-x">
        <Input class="fix-auto-fill" size="large" v-model:value="formData.realname" :placeholder="t('sys.login.realName')" />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" class="fix-auto-fill" />
      </FormItem>
      <Button type="primary" class="enter-x" size="large" block @click="handleRegister" :loading="loading">
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed, toRaw } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum, UserTypeEnum } from './useLogin';
  import { register } from '/@/api/sys/user';
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { notification } = useMessage();
  const formRef = ref();
  const loading = ref(false);
  const formData = reactive({
    account: '',
    password: '',
    confirmPassword: '',
    realname: '',
    mobile: '',
  });
  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);
  /**
   * 注册
   */
  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const resultInfo = await register(
        toRaw({
          username: data.account,
          password: data.password,
          realname: data.realname,
          phone: data.mobile,
        })
      );
      if (resultInfo && resultInfo.data.success) {
        notification.success({
          message: resultInfo.data.message || t('sys.api.registerMsg'),
          duration: 3,
        });
        handleBackLogin();
      } else {
        notification.warning({
          message: t('sys.api.errorTip'),
          description: resultInfo.data.message || t('sys.api.networkExceptionMsg'),
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: t('sys.api.errorTip'),
        description: error.message || t('sys.api.networkExceptionMsg'),
        duration: 3,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
