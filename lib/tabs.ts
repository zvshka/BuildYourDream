import {
  Icon3dCubeSphere,
  IconCpu,
  IconDeviceDesktop,
  IconFlag,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';

export const tabs = {
  userPages: [
    { link: '/', label: 'Конфигуратор', Icon: IconCpu },
    { link: '/configs', label: 'Конфигурации', Icon: IconDeviceDesktop },
    { link: '/components', label: 'Комплектующие', Icon: Icon3dCubeSphere },
    { link: '/community', label: 'Комьюнити', Icon: IconUsersGroup },
  ],
  adminPages: [
    { link: '/admin/users', label: 'Пользователи', Icon: IconUser },
    { link: '/admin/configurator', label: 'Конфигуратор', Icon: Icon3dCubeSphere },
    { link: '/admin/reports', label: 'Жалобы', Icon: IconFlag },
  ],
};
