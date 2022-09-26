import type { AppRouteModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

export const FlowRoute: AppRouteModule = {
  path: '/system/flow',
  name: 'SystemFlow',
  component: () => import('/@/views/system/flow/index.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.flows'),
  },
};

export const FlowDetailRoute: AppRouteModule = {
  path: '/system/flow/detail',
  name: 'SystemFlowDetail',
  component: () => import('/@/views/system/flow/FlowDetail.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.detail'),
  },
};

export const FlowEvaluateRoute: AppRouteModule = {
  path: '/system/flow/evaluate',
  name: 'SystemFlowEvaluate',
  component: () => import('/@/views/system/flow/FlowEvaluate.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.evaluate'),
  },
};

export const FlowTipOffRoute: AppRouteModule = {
  path: '/system/flow/tipoff',
  name: 'SystemFlowTipOff',
  component: () => import('/@/views/system/flow/FlowTipOff.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.tipoff'),
  },
};

export const DictRoute: AppRouteModule = {
  path: '/system/flow/dict',
  name: 'SystemFlowDictItem',
  component: () => import('/@/views/system/flowDict/index.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.dict'),
  },
};
