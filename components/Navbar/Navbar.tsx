import { useState } from 'react';
import { Collapse, createStyles, Navbar } from '@mantine/core';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconUser,
} from '@tabler/icons';
import { UserButton } from '../UserButton/UserButton';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useToggle } from '@mantine/hooks';

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

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
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
  { link: '/', label: 'Главная', icon: IconBellRinging },
  { link: '/configs', label: 'Пользовательский сборки', icon: IconReceipt2 },
  { link: '/security', label: 'Security', icon: IconFingerprint },
  { link: '/ssh', label: 'SSH Keys', icon: IconKey },
  { link: '/databases', label: 'Databases', icon: IconDatabaseImport },
  { link: '/auth', label: 'Authentication', icon: Icon2fa },
  { link: '/other', label: 'Other Settings', icon: IconSettings },
];

export function NavbarSimpleColored({ opened }: any) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [visible, toggle] = useToggle();

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
          <Link href="/profile">
            <a className={classes.link}>
              <IconUser className={classes.linkIcon} stroke={1.5} />
              <span>Профиль</span>
            </a>
          </Link>
          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Выйти</span>
          </a>
        </Collapse>
        <UserButton image="" name="Username" email="email@email.com" onClick={() => toggle()} />
      </Navbar.Section>
    </Navbar>
  );
}
