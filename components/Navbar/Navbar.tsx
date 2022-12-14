import { Collapse, createStyles, Navbar, Text, UnstyledButton } from '@mantine/core';
import {
  Icon3dCubeSphere,
  IconBell,
  IconCpu,
  IconDots,
  IconLogout,
  IconMessage,
  IconUser,
  IconUsers,
  IconWorld,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { NextLink } from '@mantine/next';
import Link from 'next/link';
import { useAuth } from '../Auth/AuthProvider';
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
  { link: '/', label: '????????????????????????', icon: IconCpu },
  { link: '/configs', label: '???????????????????????????????? ????????????', icon: IconWorld },
  // { link: '/profile', label: '??????????????', icon: IconUser },
  { link: '/notifications', label: '??????????????????????', icon: IconBell },
  { link: '/parts', label: '??????????????????????????', icon: Icon3dCubeSphere },
  { link: '/chat', label: '??????', icon: IconMessage },
  // { link: '/other', label: '????????????', icon: IconDots },
];

export function NavbarSimpleColored({ opened }: any) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [visible, toggle] = useToggle();
  const modals = useModals();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    modals.openConfirmModal({
      title: '???? ???????????????',
      children: <Text size="sm">?????????? ?????????????????????????? ?????? ???????????????? ?????????? ?? ?????????????? ??????????</Text>,
      labels: { confirm: '??????????????', cancel: '??????' },
      onConfirm() {
        logout();
        showNotification({
          title: '??????????',
          message: '???? ?????????????? ?????????? ???? ????????????????',
          color: 'green',
        });
      },
      onCancel() {},
    });
  };

  const links = data.map((item) => (
    <UnstyledButton
      href={item.link}
      key={item.label}
      component={NextLink}
      className={cx(classes.link, { [classes.linkActive]: item.link === router.asPath })}
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
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {user && (
          <>
            <Collapse in={visible}>
              <UnstyledButton href="/profile" component={NextLink} className={classes.link}>
                <IconUser className={classes.linkIcon} stroke={1.5} />
                <span>??????????????</span>
              </UnstyledButton>
              <UnstyledButton className={cx(classes.link, classes.logout)} onClick={handleLogout}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>??????????</span>
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
            <span>????????</span>
          </UnstyledButton>
        )}
      </Navbar.Section>
    </Navbar>
  );
}
