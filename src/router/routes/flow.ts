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
    title: t('routes.flow.flows'),
  },
};

export const FlowEvaluateRoute: AppRouteModule = {
  path: '/system/flow/evaluate',
  name: 'SystemFlowEvaluate',
  component: () => import('/@/views/system/flow/FlowEvaluate.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.flows'),
  },
};

export const DictRoute: AppRouteModule = {
  path: '/system/dict',
  name: 'SystemDict',
  component: () => import('/@/views/system/dict/index.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.flow.dict'),
  },
};
