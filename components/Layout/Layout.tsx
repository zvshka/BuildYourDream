import React, { ReactElement, useState } from 'react';
import { AppShell, useMantineTheme } from '@mantine/core';
import { NavbarSimpleColored } from './Navbar/Navbar';
import { HeaderWithLogo } from './Header/HeaderWithLogo';

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[] | string | undefined;
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={<NavbarSimpleColored opened={opened} />}
      header={<HeaderWithLogo opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
}
