import type { AppRouteModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

export const UserRoute: AppRouteModule = {
  path: '/system/user',
  name: 'SystemUser',
  component: () => import('/@/views/system/user/index.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.userCenter.users'),
  },
};

export const RoleRoute: AppRouteModule = {
  path: '/system/role',
  name: 'SystemRole',
  component: () => import('/@/views/system/role/index.vue'),
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.userCenter.role'),
  },
};
