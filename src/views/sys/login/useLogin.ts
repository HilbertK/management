import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import type { RuleObject } from 'ant-design-vue/lib/form/interface';
import { ref, computed, unref, Ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { checkOnlyUser } from '/@/api/sys/user';
import { Oauth2LoginRoute } from '/@/router/routes';

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
}

export enum UserTypeEnum {
  NaturalPerson = 'natural_person',
  LegalPerson = 'legal_person',
}

export enum SmsEnum {
  LOGIN = '0',
  REGISTER = '1',
}
const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}

export function useFormRules(formData?: Recordable) {
  const { t } = useI18n();

  const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')));
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')));
  const getRealNameFormRule = computed(() => createRule(t('sys.login.realNamePlaceholder')));

  const getRegisterAccountRule = computed(() => createRegisterAccountRule('account'));
  const getRegisterMobileRule = computed(() => createRegisterAccountRule('mobile'));

  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'));
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'));
      }
      return Promise.resolve();
    };
  };

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const accountFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const realNameFormRule = unref(getRealNameFormRule);

    const registerAccountRule = unref(getRegisterAccountRule);
    const registerMobileRule = unref(getRegisterMobileRule);

    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          account: registerAccountRule,
          password: passwordFormRule,
          realname: realNameFormRule,
          mobile: registerMobileRule,
          confirmPassword: [{ validator: validateConfirmPassword(formData?.password), trigger: 'change' }],
        };
      // login form rules
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        };
    }
  });
  return { getFormRules };
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
function createRegisterAccountRule(type) {
  return [
    {
      validator: type == 'account' ? checkUsername : checkPhone,
      trigger: 'change',
    },
  ];
}
function checkUsername(rule, value, callback) {
  const { t } = useI18n();
  if (!value) {
    return Promise.reject(t('sys.login.accountPlaceholder'));
  } else {
    return new Promise((resolve, reject) => {
      checkOnlyUser({ username: value }).then((res) => {
        res.success ? resolve() : reject('用户名已存在!');
      });
    });
  }
}

/**
 * 判断是否是OAuth2APP环境
 */
export function isOAuth2AppEnv() {
  return /wxwork|dingtalk/i.test(navigator.userAgent);
}

/**
 * 后台构造oauth2登录地址
 * @param source
 */
export function sysOAuth2Login(source, redirect = '') {
  let url = `${window._CONFIG['domianURL']}/jeecg-system/sys/thirdLogin/oauth2/${source}/login`;
  url += `?state=${encodeURIComponent(`${window.location.origin}${Oauth2LoginRoute.path}?target=${encodeURIComponent(redirect)}`)}`;
  window.location.href = url;
}

async function checkPhone(rule, value, callback) {
  const reg = /^1[3456789]\d{9}$/;
  if (!reg.test(value)) {
    return Promise.reject(new Error('请输入正确手机号'));
  } else {
    return new Promise((resolve, reject) => {
      checkOnlyUser({ phone: value }).then((res) => {
        res.success ? resolve() : reject('手机号已存在!');
      });
    });
  }
}
