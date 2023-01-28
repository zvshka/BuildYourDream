import {
  Collapse,
  createStyles,
  Navbar,
  SegmentedControl,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { Icon3dCubeSphere, IconCpu, IconDeviceDesktop, IconLogout, IconUser } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { NextLink } from '@mantine/next';
import { useState } from 'react';
import { useAuth } from '../../Providers/Auth/AuthWrapper';
import { UserButton } from '../UserButton/UserButton';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');

  return {
    navbar: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    title: {
      textTransform: 'uppercase',
      letterSpacing: -0.25,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      width: '100%',
      marginBottom: theme.spacing.sm,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    logout: {
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.darken(
                theme.fn.variant({ variant: 'filled', color: 'red' }).background as string,
                0.2
              )
            : theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: 'red' }).background as string,
                0.2
              ),
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },

    footer: {
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
      paddingTop: theme.spacing.md,
    },
  };
});

const tabs = {
  userPages: [
    { link: '/', label: 'Конфигуратор', icon: IconCpu },
    { link: '/configs', label: 'Пользовательские сборки', icon: IconDeviceDesktop },
    { link: '/components', label: 'Комплектующие', icon: Icon3dCubeSphere },
  ],
  adminPages: [
    { link: '/admin/users', label: 'Пользователи', icon: IconUser },
    { link: '/admin/configs', label: 'Сборки', icon: Icon3dCubeSphere },
    { link: '/admin/configurator', label: 'Настройка конфигуратора', icon: Icon3dCubeSphere },
  ],
};

export function NavbarSimpleColored({ opened }: any) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [visible, toggle] = useToggle();
  const modals = useModals();
  const { user, logout } = useAuth();
  const [section, setSection] = useState<'userPages' | 'adminPages'>('userPages');

  const handleLogout = () => {
    modals.openConfirmModal({
      title: 'Вы уверены?',
      children: <Text size="sm">После подтверждения вам придётся войти в аккаунт снова</Text>,
      labels: { confirm: 'Конечно', cancel: 'Нет' },
      onConfirm() {
        logout();
        showNotification({
          title: 'Успех',
          message: 'Вы успешно вышли из аккаунта',
          color: 'green',
        });
      },
      onCancel() {},
    });
  };

  const links = tabs[section].map((item) => (
    <UnstyledButton
      href={item.link}
      key={item.label}
      component={NextLink}
      className={cx(classes.link, {
        [classes.linkActive]:
          item.link !== '/' ? router.asPath.startsWith(item.link) : item.link === router.asPath,
      })}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </UnstyledButton>
  ));

  return (
    <Navbar
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
      hidden={!opened}
      hiddenBreakpoint="sm"
    >
      {user?.role === 'ADMIN' && (
        <Navbar.Section>
          <SegmentedControl
            value={section}
            onChange={(value: 'userPages' | 'adminPages') => setSection(value)}
            transitionTimingFunction="ease"
            fullWidth
            data={[
              { label: 'User', value: 'userPages' },
              { label: 'Admin', value: 'adminPages' },
            ]}
          />
        </Navbar.Section>
      )}

      <Navbar.Section grow mt={user?.role === 'ADMIN' ? 'xl' : 0}>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {user && (
          <>
            <Collapse in={visible}>
              <UnstyledButton href="/profile" component={NextLink} className={classes.link}>
                <IconUser className={classes.linkIcon} stroke={1.5} />
                <span>Профиль</span>
              </UnstyledButton>
              <UnstyledButton className={cx(classes.link, classes.logout)} onClick={handleLogout}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Выйти</span>
              </UnstyledButton>
            </Collapse>
            <UserButton
              image=""
              name={user.username as string}
              email={user.email}
              onClick={() => toggle()}
            />
          </>
        )}
        {!user && (
          <UnstyledButton
            className={classes.link}
            sx={{ marginBottom: 0 }}
            component={NextLink}
            href="/auth/signin"
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Вход</span>
          </UnstyledButton>
        )}
      </Navbar.Section>
    </Navbar>
  );
}
