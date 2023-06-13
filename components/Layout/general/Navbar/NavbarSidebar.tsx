import {
  Box,
  Collapse,
  createStyles,
  getStylesRef,
  Navbar,
  SegmentedControl,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../../../Providers/AuthContext/AuthWrapper';
import { UserButton } from '../../inputs';
import { tabs } from '../../../../lib/tabs';
import { useNavigationContext } from '../../../Providers/NavigationContext/NavigationContext';

const useStyles = createStyles((theme, _params) => ({
  item: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[2],
    aspectRatio: '1 / 1',
    height: '100%',
    borderRadius: theme.radius.md,
    transition: 'all ease 0.2s',
    ':hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    },
  },

  user: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.sm,
    width: '100%',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3],
    },
  },

  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'all ease-in-out',
    padding: theme.spacing.md,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    width: '100%',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('Icon')}`]: {
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
    ref: getStylesRef('Icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('Icon')}`]: {
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
}));

function NavbarLink({ item, style }: { item: any; style?: any }) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const navigationContext = useNavigationContext();
  return (
    <Tooltip
      label={item.label}
      position="right"
      transitionProps={{
        duration: 0,
      }}
    >
      {/*@ts-ignore*/}
      <UnstyledButton
        className={cx(classes.link, item.classes, {
          [classes.linkActive]:
            item.link !== '/' ? router.asPath.startsWith(item.link) : item.link === router.asPath,
        })}
        {...(item.onClick
          ? { onClick: item.onClick }
          : {
              onClick: () => {
                navigationContext.handleClose();
                router.push(item.link);
              },
            })}
        style={style}
      >
        <item.Icon className={classes.linkIcon} stroke={1.5} />
        <Text span>{item.label}</Text>
      </UnstyledButton>
    </Tooltip>
  );
}

export const NavbarSidebar = () => {
  const { openConfirmModal } = useModals();
  const { user, logout } = useAuth();
  const [section, setSection] = useState<'userPages' | 'adminPages'>('userPages');
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [visible, toggle] = useToggle();
  const { closeAll } = useModals();
  const links = tabs[section].map((item) => <NavbarLink item={item} key={item.label} />);

  const handleLogout = () => {
    openConfirmModal({
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

  return (
    <Box sx={{ height: '100%' }}>
      <Navbar width={{ base: 300 }} className={classes.navbar} hiddenBreakpoint="sm">
        {user?.role === 'ADMIN' && (
          <Navbar.Section>
            <SegmentedControl
              onFocusCapture={(event) => event.target.blur()}
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
            <Box>
              <Collapse in={visible}>
                <NavbarLink
                  item={{
                    link: '/profile',
                    label: 'Профиль',
                    Icon: IconUser,
                  }}
                />
                <UnstyledButton className={cx(classes.link, classes.logout)} onClick={handleLogout}>
                  <IconLogout className={classes.linkIcon} stroke={1.5} />
                  <Text>Выйти</Text>
                </UnstyledButton>
              </Collapse>
              <UserButton
                image={user.avatarUrl || ''}
                name={user.username as string}
                email={user.email}
                onClick={() => toggle()}
              />
            </Box>
          )}
          {!user && (
            <UnstyledButton
              className={classes.link}
              sx={{ marginBottom: 0 }}
              onClick={(event) => {
                event.preventDefault();
                closeAll();
                router.push('/auth/signin');
              }}
            >
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <Text span>Вход</Text>
            </UnstyledButton>
          )}
        </Navbar.Section>
      </Navbar>
    </Box>
  );
};
