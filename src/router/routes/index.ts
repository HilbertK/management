import type { AppRouteRecordRaw } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { RoleRoute, UserRoute } from './userCenter';
import { FlowRoute, DictRoute, FlowDetailRoute, FlowEvaluateRoute, FlowTipOffRoute } from './flow';

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

//update-begin---author:wangshuai ---date:20220629  for：auth2登录页面路由------------
export const Oauth2LoginRoute: AppRouteRecordRaw = {
  path: '/oauth2-app/login',
  name: 'oauth2-app-login',
  component: () => import('/@/views/sys/login/OAuth2Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};
//update-end---author:wangshuai ---date:20220629  for：auth2登录页面路由------------

/**
 * 【通过token直接静默登录】流程办理登录页面 中转跳转
 */
export const TokenLoginRoute: AppRouteRecordRaw = {
  path: '/tokenLogin',
  name: 'TokenLoginRoute',
  component: () => import('/@/views/sys/login/TokenLoginPage.vue'),
  meta: {
    title: '带token登录页面',
    ignoreAuth: true,
  },
};

// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  TokenLoginRoute,
  Oauth2LoginRoute,
  UserRoute,
  RoleRoute,
  FlowRoute,
  FlowDetailRoute,
  FlowEvaluateRoute,
  FlowTipOffRoute,
  DictRoute,
];
