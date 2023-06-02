import React, { ReactElement } from 'react';
import { AppShell, useMantineTheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { NavbarSimpleColored } from './general/Navbar/Navbar';
import { HeaderWithLogo } from './general/Header/HeaderWithLogo';
import { useNavigationContext } from '../Providers/NavigationContext/NavigationContext';

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[] | string | undefined;
}) {
  const theme = useMantineTheme();
  const navigationContext = useNavigationContext();

  useHotkeys([
    [
      'Escape',
      () => {
        if (navigationContext.opened) navigationContext.setClosed();
        else navigationContext.setOpened();
      },
    ],
  ]);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
          paddingLeft: '16px',
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={<NavbarSimpleColored />}
      header={<HeaderWithLogo />}
    >
      {children}
    </AppShell>
  );
}
