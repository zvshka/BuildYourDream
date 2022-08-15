import { Collapse, createStyles, Navbar, Text, UnstyledButton } from '@mantine/core';
import {
  IconBell,
  IconCpu,
  IconDots,
  IconLogout,
  IconMessage,
  IconSettings,
  IconUser,
  IconUsers,
  IconWorld,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useToggle } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification, useNotifications } from '@mantine/notifications';
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

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
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
            ? theme.fn.darken(theme.fn.variant({ variant: 'filled', color: 'red' }).background, 0.2)
            : theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: 'red' }).background,
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

const data = [
  { link: '/', label: 'Конфигуратор', icon: IconCpu },
  { link: '/configs', label: 'Пользовательские сборки', icon: IconWorld },
  { link: '/profile', label: 'Профиль', icon: IconUser },
  { link: '/notifications', label: 'Уведомления', icon: IconBell },
  { link: '/settings', label: 'Настройки', icon: IconSettings },
  { link: '/other', label: 'Прочее', icon: IconDots },
  { link: '/chat', label: 'Чат', icon: IconMessage },
];

export function NavbarSimpleColored({ opened }: any) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [visible, toggle] = useToggle();
  const modals = useModals();

  const handleLogout = () => {
    modals.openConfirmModal({
      title: 'Вы уверены?',
      children: <Text size="sm">После подтверждения вам придётся войти в аккаунт снова</Text>,
      labels: { confirm: 'Конечно', cancel: 'Нет' },
      onConfirm() {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно вышли из аккаунта',
          color: 'green',
        });
      },
      onCancel() {},
    });
  };

  const links = data.map((item) => (
    <Link href={item.link} key={item.label} passHref>
      <a className={cx(classes.link, { [classes.linkActive]: item.link === router.asPath })}>
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
    </Link>
  ));

  return (
    <Navbar
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
      hidden={!opened}
      hiddenBreakpoint="sm"
    >
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Collapse in={visible}>
          <Link href="/change-user">
            <a className={classes.link}>
              <IconUsers className={classes.linkIcon} stroke={1.5} />
              <span>Сменить пользователя</span>
            </a>
          </Link>
          <UnstyledButton className={cx(classes.link, classes.logout)} onClick={handleLogout}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Выйти</span>
          </UnstyledButton>
        </Collapse>
        <UserButton image="" name="Username" email="email@email.com" onClick={() => toggle()} />
      </Navbar.Section>
    </Navbar>
  );
}
