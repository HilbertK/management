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
